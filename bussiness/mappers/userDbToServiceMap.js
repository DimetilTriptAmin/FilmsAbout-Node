const map = (user) => ({
    id: user.ID,
    avatar: user.AVATAR,
    name: user.NAME,
    email: user.EMAIL,
    passwordHash: user.PASSWORD_HASH,
    role: user.USER_ROLE,
  })
  
  export default map
  