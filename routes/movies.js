const express = require("express");
const router = express.Router();
router.use(express.json());
const { Movie, validateMovie } = require("../models/movie");
const { Genre } = require("../models/genre");
const isValidObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  const movie = await Movie.find();
  res.send(movie);
});
router.get("/count", async (req, res) => {
  const {genreName,title} =req.query
  // console.log(req.query);
  let query ={};
  if(genreName){
  query["genre.name"] = genreName
  }
  if(title){
    query["title"] = new RegExp(`^${title}`,"i")
  }
  const totalMovies = await Movie.find(query).countDocuments();
  res.send({ totalMovies });
});

router.post("/pfs", async (req, res) => {
  const { currentPage, pageSize,genreName,title ,sortColumn} = req.body;
  let query={}
  if(genreName){
    query["genre.name"]=genreName
  }
  if(title){
    query["title"] = new RegExp(`^${title}`,"i")
  }
  let skip = (currentPage - 1) * pageSize;
  const {path,order} = sortColumn
  const movies = await Movie.find(query).limit(pageSize).skip(skip).sort({[path]:order})
  res.send(movies);
});

router.get("/:id", isValidObjectId, async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(400).send("Could not find the movie.");

  res.send(movie);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateMovie(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let id = req.body.genre_id;
  let genres = await Genre.findById(id);

  if (!genres) return res.status(404).send("id not found");

  let movie = new Movie({
    title: req.body.title,
    dailyRentalRate: req.body.dailyRentalRate,
    numberInStock: req.body.numberInStock,
    genre: { _id: genres.id, name: genres.name },
    liked: req.body.liked,
  });

  movie = await movie.save();

  res.send(movie);
});

router.put("/:id", auth, isValidObjectId, async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let id = req.body.genre_id;
  let genres = await Genre.findById(id);
  if (!genres) return res.status(404).send("id not found");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      dailyRentalRate: req.body.dailyRentalRate,
      numberInStock: req.body.numberInStock,
      genre: { _id: genres._id, name: genres.name },
      liked: req.body.liked,
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send("The Movie with gievn id is not found.");

  res.send(movie);
});

router.delete("/:id", auth, admin, isValidObjectId, async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

module.exports = router;
