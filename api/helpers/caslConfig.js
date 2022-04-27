import * as core from "@casl/ability";
import { CaslActions, CaslModels, UserRoles } from "./enums.js";

const caslConfig = async (req, res, next) => {
  const { rules, can } = new core.AbilityBuilder(core.Ability);

  const userClaims = req.user || {};

  switch (userClaims.userRole) {
    case UserRoles.admin:
      can(CaslActions.delete, CaslModels.comment);
    case UserRoles.user:
      can(CaslActions.create, [CaslModels.comment, CaslModels.rating]);
      can([CaslActions.delete, CaslActions.update], CaslModels.comment, {
        userId: userClaims.userId,
      });
      can(CaslActions.read, [CaslModels.user]);
      can(CaslActions.update, CaslModels.user, { id: userClaims.userId });
    default:
      can(CaslActions.read, [CaslModels.film, CaslModels.comment, CaslModels.rating]);
  }

  req.ability = new core.Ability(rules);
  next();
};

export default caslConfig;
