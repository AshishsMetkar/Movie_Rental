const express = require("express");
const router = express.Router();
router.use(express.json());
const { Genre, validateGenre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");


router.get("/", async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});
router.get("/count", async(req,res)=>{
  const totalGenres = await Genre.find().countDocuments()
  res.send({totalGenres})
})
router.post("/pfs",async(req,res)=>{
  const {currentPage,pageSize} =req.body
  let skip =(currentPage-1)*pageSize
  const genres = await Genre.find().limit(pageSize).skip(skip)
  res.send(genres)
})
router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(400).send("Could not find the genre.");
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});

router.put("/:id", auth, validateObjectId, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.delete("/:id", auth, admin, validateObjectId, async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

module.exports = router;
