const app = require("../../index");
const supertest = require("supertest");
const req = supertest(app);
const { Customer } = require("../../models/customer");
const mongoose = require("mongoose");
const { User } = require("../../models/user");

describe("/api/customers", () => {
    afterEach(async () => {
        await Customer.deleteMany({});
      });
  describe("get /", () => {
    it("should return all customers", async () => {
      await Customer.collection.insertMany([
        { name: "customer1", phone: "26426433" },
        { name: "customer2", phone: "756464356" },
      ]);
      const res = await req.get("/api/customers");
      expect(res.body.some((g) => g.name === "customer1")).toBeTruthy();
      expect(res.body.some((g) => g.phone === "26426433")).toBeTruthy();
      expect(res.body.some((g) => g.name === "customer2")).toBeTruthy();
    });
  });

  describe("get /:id", () => {
    it("should return 400 if customer id is invalid", async () => {
      const res = await req.get("/api/customers/" + 2);
      expect(res.status).toBe(400);
    });

    it("should return 404 if customer id is not found", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await req.get("/api/customers" + id);
      expect(res.status).toBe(404);
    });
    it("should return customer if id is valid", async () => {
      const customer = new Customer({
        name: "customer3",
        phone: "8757487",
      });
      await customer.save();
      const res = await req.get(`/api/customers/${customer._id}`);
      expect(res.body).toHaveProperty("name", "customer3", "phone", "8757487");
    });
  });

  describe("post /", () => {
    it("should return 401 if token is invalid", async () => {
      const res = await req.post("/api/customers");
      expect(res.status).toBe(401);
    });
    it("should return 400 if customer name is less than 5 characters", async () => {
      const token = new User().getAuthToken();
      const res = await req
        .post("/api/customers")
        .set("x-auth-token", token)
        .send({ name: "hey", phone: "8626733467" });
      // console.log(res.body);
      expect(res.status).toBe(400);
    });
    it("should return 400 if customer name is more than 50 characters", async () => {
      const token = new User().getAuthToken();
      const res = await req
        .post("/api/customers/")
        .set("x-auth-token", token)
        .send({
          name: "gsjhfdddjdhdbdbbdhhdhddgvdvdghhdhdhhdbdbdhdhdhdbdbdhhdhfbbfhdhdhdvbsh",
        });
      expect(res.status).toBe(400);
    });
    it("should return 400 if customer phone length is less than 7 characters", async () => {
      const token = new User().getAuthToken();
      const res = await req
        .post("/api/customers")
        .set("x-auth-token", token)
        .send({ name: "heya", phone: "8626733" });
      //   console.log(res.body);
      expect(res.status).toBe(400);
    });
    it("should return 400 if customer phone length is more than 10 characters", async () => {
      const token = new User().getAuthToken();
      const res = await req
        .post("/api/customers/")
        .set("x-auth-token", token)
        .send({ name: "sjbdhdh", phone: "17278384354" });
      expect(res.status).toBe(400);
    });
    it("should save the customer if valid", async () => {
      const token = new User().getAuthToken();
      await req
        .post("/api/customers")
        .set("x-auth-token", token)
        .send({ name: "suryak", phone: "7364772476" });
      const customer = await Customer.findOne({
        name: "suryak",
      });
      //   console.log(customer);
      expect(customer).not.toBe(null);
      expect(customer).toHaveProperty("name", "suryak", "phone", "736477246");
    });
    it("should return the saved customer is valid ", async () => {
      const token = new User().getAuthToken();
      const res = await req
        .post("/api/customers")
        .set("x-auth-token", token)
        .send({ name: "customer4", phone: "267374637" });
      expect(res.body).toHaveProperty(
        "name",
        "customer4",
        "phone",
        "267374637"
      );
    });
  });

  describe("put /:id", () => {
    it("should return 401 if token is not provided", async () => {
      const res = await req.put("/api/customers/" + 1);
      expect(res.status).toBe(401);
    });
    it("should return 400 if customer name is less than 5 characters", async () => {
      const token = new User().getAuthToken();
      const customer = new Customer({ name: "customer5", phone: "8626733465" });
      await customer.save();
      const res = await req
        .put("/api/customers/" + customer._id)
        .set("x-auth-token", token)
        .send({ name: "cust", phone: "8626733467" });
      // console.log(res.body);
      expect(res.status).toBe(400);
    });
    it("should return 400 if customer name is more than 50 characters", async () => {
      const token = new User().getAuthToken();
      const customer = new Customer({ name: "customer7", phone: "2516362611" });
      await customer.save();
      const res = await req
        .put("/api/customers/" + customer._id)
        .set("x-auth-token", token)
        .send({
          name: "gsjhfdddjdhdbdbbdhhdhddgvdvdghhdhdhhdbdbdhdhdhdbdbdhhdhfbbfhdhdhdvbsh",
          phone: "1635726371",
        });
      expect(res.status).toBe(400);
    });
    it("should return 400 if customer phone length is less than 7 characters", async () => {
      const token = new User().getAuthToken();
      const customer = new Customer({ name: "customer8", phone: "26356336" });
      await customer.save();
      const res = await req
        .put("/api/customers/" + customer._id)
        .set("x-auth-token", token)
        .send({ name: "hello", phone: "86263" });
      //   console.log(res.body);
      expect(res.status).toBe(400);
    });
    it("should return 400 if customer phone length is more than 10 characters", async () => {
      const token = new User().getAuthToken();
      const customer = new Customer({ name: "customer9", phone: "46374736" });
      await customer.save();
      const res = await req
        .put("/api/customers/" + customer._id)
        .set("x-auth-token", token)
        .send({ name: "sjbdhdf", phone: "376454563467737" });
      expect(res.status).toBe(400);
    });
    it("should return 400 if customer id is invalid", async () => {
    
        const res = await req.get("/api/customers/" + 1)
        expect(res.status).toBe(400);
      });

      it("should return 404 if customer id is not found",async()=>{
        const id = new mongoose.Types.ObjectId();
        const res =await req.get("/api/customers"+id);
        expect(res.status).toBe(404)
      })

    it("should update the customer if id is valid", async () => {
      const token = new User().getAuthToken();
      const customer = new Customer({ name: "customer10", phone: "263726678" });
      await customer.save();
      // console.log(customer._id);
      await req
        .put("/api/customers/" + customer._id)
        .set("x-auth-token", token)
        .send({ name: "customerid", phone: "276377822" });
      const updateg = await Customer.findById(customer._id);
      // console.log(updateg);
      expect(updateg).toHaveProperty(
        "name",
        "customerid",
        "phone",
        "276377822"
      );
    });
    it("should return the updated customer", async () => {
      const token = new User().getAuthToken();
      const customer = new Customer({ name: "customer11", phone: "276373622" });
      await customer.save();
      console.log(customer._id);
      const res = await req
        .put("/api/customers/" + customer._id)
        .set("x-auth-token", token)
        .send({ name: "customerupdate", phone: "276377835" });
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty(
        "name",
        "customerupdate",
        "phone",
        "276377835"
      );
    });
  });

  describe("delete /:id", () => {
    it("should return 401 if valid token is not provided", async () => {
      const customer = new Customer({ name: "customer2", phone: "745284367" });
      await customer.save();
      const res = await req.delete("/api/customers/" + customer._id);
      expect(res.status).toBe(401);
    });
    it("should return 403 if the user is not an admin", async () => {
      const token = new User({
        isAdmin: false,
      }).getAuthToken();
      const customer = new Customer({ name: "customer2", phone: "354773678" });
      await customer.save();
      const res = await req
        .delete("/api/customers/" + customer._id)
        .set("x-auth-token", token);
      expect(res.status).toBe(403);
    });
    it("should return 404 if customer id is not found", async () => {
      const token = new User({ isAdmin: true }).getAuthToken();
      const id = new mongoose.Types.ObjectId();
      const res = await req
        .delete("/api/delete/" + id)
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });
    it("should return 400 if customer id is invalid", async () => {
        const token = new User({ isAdmin: true }).getAuthToken();
        const res = await req
          .delete("/api/customers/" + 1)
          .set("x-auth-token", token);
        expect(res.status).toBe(400);
      });
    
    it("should delete customer if id is valid", async () => {
        const token = new User({
          isAdmin: true,
        }).getAuthToken();
        const customer = new Customer({ name: "customer15",phone:"253762778" });
        await customer.save();
        // console.log(customer._id);
        await req
          .delete("/api/customers/" + customer._id)
          .set("x-auth-token", token)
          .send({ name: "customer15",phone:"253762778" });
        const deleteg = await Customer.findById(customer._id);
        // console.log(deleteg);
        expect(deleteg).toBe(null);
      });
  
      it("should return the deleted customer  ", async () => {
        const token = new User({
          isAdmin: true,
        }).getAuthToken();
        const customer = new Customer({ name: "customer16",phone:"365373627" });
        await customer.save();
        // console.log(customer._id);
        const res = await req
          .delete("/api/customers/" + customer._id)
          .set("x-auth-token", token)
          .send({ name: "customer16",phone:"365373627" });
         expect(res.body).toHaveProperty("_id")
        expect(res.body).toHaveProperty("name", "customer16","phone","365373627");
      });
  });
});
