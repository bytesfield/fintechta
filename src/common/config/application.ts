export default {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3001,
  host: process.env.HOST || '127.0.0.1',
  jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'mysecret',
  jwtAccessTokenExpiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '24h',
  jwtRefreshTokenSecret:
    process.env.JWT_REFRESH_TOKEN_SECRET || 'myrefreshtokensecret',
  jwtRefreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '24h',
};
