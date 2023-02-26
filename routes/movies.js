const router = require('express').Router();

const { getMovies, addMovie, deleteMovie } = require('../controllers/movies');

const { createMovieValidator, deleteMovieValidator } = require('../middlewares/validation');


router.get('/movies', getMovies);
router.post('/movies', createMovieValidator, addMovie);

router.delete('/movies/:movieId', deleteMovieValidator, deleteMovie);

module.exports = router;
