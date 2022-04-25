const ratingToServiceMap = (rating) => ({
    id: rating.ID,
    rate: rating.RATE,
    filmId: rating.FILM_ID,
    userId: rating.USER_ID
})

export default ratingToServiceMap