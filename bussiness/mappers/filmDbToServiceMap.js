const map = (film) => ({
  id: film.ID,
  description: film.DESCRIPTION,
  poster: film.POSTER,
  producer: film.PRODUCER,
  rating: film.RATING,
  title: film.TITLE,
  trailerLink: film.TRAILER_LINK,
});

export default map;
