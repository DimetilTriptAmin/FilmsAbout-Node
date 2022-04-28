import jwtService from "../../bussiness/services/jwtService.js";

const tokenDecoder = async (req, res, next) => {
  const tokenPayload = await jwtService.getTokenPayload(req);

  req.user = tokenPayload;

  next();
};

export default tokenDecoder;
