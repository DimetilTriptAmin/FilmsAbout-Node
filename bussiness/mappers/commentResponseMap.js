const commentResponseMap = (comment) => ({
    id: comment.ID,
    username: comment.NAME,
    avatar: comment.AVATAR,
    text: comment.TEXT,
    publishDate: comment.PUBLISH_DATE,
    rating: comment.RATE
})

export default commentResponseMap
