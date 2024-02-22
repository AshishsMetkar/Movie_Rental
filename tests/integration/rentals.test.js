const app = require("../../index");
const supertest = require("supertest");
const req = supertest(app);
const { User } = require("../../models/user");
const { Rental } = require("../../models/rental");
const mongoose = require("mongoose");
const { Genre } = require("../../models/genre");
const { Customer } = require("../../models/customer");
const { Movie } = require("../../models/movie");

describe("/api/rentals", () => {
  afterEach(async () => {
    await Rental.deleteMany({}),
      await Customer.deleteMany({}),
      await Genre.deleteMany({}),
      await Movie.deleteMany({});
  });
  describe("get /", () => {
    it("should return all rentals", async () => {
      const customer = new Customer({
        name: "surya",
        phone: "354I3732",
      });
      await customer.save();
      const movie = new Movie({
        title: "farzand",
        dailyRentalRate: 34,
        numberInStock: 26,
        liked: true,
      });
      await movie.save();

      await Rental.collection.insertMany([
        {
          customer: {
            name: customer.name,
            phone: customer.phone,
            _id: customer._id,
          },
          movie: {
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
            numberInStock: movie.numberInStock,
            liked: movie.liked,
          },
          rentalFee: movie.dailyRentalRate * 10,
          dateOut: new Date(),
          dateIn: null,
        },
        {
          customer: {
            name: customer.name,
            phone: customer.phone,
            _id: customer._id,
          },
          movie: {
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
            numberInStock: movie.numberInStock,
            liked: movie.liked,
          },
          rentalFee: movie.dailyRentalRate * 10,
          dateOut: new Date(),
          dateIn: null,
        },
      ]);

      const res = await req.get("/api/rentals");

      expect(
        res.body.some(
          (rentalparameter) => rentalparameter.movie.title === "farzand"
        )
      ).toBeTruthy();
      expect(
        res.body.some(
          (rentalparameter) => rentalparameter.customer.name === "surya"
        )
      ).toBeTruthy();
    });
  });

  describe("get /:id", () => {
    it("should return 400 if rental id is invalid", async () => {
      const response = await req.get("/api/rentals/" + 1);
      expect(response.status).toBe(400);
    });
    it("should return 404 if rental id is not found", async () => {
      const id = new mongoose.Types.ObjectId();
      const response = await req.get("/api/rentals" + id);
      expect(response.status).toBe(404);
    });
    it("should return rental if rental id is valid", async () => {
      const genre = new Genre({
        name: "comedy",
      });
      await genre.save();
      const customer = new Customer({
        name: "surya",
        phone: "43565734",
      });

      await customer.save();

      const movie = new Movie({
        title: "Herapheri",
        dailyRentalRate: 3,
        numberInStock: 54,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();

      const rental = new Rental({
        movie: {
          _id: movie._id,
          title: movie.title,
          dailyRentalRate: movie.dailyRentalRate,
          numberInStock: movie.numberInStock,
        },
        customer: {
          name: customer.name,
          phone: customer.phone,
          _id: customer._id,
        },
        rentalFee: movie.dailyRentalRate * 10,
        dateOut: new Date(),
        dateIn: null,
      });
      await rental.save();
      const res = await req.get("/api/rentals/" + rental._id);
      expect(res.body).toHaveProperty("movie.title", "Herapheri");
      expect(res.body).toHaveProperty("customer.name", "surya");
    });
  });

  describe("post /", () => {
    it("should return 401 if token is not valid ", async () => {
      const res = await req.post("/api/rentals");
      expect(res.status).toBe(401);
    });
    it("should return 400  if customer id is not sent", async () => {
      const genre = new Genre({
        name: "comedy",
      });
      await genre.save();
      const customer = new Customer({
        name: "surya",
        phone: "43566434",
      });

      await customer.save();

      const movie = new Movie({
        title: "Herapheri",
        dailyRentalRate: 3,
        numberInStock: 54,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();

      const token = new User().getAuthToken();
      const res = await req
        .post("/api/rentals")
        .set("x-auth-token", token)
        .send({ movieId: movie._id });
      expect(res.status).toBe(400);
    });

    it("should return 400  if movie id is not sent", async () => {
      const genre = new Genre({
        name: "comedy",
      });
      await genre.save();
      const customer = new Customer({
        name: "nitin",
        phone: "35657477",
      });

      await customer.save();

      const movie = new Movie({
        title: "golmaaal",
        dailyRentalRate: 32,
        numberInStock: 5,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();

      const token = new User().getAuthToken();
      const res = await req
        .post("/api/rentals")
        .set("x-auth-token", token)
        .send({ customerId: customer._id });
      expect(res.status).toBe(400);
    });

    it("should return 400 if numberInStock is 0", async () => {
      const genre = new Genre({
        name: "comedy",
      });
      await genre.save();

      const customer = new Customer({
        name: "nitinl",
        phone: "35634272",
      });
      await customer.save();

      const movie = new Movie({
        title: "Dhammal",
        dailyRentalRate: 32,
        numberInStock: 0,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();

      const token = new User().getAuthToken();
      const res = await req
        .post("/api/rentals")
        .set("x-auth-token", token)
        .send({ customerId: customer._id, movieId: movie._id });
      expect(res.status).toBe(400);
    });


    it("should return 200 and save the rental if  valid", async () => {
      const genre2 = new Genre({
        name: "comedy",
      });
      await genre2.save();

      const customer2 = new Customer({
        name: "nitinl",
        phone: "356889672",
      });
      await customer2.save();

      const movie2 = new Movie({
        title: "GolmaalReturns",
        dailyRentalRate: 2,
        numberInStock: 8,
        genre: { name: genre2.name, _id: genre2._id },
      });
      await movie2.save();

      const token = new User().getAuthToken();
      const res = await req
        .post("/api/rentals")
        .set("x-auth-token", token)
        .send({ customerId: customer2._id, movieId: movie2._id });
      expect(res.status).toBe(200);
      const rental = await Rental.findOne({ "movie.title": "GolmaalReturns" });
      console.log(rental);
      expect(rental).not.toBe(null);
    });

    it("should return the saved rental if valid", async () => {
      const genres = new Genre({
        name: "animation",
      });
      await genres.save();

      const customernew = new Customer({
        name: "suryalad",
        phone: "25373888",
      });

      await customernew.save();
      // console.log(customernew._id);
      const movienew = new Movie({
        title: "avatar",
        dailyRentalRate: 34,
        numberInStock: 3,
        genre_id: genres._id,
      });
      await movienew.save();
      // console.log(movienew._id);
      const token = new User().getAuthToken();

      const res = await req
        .post("/api/rentals")
        .set("x-auth-token", token)
        .send({ customerId: customernew._id, movieId: movienew._id });
      console.log(res.body);
      expect(res.body.customer).toHaveProperty("name", "suryalad");
    });


    it("should decrease numberInStock of movie by 1 if valid", async () => {
      const genre26 = new Genre({ name: "action" });
      await genre26.save();
      const customer26 = new Customer({
        name: "ashishm",
        phone: "122556789",
      });
      await customer26.save();
      let movie26 = new Movie({
        title: "holiday",
        dailyRentalRate: 8,
        numberInStock: 7,
        genre: { name: genre26.name, _id: genre26._id },
      });
      await movie26.save();
    
      const token = new User().getAuthToken();
      await req
        .post("/api/rentals/")
        .set("x-auth-token", token)
        .send({ customerId: customer26._id, movieId: movie26._id });
      movie26 = await Movie.findById( movie26._id);
      expect(movie26.numberInStock).toBe(6);
    });
  });


  describe("patch /:id", () => {
    it("should return 401 if token is invalid", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await req.delete("/api/rentals/" + id);
      expect(res.status).toBe(401);
    });
    it("should return 400 if id is invalid", async () => {
      const token = new User().getAuthToken();
      const res = await req
        .patch("/api/rentals/" + 1)
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });

    it("should update the rental if data is valid", async () => {

      const genre23 = new Genre({ name: "marathicomedy" });
      await genre23.save();
      const customer23 = new Customer({
        name: "surya",
        phone: "126056789",
      });
      await customer23.save();
      const movie23 = new Movie({
        title: "ajabgajab",
        dailyRentalRate: 9,
        numberInStock: 10,
        genre: { name: genre23.name, _id: genre23._id },
      });
      await movie23.save();
      let rental = new Rental({
        customer: {
          name: customer23.name,
          phone: customer23.phone,
          _id: customer23._id,
        },
        movie: {
          title: movie23.title,
          dailyRentalRate: movie23.dailyRentalRate,
          numberInStock: movie23.numberInStock,
          _id: movie23._id,
        },
        rentalFee: 90,
      });
      await rental.save();
      
      const token = new User().getAuthToken();

      await req
        .patch("/api/rentals" + rental._id)
        .set("x-auth-token",token)
        .send({ dateIn: new Date() });

      rental = await Rental.findOne({ "movie.title": "ajabgajab" });
      expect(rental.dateIn).not.toBe(null);
    });

    it("should send updated rental if data is valid", async () => {
      const genre24 = new Genre({ name: "thrill" });
      await genre24.save();
      const customer24 = new Customer({
        name: "sachinc",
        phone: "7545766447",
      });
      await customer24.save();
      const movie24 = new Movie({
        title: "ready",
        dailyRentalRate: 1.1,
        numberInStock: 10,
        genre: { name: genre24.name, _id: genre24._id },
      });
      await movie24.save();
      let rental = new Rental({
        customer: {
          name: customer24.name,
          phone: customer24.phone,
          _id: customer24._id,
        },
        movie: {
          title: movie24.title,
          dailyRentalRate: movie24.dailyRentalRate,
          numberInStock: movie24.numberInStock,

          _id: movie24._id,
        },
        rentalFee: 24,
      });
      await rental.save();
      const token = new User().getAuthToken();
      const res = await req
        .patch("/api/rentals/" + rental._id)
        .set("x-auth-token", token)
        .send({ dateIn: new Date() });
      expect(res.body.dateIn).not.toBeNull();
    });


    it("should increse numberInStock of movie by 1 if valid", async () => {
      const genre25 = new Genre({ name: "action" });
      await genre25.save();
      const customer25 = new Customer({
        name: "ashishm",
        phone: "122556789",
      });
      await customer25.save();
      let movie25 = new Movie({
        title: "holiday",
        dailyRentalRate: 4,
        numberInStock: 17,
        genre: { name: genre25.name, _id: genre25._id },
      });
      await movie25.save();
      let rental = new Rental({
        customer: {
          name: customer25.name,
          phone: customer25.phone,
          _id: customer25._id,
        },
        movie: {
          title: movie25.title,
          dailyRentalRate: movie25.dailyRentalRate,
          numberInStock: movie25.numberInStock,

          _id: movie25._id,
        },
        rentalFee: 40,
      });
      await rental.save();
      const token = new User().getAuthToken();
      await req
        .patch("/api/rentals/" + rental._id)
        .set("x-auth-token", token)
        .send({ dateIn: new Date() });
      movie25 = await Movie.findById(movie25._id);
      expect(movie25.numberInStock).toBe(18);
    });

  });

  describe("delete /:id", () => {
    it("should return 401 if valid token is not provided", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await req.delete("/api/rentals/" + id);
      expect(res.status).toBe(401);
    });

    it("should return 403 if user is not admin", async () => {
      const id = new mongoose.Types.ObjectId();
      const token = new User({
        isAdmin: false,
      }).getAuthToken();
      const res = await req
        .delete("/api/rentals/" + id)
        .set("x-auth-token", token);
      expect(res.status).toBe(403);
    });

    it("should return 400 if id is invalid", async () => {
      const user = new User({
        isAdmin: true,
      });
      const token = user.getAuthToken();
      const res = await req.delete("/api/rentals/"+4).set("x-auth-token", token);
      expect(res.status).toBe(400);
    });

    it("should return 404 if rental id is not found", async () => {
      const token = new User({ isAdmin: true }).getAuthToken();
      const id = new mongoose.Types.ObjectId();
      const res = await req
        .delete("/api/rentals/" + id)
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });

    it("should delete rental if data is valid", async () => {
      const genre20 = new Genre({ name: "marathicomedy" });
      await genre20.save();
      const customer20 = new Customer({
        name: "surya",
        phone: "126056789",
      });
      await customer20.save();
      const movie20 = new Movie({
        title: "banavabanvi",
        dailyRentalRate: 3,
        numberInStock: 10,
        genre: { name: genre20.name, _id: genre20._id },
      });
      await movie20.save();
      let rental = new Rental({
        customer: {
          name: customer20.name,
          phone: customer20.phone,
          _id: customer20._id,
        },
        movie: {
          title: movie20.title,
          dailyRentalRate: movie20.dailyRentalRate,
          numberInStock: movie20.numberInStock,
          _id: movie20._id,
        },
        rentalFee: 30,
      });
      await rental.save();

      const token = new User({
        isAdmin: true,
      }).getAuthToken();

      await req.delete("/api/rentals/" + rental._id).set("x-auth-token", token);
      rental = await Rental.findById(rental._id);
      expect(rental).toBe(null);
    });

    it("should send deleted rental if valid", async () => {
      const genre21 = new Genre({ name: "marathithriller" });
      await genre21.save();
      const customer21 = new Customer({
        name: "ashish",
        phone: "873543783",
      });
      await customer21.save();
      const movie21 = new Movie({
        title: "farzand",
        dailyRentalRate: 12,
        numberInStock: 10,
        genre: { name: genre21.name, _id: genre21._id },
      });
      await movie21.save();
      let rental = new Rental({
        customer: {
          name: customer21.name,
          phone: customer21.phone,
          _id: customer21._id,
        },
        movie: {
          title: movie21.title,
          dailyRentalRate: movie21.dailyRentalRate,
          numberInStock: movie21.numberInStock,

          _id: movie21._id,
        },
        rentalFee: 120,
      });
      await rental.save();
      const token = new User({
        _id: new mongoose.Types.ObjectId(),
        isAdmin: true,
      }).getAuthToken();
      const res = await req
        .delete("/api/rentals/" + rental._id)
        .set("x-auth-token", token);
      expect(res.body.movie.title).toBe("farzand");
    });

    it("should increase number in stock if movie is deleted by 1", async () => {
      const genre22 = new Genre({ name: "marathiaction" });
      await genre22.save();
      const customer22 = new Customer({
        name: "sachin",
        phone: "375632778",
      });
      await customer22.save();
      let movie22 = new Movie({
        title: "mauli",
        dailyRentalRate: 9,
        numberInStock: 78,
        genre: { name: genre22.name, _id: genre22._id },
      });
      await movie22.save();
      let rental = new Rental({
        customer: {
          name: customer22.name,
          phone: customer22.phone,
          _id: customer22._id,
        },
        movie: {
          title: movie22.title,
          dailyRentalRate: movie22.dailyRentalRate,
          numberInStock: movie22.numberInStock,
          _id: movie22._id,
        },
        rentalFee: 90,
      });
      await rental.save();
      const token = new User({
        isAdmin: true,
      }).getAuthToken();

      await req.delete("/api/rentals/" + rental._id).set("x-auth-token", token);
      movie22 = await Movie.findById(movie22._id);
      expect(movie22.numberInStock).toBe(79);
    });
  });
});
