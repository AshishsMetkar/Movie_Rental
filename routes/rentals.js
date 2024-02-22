const express = require("express");
const router = express.Router();
router.use(express.json());

const { Rental, validateRental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const isValidObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  const rental = await Rental.find();
  res.send(rental);
});

router.get("/:id", isValidObjectId, async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send("Rental not found");
  res.send(rental);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send("id not found");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send("id not found");

  const { title, dailyRentalRate, numberInStock } = movie;
  const { name, phone } = customer;
  let rentalfees = dailyRentalRate * 10;

  let rental = new Rental({
    movie: {
      _id: movie.id,
      title,
      dailyRentalRate,
      numberInStock,
    },
    customer: {
      _id: customer.id,
      name,
      phone,
    },
    // dateOut,
    rentalFee: rentalfees,
  });
  

  if (numberInStock === 0) return res.status(400).send("movie out of stock");

  const session = await Rental.startSession();
  session.startTransaction();
  try {
    await rental.save();
    movie.numberInStock = movie.numberInStock - 1;
    await movie.save();
  } catch (error) {
    session.abortTransaction();
    throw error;
  }

  session.commitTransaction();
  session.endSession();

  //  console.log(session);
  res.send(rental);
});

router.patch("/:id", auth, isValidObjectId, async (req, res) => {
  let rental = await Rental.findByIdAndUpdate(req.params.id, {
    dateIn: new Date(),
  });
 
  if (!rental) return res.status(400).send("id not found");

  const movie = await Movie.findById(rental.movie._id);
  if (!movie) return res.status(404).send("id not found");

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send("id not found");

  const session = await Rental.startSession();
  session.startTransaction();
  try {
    rental=await rental.save();
    movie.numberInStock = movie.numberInStock + 1;
    await movie.save();
  } catch (error) {
    session.abortTransaction();
    throw error;
  }

  session.commitTransaction();
  session.endSession();

  // console.log(session);
  res.send(rental);
});

router.delete("/:id", auth, admin, isValidObjectId, async (req, res) => {
  const rental = await Rental.findByIdAndDelete(req.params.id);

  if (!rental)
    return res.status(404).send("The movie with the given ID was not found.");

  const movie = await Movie.findById(rental.movie._id);

  const session = await Rental.startSession();
  session.startTransaction();
  try {
    movie.numberInStock = movie.numberInStock + 1;
    await movie.save();
  } catch (error) {
    session.abortTransaction();
    throw error;
  }

  session.commitTransaction();
  session.endSession();

  // console.log(session);
  res.send(rental);
});

module.exports = router;
