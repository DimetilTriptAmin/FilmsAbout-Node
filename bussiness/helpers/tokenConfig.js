const jwt = {
  secret: "secret_code",
  tokens: {
    access: {
      type: "access",
      expiresIn: "30m",
      SameSite: "None",
      Secure: true
    },
    refresh: {
      type: "refresh",
      expiresIn: "1440m",
      SameSite: "None",
      Secure: true
    },
  },
  refreshOptions: {
    maxAge: 1000 * 60 * 1440,
    httpOnly: true,
    sameSite: "None",
    secure: true
},
};

export default jwt
