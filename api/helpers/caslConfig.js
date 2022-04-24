import * as core from '@casl/ability';

import jwtService from '../../bussiness/services/jwtService.js';

const caslConfig = async (req, res, next) => {
  const { rules, can } = new core.AbilityBuilder(core.Ability);

  const tokenPayload = await jwtService.getTokenPayload(req)

  req.user = tokenPayload

  next()
};

export default caslConfig;
