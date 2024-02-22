const app = require("../../index");
const supertest = require("supertest");
const req = supertest(app);
const { Genre } = require("../../models/genre");
const  mongoose  = require("mongoose");
const { User } = require("../../models/user");
describe("/api/genres", () => {
  afterEach(async () => {
    await Genre.deleteMany({});
  });
  describe("get /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await req.get("/api/genres");
      console.log(res.body);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("get /:id", () => {
    it("should return 400 if genre id is invalid", async () => {
      const response = await req.get("/api/genres/" + 1);
      expect(response.status).toBe(400);
    });
    it("should return 404 if genre id is not found", async () => {
      const id = new mongoose.Types.ObjectId();
      const response = await req.get("/api/genres" + id);
      expect(response.status).toBe(404);
    });
    it("should return genre if genre id is valid", async () => {
      const genre = new Genre({
        name: "genre3",
      });
      await genre.save();
      const res = await req.get(`/api/genres/${genre._id}`);
      expect(res.body).toHaveProperty("name","genre3");
    });
  });

  describe("post /", () => {
    it("should return 401 if valid token is not provided", async () => {
      const res = await req.post("/api/genres");
      expect(res.status).toBe(401);
    });
    it("should return 400 if genre name is less than 5 characters", async () => {
      const token = new User().getAuthToken();
      const res = await req
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "g1" });
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre name is  more than 50 characters", async () => {
      const token = new User().getAuthToken();
      const res = await req
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({
          name: "gsjhfdddjdhdbdbbdhhdhddgvdvdghhdhdhhdbdbdhdhdhdbdbdhhdhfbbfhdhdhdvbsh",
        });
      expect(res.status).toBe(400);
    });

    it("should save the genre if valid ", async () => {
      const token = new User().getAuthToken();
      await req
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "genre4" });
      const genre = await Genre.findOne({ name: "genre4" });
      // console.log(genre);
      expect(genre).not.toBe(null);
      expect(genre).toHaveProperty("name", "genre4");
    });

    it("should return the saved genre is valid ", async () => {
      const token = new User().getAuthToken();
      const res = await req
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "genre5" });
      expect(res.body).toHaveProperty("name", "genre5");
    });
  });

  describe("put /:id", () => {
    it("should return 401 if valid token is not provided", async () => {
      const res = await req.put("/api/genres/"+1);
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre name is less than 5 characters", async () => {
      const token = new User().getAuthToken();
      const genre =new Genre({name:"genre5"})
      await genre.save()
      const res = await req
        .put("/api/genres/"+genre._id)
        .set("x-auth-token", token)
        .send({ name: "g3" });
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre name is  more than 50 characters", async () => {
      const token = new User().getAuthToken();
      const genre =new Genre({name:"genre6"})
      await genre.save()
      const res = await req.put("/api/genres/"+ genre._id).set("x-auth-token", token).send({
        name: "gsjhfdddjdhdbdbbdhhdhddgvdvdghhdhdhhdbdbdhdhdhdbdbdhhdhfbbfhtdhdhdvbsh",
      });
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre id is invalid", async () => {
      const token = new User().getAuthToken();
      const res = await req.put("/api/genres/"+1).set("x-auth-token",token)
      expect(res.status).toBe(400);
    });
    it("should return 404 if genre id is not found",async()=>{
      const id = new mongoose.Types.ObjectId();
      const res =await req.put("/api/genre/"+id);
      expect(res.status).toBe(404)
    })
    it("should update the genre if id is valid", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({ name: "genre12" });
      await genre.save();
      // console.log(genre._id);
      await req
        .put("/api/genres/" + genre._id)
        .set("x-auth-token", token)
        .send({ name: "genreid" });
      const updateg = await Genre.findOne({name:"genreid"});
      // console.log(updateg);
      expect(updateg).toHaveProperty("name","genreid")
    });
   it("should return the updated genre",async()=>{
    const token = new User().getAuthToken();
    const genre = new Genre({ name: "genre13" });
    await genre.save();
    console.log(genre._id);
    const res = await req
      .put("/api/genres/" + genre._id)
      .set("x-auth-token", token)
      .send({ name: "genreupdate" });
    expect(res.body).toHaveProperty("name", "genreupdate");
   })
  });

  describe("delete /:id", () => {
    it("should return 401 if valid token is not provided", async () => {
      const genre = new Genre({ name: "genre7" });
      await genre.save();
      const res = await req.delete("/api/genres/" + genre._id);
      expect(res.status).toBe(401);
    });

    it("should return 403 if the user is not an admin", async () => {
      const token = new User({
        isAdmin: false,
      }).getAuthToken();
      const genre = new Genre({ name: "genre9" });
      await genre.save();
      const res = await req
        .delete("/api/genres/" + genre._id)
        .set("x-auth-token", token);
      expect(res.status).toBe(403);
    });

    it("should return 400 if genre id is invalid", async () => {
      const token = new User({ isAdmin: true }).getAuthToken();
      const res = await req
        .delete("/api/genres/" + 1)
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });

    it("should return 404 if genre id is not found", async () => {
      const token = new User({ isAdmin: true }).getAuthToken();
      const id = new mongoose.Types.ObjectId();
      const response = await req
        .delete("/api/genres" + id)
        .set("x-auth-token", token);
      expect(response.status).toBe(404);
    });
    it("should delete genre if id is valid", async () => {
      const token = new User({
        isAdmin: true,
      }).getAuthToken();
      const genre = new Genre({ name: "genre10" });
      await genre.save();
      // console.log(genre._id);
      await req
        .delete("/api/genres/" + genre._id)
        .set("x-auth-token", token)
        .send({ name: "genre10" });
      const deleteg = await Genre.findById(genre._id);
      // console.log(deleteg);
      expect(deleteg).toBe(null);
    });

    it("should return the deleted genre  ", async () => {
      const token = new User({
        isAdmin: true,
      }).getAuthToken();
      const genre = new Genre({ name: "genre11" });
      await genre.save();
      // console.log(genre._id);
      const res = await req
        .delete("/api/genres/" + genre._id)
        .set("x-auth-token", token)
        .send({ name: "genre11" });
      expect(res.body).toHaveProperty("name", "genre11");
    });
  });
});
