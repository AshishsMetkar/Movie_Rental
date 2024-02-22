const express = require("express");
const router = express.Router();
router.use(express.json());
const { Customer, validateCustomer } = require("../models/customer");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const isValidObjectId = require("../middleware/validateObjectId");

router.get("/", async (req, res) => {
  const customer = await Customer.find();
  res.send(customer);
});

router.get("/:id", isValidObjectId, async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(400).send("Could not find the customer.");
  res.send(customer);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateCustomer(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  customer = await customer.save();
  if (!customer) return res.status(404).send("data not postaed");
  res.send(customer);
});

router.put("/:id", auth, isValidObjectId, async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { phone: req.body.phone },
    { isGold: req.body.isGold },
    { new: true }
  );

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");
  res.send(customer);
});

router.delete("/:id", auth, admin, isValidObjectId, async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

module.exports = router;
