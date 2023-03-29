export default {
  host: process.env.MYSQL_DATABASE_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_DATABASE_PORT) || 8889,
  username: process.env.MYSQL_DATABASE_USERNAME || 'root',
  password: process.env.MYSQL_DATABASE_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE_NAME || 'simple_pay',
};
