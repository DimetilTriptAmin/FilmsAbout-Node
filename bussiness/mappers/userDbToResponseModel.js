const map = (user) => ({
  id: user.ID,
  userName: user.NAME,
  avatar: user.AVATAR,
  email: user.EMAIL,
  role: user.USER_ROLE,
});

export default map;
