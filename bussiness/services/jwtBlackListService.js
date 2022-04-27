import redis from "redis";

const client = redis.createClient();
client.connect();

const jwtBlackListService = {
  AddBlackList: async (userId, jwt) => {
    const refreshTokens = await client.get(userId)
    
    if (refreshTokens == null) {
        await client.set(userId, jwt);
    } else {
        await client.set(userId, refreshTokens + "|" + jwt);
    }
  },
  CheckBlackList: async (userId, jwt) => {
    const refreshTokens = await client.get(userId);

    if (refreshTokens == null) {
      return true;
    }

    const splittedToken = refreshTokens.split("|");

    if (splittedToken.indexOf(jwt) === -1) {
      return true;
    }
    return false;
  },
};

export default jwtBlackListService;
