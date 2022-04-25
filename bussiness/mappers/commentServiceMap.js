const commentServiceMap = (comment) => ({
    id: comment.ID,
    isDeleted: comment.IS_DELETED,
    publishDate: comment.PUBLISH_DATE,
    text: comment.TEXT,
    filmId: comment.FILM_ID,
    userId: comment.USER_ID
})

export default commentServiceMap