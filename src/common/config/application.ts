export default {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3001,
  jtwExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  jwtSecret: process.env.JWT_SECRET || 'mysecret',
  host: process.env.HOST || '127.0.0.1',
  refreshTokenSecret:
    process.env.REFRESH_TOKEN_SECRET || 'myrefreshtokensecret',
  refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '24h',
};
