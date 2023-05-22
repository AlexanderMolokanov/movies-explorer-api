const Movie = require('../models/movie');

const NotFoundErr = require('../errors/NotFoundErr');
const DataErr = require('../errors/DataErr');
const RightsErr = require('../errors/RightsErr');

const {
  WRONG_DATA_MOVIE,
  MOVIE_NOT_FOUND,
  ACCESS_ERROR,
} = require('../utils/constants');


// GET /movies
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};
  
const addMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.create({ owner, ...req.body })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new DataErr(WRONG_DATA_MOVIE));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundErr(MOVIE_NOT_FOUND);
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new RightsErr(ACCESS_ERROR));
      }
      return movie.remove()
        .then(() => res.status(200).send({ message: 'Карточка удалена' }));
    })
    .catch(next);
};

module.exports = {
  getMovies,
  addMovie,
  deleteMovie,
};
