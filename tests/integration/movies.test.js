const app = require("../../index");
const supertest = require("supertest");
const req = supertest(app);
const { Movie } = require("../../models/movie");
const mongoose = require("mongoose");
const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");

describe("/api/movies", () => {
  afterEach(async () => {
    await Movie.deleteMany({});
    await Genre.deleteMany({});
  });
  describe("get /", () => {
    it("should return all Movies", async () => {
      const genre = new Genre({ name: "moviessgenre" });
      await genre.save();
      await Movie.insertMany([
        {
          title: "herapheri",
          dailyRentalRate: 5,
          numberInStock: 3,
          genre: { name: genre.name, _id: genre._id },
        },
        {
          title: "golmaal",
          dailyRentalRate: 3,
          numberInStock: 7,
          genre: { name: genre.name, _id: genre._id },
        },
      ]);
      const res = await req.get("/api/movies");

      expect(
        res.body.some((moviepara) => moviepara.title === "herapheri")
      ).toBeTruthy();
      expect(
        res.body.some((moviepara) => moviepara.dailyRentalRate === 5)
      ).toBeTruthy();
      expect(
        res.body.some((moviepara) => moviepara.title === "golmaal")
      ).toBeTruthy();
      expect(
        res.body.some((moviepara) => moviepara.dailyRentalRate === 3)
      ).toBeTruthy();
    });
  });
  describe("get /:id", () => {
    it("should return 400 if movie id is invalid", async () => {
      const res = await req.get("/api/movies/" + 1);
      expect(res.status).toBe(400);
    });
    it("should return 404 if movie id is not found", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await req.get("/api/movies" + id);
      expect(res.status).toBe(404);
    });

    it("should return movie if id is valid", async () => {
      const genre = new Genre({ name: "animation" });
      await genre.save();
      const movie = new Movie({
        title: "dhammal",
        dailyRentalRate: 6,
        numberInStock: 3,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
      });
      await movie.save();
      const res = await req.get("/api/movies/" + movie._id);
      expect(res.body).toHaveProperty("title", "dhammal");
    });
  });

  describe("post /", () => {
    it("should return 401 if token is invalid", async () => {
      const res = await req
        .post("/api/movies")
        .send({ title: "phirherapheri" });
      expect(res.status).toBe(401);
    });
    it("should return 400 if title name is less than 5 characters ", async () => {
      const token = new User({}).getAuthToken();
      const genre = new Genre({ name: "animation" });
      await genre.save();
      const res = await req
        .post("/api/movies")
        .set("x-auth-token", token)
        .send({ title: "hel", dailyRentalRate: 7, numberInStock: 3 });
      expect(res.status).toBe(400);
    });

    it("should return 400 if title name is more than 50 characters ", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({ name: "animation" });
      await genre.save();
      const res = await req
        .post("/api/movies")
        .set("x-auth-token", token)
        .send({
          title: "helfghghbvbhgfghgvcdfghjhbvcdfghbvfghbvcfgyuytrfdfgfgcdfghfg",
          dailyRentalRate: 7,
          numberInStock: 3,
        });
      expect(res.status).toBe(400);
    });
    it("should return 400 if dailyrentalrate is less than 0 ", async () => {
      const token = new User({}).getAuthToken();
      const genre = new Genre({ name: "animation" });
      await genre.save();
      const res = await req
        .post("/api/movies")
        .set("x-auth-token", token)
        .send({ title: "hel", dailyRentalRate: -7, numberInStock: 3 });
      expect(res.status).toBe(400);
    });
    it("should return 400 if numberInStock is less than 0 ", async () => {
      const token = new User({}).getAuthToken();
      const genre = new Genre({ name: "animation" });
      await genre.save();
      const res = await req
        .post("/api/movies")
        .set("x-auth-token", token)
        .send({ title: "hel", dailyRentalRate: 7, numberInStock: -3 });
      expect(res.status).toBe(400);
    });

    it("should save the movie if valid ", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({ name: "comedy" });
      await genre.save();
      await req.post("/api/movies").set("x-auth-token", token).send({
        title: "golmaal2",
        dailyRentalRate: 6,
        numberInStock: 3,
        genreId: genre._id,
      });
      const movie = await Movie.find({ title: "golmaal2" });
      expect(movie).not.toBe(null);
    });
    it("should return the saved movie ", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({ name: "comedy" });
      await genre.save();
      const res = await req
        .post("/api/movies")
        .set("x-auth-token", token)
        .send({
          title: "malamaal",
          dailyRentalRate: 4,
          numberInStock: 8,
          genre_id:genre._id,
        });
      expect(res.body).toHaveProperty("title","malamaal");
    });
  });

  describe("put /:id", () => {
    it("should return 401 if the token is not valid", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await req.put("/api/movies/" + id);
      expect(res.status).toBe(401);
    });

    it("should return 400 if title length is less than 5 characters", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({
        name: "comedy",
      });
      await genre.save();
      const movie = new Movie({
        title: "dedhakka",
        dailyRentalRate: 43,
        numberInStock: 74,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();
      const res = await req
        .put("/api/movies/" + movie._id)
        .set("x-auth-token", token)
        .send({ title: "t1", dailyRentalRate: 1, numberInStock: 1 });
      expect(res.status).toBe(400);
    });

    it("should return 400 if title length is more than 50 characters", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({
        name: "comedy",
      });
      await genre.save();
      const movie = new Movie({
        title: "banavabanvi",
        dailyRentalRate: 55,
        numberInStock: 77,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();
      const res = await req
        .put("/api/movies/" + movie._id)
        .set("x-auth-token", token)
        .send({
          title: "vsghsvdhdbdasdsdhdhbdvvdjhvdddhvvysvyscsshhyducdhdvhdvdd",
          dailyRentalRate: 3,
          numberInStock: 11,
        });
      expect(res.status).toBe(400);
    });

    it("should return 400 if dailyRentalRate is less than 0", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({
        name: "comedy",
      });
      await genre.save();
      const movie = new Movie({
        title: "dedhakka",
        dailyRentalRate: 43,
        numberInStock: 74,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();
      const res = await req
        .put("/api/movies/" + movie._id)
        .set("x-auth-token", token)
        .send({ title: "t1", dailyRentalRate: -1, numberInStock: 4 });
      expect(res.status).toBe(400);
    });

    it("should return 400 if numberInStock is less than 0", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({
        name: "comedy",
      });
      await genre.save();
      const movie = new Movie({
        title: "dedhakka",
        dailyRentalRate: 43,
        numberInStock: 34,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();
      const res = await req
        .put("/api/movies/" + movie._id)
        .set("x-auth-token", token)
        .send({ title: "t1", dailyRentalRate: 11, numberInStock: -4 });
      expect(res.status).toBe(400);
    });

    it("should return 404 if movie is not found", async () => {
      const token = new User().getAuthToken();
      const id = new mongoose.Types.ObjectId();
      const res = await req.put("/api/movies" + id).set("x-auth-token", token);

      expect(res.status).toBe(404);
    });

    it("should update movie if id is valid", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({
        name: "comedy",
      });
      await genre.save();
      const movie = new Movie({
        title: "golmaal20",
        dailyRentalRate: 9,
        numberInStock: 16,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();

      await req
        .put("/api/movies/" + movie._id)
        .set("x-auth-token", token)
        .send({
          title: "golmalreturn",
          dailyRentalRate: 8,
          numberInStock: 2,
          genre_id:genre._id
        });
      // const movies = await Movie.findOne({ title: "golmalreturn" });
      // console.log(movies);
      // expect(movies).not.toBe(null);
      const movies = await Movie.findOne({title:"golmalreturn"});
      expect(movies).toHaveProperty("title", "golmalreturn");
    });


    it("should return movie if valid", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({
        name: "comedy",
      });
      await genre.save();
      let movies = new Movie({
        title: "dhammal",
        dailyRentalRate: 22,
        numberInStock: 34,
        genre: { name: genre.name, _id: genre._id },
      });
      await movies.save();

      const res = await req
        .put("/api/movies/" + movies._id)
        .set("x-auth-token", token)
        .send({
          title: "herapheri",
          dailyRentalRate: 8,
          numberInStock: 9,
          genre_id: genre._id,
        });
      // expect(res.body).not.toBeNull();
      console.log(res.body);
      expect(res.body).toHaveProperty("title", "herapheri");
    });
  });

  describe("delete /:id", () => {
    it("should return 401 token is not valid", async () => {
      const genre = new Genre({ name: "actionmovie" });
      await genre.save();
      let movie = new Movie({
        title: "Holiday",
        dailyRentalRate: 5,
        numberInStock: 23,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();
      const res = await req.delete("/api/movies/" + movie._id);
      expect(res.status).toBe(401);
    });

    it("should return 403 if user is not admin", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({ name: "genere" });
      await genre.save();
      let movie = new Movie({
        title: "golmaal",
        dailyRentalRate: 7,
        numberInStock: 4,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();
      const res = await req
        .delete("/api/movies/" + movie._id)
        .set("x-auth-token", token);
      expect(res.status).toBe(403);
    });

    it("should return 400 if id is invalid", async () => {
      const token = new User({ isAdmin: true }).getAuthToken();
      const res = await req
        .delete("/api/movies/" + 2)
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });

    it("should return 404 if no movie is not found", async () => {
      const token = new User({ isAdmin: true }).getAuthToken();
      const id = new mongoose.Types.ObjectId();
      const res = await req
        .delete("/api/movies/" + id)
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });

    it("should delete the movie if input  is valid", async () => {
      const token = new User({ isAdmin: true }).getAuthToken();
      const genre = new Genre({ name: "genrenew" });
      await genre.save();
      const movie = new Movie({
        title: "blackpanther",
        dailyRentalRate: 3,
        numberInStock: 5,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();
      await req.delete("/api/movies/" + movie._id).set("x-auth-token", token);
      const movies = await Movie.findById(movie._id);
      expect(movies).toBe(null);
    });

    it("should return the deleted movie", async () => {
      const token = new User({ isAdmin: true }).getAuthToken();
      const genre = new Genre({ name: "comedy" });
      await genre.save();
      const movie = new Movie({
        title: "dhammal",
        dailyRentalRate: 3,
        numberInStock: 9,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();
      const res = await req
        .delete("/api/movies/" + movie._id)
        .set("x-auth-token", token);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("title", movie.title);
    });
  });
});
