const app = require("../../index");
const supertest = require("supertest");
const req = supertest(app);
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

describe("/api/users", () => {
  afterEach(async () => {
    await User.deleteMany({});
  });
  describe("get /", () => {
    it("should return all the users", async () => {
      await User.collection.insertMany([
        {
          name: "users1",
          email: "abc@gmail.com",
          password: "123456",
          isAdmin: true,
        },
        {
          name: "users2",
          email: "xyz@gmail.com",
          password: "12345",
          isAdmin: false,
        },
      ]);
      const res = await req.get("/api/users");
      expect(
        res.body.some((parameter) => parameter.name === "users1")
      ).toBeTruthy();
      expect(
        res.body.some((parameter) => parameter.email === "abc@gmail.com")
      ).toBeTruthy();
      expect(
        res.body.some((parameter) => parameter.password === "123456")
      ).toBeTruthy();
      expect(
        res.body.some((parameter) => parameter.isAdmin === true)
      ).toBeTruthy();
    });
  });

  describe("get /:id", () => {
    it("should return 400 if id is invalid", async () => {
      const res = await req.get("/api/users/" + 1);
      expect(res.status).toBe(400);
    });
    it("should return 404 if users id is not found", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await req.get("/api/users" + id);
      expect(res.status).toBe(404);
    });
    it("should return user if id is valid", async () => {
      const user = new User({
        name: "user3",
        email: "surya@yahhoo.com",
        password: "12345",
        isAdmin: true,
      });
      await user.save();
      const res = await req.get(`/api/users/${user._id}`);
      expect(res.body).toHaveProperty(
        "name",
        "user3",
        "email",
        "surya@yahhoo.com",
        "password",
        "12345"
      );
    });

    describe("post /", () => {

      it("should return 400 if user name is less than 5 characters", async () => {
        const res = await req
          .post("/api/users").send({
            name: "ash",
            email: "ashish@xyz.com",
            password: "12345",
            isAdmin: false,
          });
        expect(res.status).toBe(400);
      });

      it("should return 400 if user name is more than 50 characters", async () => {
        
        const res = await req
          .post("/api/users")
          .send({
            name: "asdgbujdvsbdbbddnhshbdhdhdhhdjdjdhdhdbhbdbdhdhdjhdhjdndvdhbvvdh",
            email: "ashish@abc.com",
            password: "12345",
            isAdmin: false,
          });
        expect(res.status).toBe(400);
      });
      it("should return 400 if user email length is less than 5 characters", async () => {
   
        const res = await req
          .post("/api/users")
          .send({
            name: "ahsibsh",
            email: "ash",
            password: "12345",
            isAdmin: false,
          });
        expect(res.status).toBe(400);
      });

      it("should return 400 if user email length is more than 255 characters", async () => {
       
        const res = await req
          .post("/api/users")
          .send({
            name: "ahsibsh",
            email:
              "ashsgggggggggggggggggggggggggggggvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvdhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
            password: "12345",
            isAdmin: false,
          });
        expect(res.status).toBe(400);
      });

      it("should return 400 if user password length is less than 5 charracters ", async () => {
        
        const res = await req
          .post("/api/users")
          .send({
            name: "suryak",
            email: "surya@gmail.com",
            password: "1234",
            isAdmin: false,
          });
        expect(res.status).toBe(400);
      });
      it("should return 400 if user password length is more than 1024 charracters ", async () => {
        
        const res = await req
          .post("/api/users")
          .send({
            name: "suryak",
            email: "surya@gmail.com",
            password:
              "123bsjbjjbdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd123bsjbjjbdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd123bsjbjjbdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
            isAdmin: false,
          });
        expect(res.status).toBe(400);
      });

      it("should return 400 if user is already registered", async () => {
      
        let user = new User({
          name: "suryakant",
          email: "surya@gmail.com",
          password: "12345",
          isAdmin: true,
        });
        await user.save();

        const res = await req.post("/api/users/")

        user = await User.findOne({ name: "suryakant" });
        expect(user).not.toBe(null);
        expect(res.status).toBe(400);
      });

      it("should return 200 and save the user if valid ", async () => {
        
         await req.post("/api/users").send({
          name: "suryak",
          email: "surya@gmail.com",
          password: "12345678",
        });
        const user = await User.findOne({ name: "suryak" });
        expect(user).not.toBe(null);
        expect(user).toHaveProperty("name","suryak")
        console.log( user.password+" passss");
        expect(await bcrypt.compare("12345678",user.password)).toBeTruthy()
      });

      it("should return the saved user is valid ", async () => {    
        const res = await req
          .post("/api/users")
          .send({
            name: "suryak",
            email: "suryakant@gmail.com",
            password: "12345",
            isAdmin: false,
          });
        expect(res.body).toHaveProperty("name","suryak");
      });
    });


    describe("put /:id", () => {
      it("should return 401 if token is not provided", async () => {
        const res = await req.put("/api/users/" + 1);
        expect(res.status).toBe(401);
      });

      it("should return 400 if user name is less than 5 characters", async () => {
        const token = new User().getAuthToken();
        const user = new User({
          name: "suryakant",
          email: "surya@gmail.com",
          password: "12345",
          isAdmin: true,
        });
        await user.save();
        const res = await req
          .put("/api/users/" + user._id)
          .set("x-auth-token", token)
          .send({
            name: "sury",
            email: "surya@gmail.com",
            password: "12345",
            isAdmin: true,
          });
        // console.log(res.body);
        expect(res.status).toBe(400);
      });
      it("should return 400 if user name is more than 50 characters", async () => {
        const token = new User().getAuthToken();
        const user = new User({
          name: "suryakantlad",
          email: "suryakantlad@g",
          password: "12345",
          isAdmin: true,
        });
        await user.save();
        const res = await req
          .put("/api/users/" + user._id)
          .set("x-auth-token", token)
          .send({
            name: "shdfdfhdvhvcvhhdvdhdhhsdsvhdcyhccssyhhycvcvshyvvcyhvcsvcyschvchsvhcvysvchycshvxgs",
            email: "surya@gmail.com",
            password: "12345",
            isAdmin: true,
          });
        // console.log(res.body);
        expect(res.status).toBe(400);
      });

      it("should return 400 if user email is less than 5 characters", async () => {
        const token = new User().getAuthToken();
        const user = new User({
          name: "suryakant",
          email: "surya@gmail.com",
          password: "12345",
          isAdmin: true,
        });
        await user.save();
        const res = await req
          .put("/api/users/" + user._id)
          .set("x-auth-token", token)
          .send({
            name: "suryak",
            email: "sur",
            password: "12345",
            isAdmin: true,
          });
        // console.log(res.body);
        expect(res.status).toBe(400);
      });
      it("should return 400 if user email is more than 255 characters", async () => {
        const token = new User().getAuthToken();
        const user = new User({
          name: "suryakantlad",
          email: "suryakantlad@g",
          password: "12345",
          isAdmin: true,
        });
        await user.save();
        const res = await req
          .put("/api/users/" + user._id)
          .set("x-auth-token", token)
          .send({
            name: "suryakant",
            email:
              "ashsgggggggggggggggggggggggggggggvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvdhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
            password: "12345",
            isAdmin: true,
          });
        // console.log(res.body);
        expect(res.status).toBe(400);
      });

      it("should return 400 if user password is less than 5 characters", async () => {
        const token = new User().getAuthToken();
        const user = new User({
          name: "suryakant",
          email: "surya@gmail.com",
          password: "12345",
          isAdmin: true,
        });
        await user.save();
        const res = await req
          .put("/api/users/" + user._id)
          .set("x-auth-token", token)
          .send({
            name: "suryaka",
            email: "surya@gmail.com",
            password: "123",
            isAdmin: true,
          });
        // console.log(res.body);
        expect(res.status).toBe(400);
      });
      it("should return 400 if user password is more than 1024 characters", async () => {
        const token = new User().getAuthToken();
        const user = new User({
          name: "suryakantlad",
          email: "suryakantlad@g",
          password: "12345",
          isAdmin: true,
        });
        await user.save();
        const res = await req
          .put("/api/users/" + user._id)
          .set("x-auth-token", token)
          .send({
            name: "suryakantlad",
            email: "surya@gmail.com",
            password:
              "123bsjbjjbdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd123bsjbjjbdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd123bsjbjjbdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
            isAdmin: true,
          });
        // console.log(res.body);
        expect(res.status).toBe(400);
      });

      it("should update the users details if id is valid ", async () => {
        const token = new User().getAuthToken();
        const user = new User({
          name: "suryakantlad",
          email: "suryakantlad@gmail.com",
          password: "12345",
          isAdmin: true,
        });
        await user.save();

        await req
          .put("/api/users/" + user._id)
          .set("x-auth-token", token)
          .send({
            name: "ladsurya",
            email: "suryakantlad22@gmail.com",
            password: "23452",
          });
        const updateuser = await User.findById(user._id);
        expect(updateuser).not.toBe(null);
        expect(updateuser).toHaveProperty("name", "ladsurya");
      });

      it("should return the updated user if id is valid", async () => {
        const token = new User().getAuthToken();
        const user = new User({
          name: "ladsurya",
          email: "suryakantlad22@gmail.com",
          password: "56789",
          isAdmin: true,
        });
        await user.save();
        console.log(user._id);
        const res = await req
          .put("/api/users/" + user._id)
          .set("x-auth-token", token)
          .send({
            name: "suryalad",
            email: "suryalad22@gmail.com",
            password: "12345",
            isAdmin: true,
          });
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty(
          "name",
          "suryalad",
          "email",
          "suryalad22@gmail.com"
        );
      });
    });

    describe("delete /:id", () => {
      it("should return 401 if valid token is not provided", async () => {
        const user = new User({
          name: "suryalad",
          email: "suryalad22@gmail.com",
          password: "12345",
        });
        await user.save();
        const res = await req.delete("/api/users/" + user._id);
        expect(res.status).toBe(401);
      });

      it("should return 403 if the user is not an admin", async () => {
        const token = new User({
          isAdmin: false,
        }).getAuthToken();

        const user = new User({
          name: "suryakant",
          email: "suryakant@gmail.com",
          password: "12345",
        });
        await user.save();
        const res = await req
          .delete("/api/users/" + user._id)
          .set("x-auth-token", token);
        expect(res.status).toBe(403);
      });

      it("should return 404 if user id is not found", async () => {
        const token = new User({ isAdmin: true }).getAuthToken();
        const id = new mongoose.Types.ObjectId();
        const res = await req
          .delete("/api/delete/" + id)
          .set("x-auth-token", token);
        expect(res.status).toBe(404);
      });

      it("should return 400 if user id is invalid", async () => {
        const token = new User({ isAdmin: true }).getAuthToken();
        const res = await req
          .delete("/api/users/" + 1)
          .set("x-auth-token", token);
        expect(res.status).toBe(400);
      });

      it("should delete user if id is valid", async () => {
        const token = new User({
          isAdmin: true,
        }).getAuthToken();
        const user = new User({
          name: "suryalad",
          email: "suryalad22@gmail.com",
          password: "12345",
        });
        await user.save();
        // console.log(user._id);
        await req
          .delete("/api/users/" + user._id)
          .set("x-auth-token", token)
          .send({
            name: "suryalad",
            email: "suryalad22@gmail.com",
            password: "12345",
          });

        const deleteg = await User.findById(user._id);
        expect(deleteg).toBe(null);
      });

      it("should return the deleted user  ", async () => {
        const token = new User({
          isAdmin: true,
        }).getAuthToken();
        const user = new User({
          name: "suryalad",
          email: "suryalad18@gmail.com",
          password: "36367",
        });
        await user.save();
        // console.log(user._id);
        const res = await req
          .delete("/api/users/" + user._id)
          .set("x-auth-token", token)
          .send({
            name: "suryalad",
            email: "suryalad18@gmail.com",
            password: "36367",
          });
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty(
          "name",
          "suryalad",
          "email",
          "suryalad18@gmail.com"
        );
      });
    });
  });
});
