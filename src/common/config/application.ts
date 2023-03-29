export default {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3001,
  jtwExpiredIn: process.env.JWT_EXPIRED_IN || '24h',
  jwtSecret: process.env.JWT_SECRET || 'mysecret',
  host: process.env.HOST || '127.0.0.1',
};
