import { TypeOrmModule } from '@nestjs/typeorm';

export const TypeORMMySqlTestingModule = (entities: any[]) =>
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.MYSQL_DATABASE_TEST_HOST || 'localhost',
    port: Number(process.env.MYSQL_DATABASE_TEST_PORT) || 8889,
    username: process.env.MYSQL_DATABASE_TEST_USERNAME || 'root',
    password: process.env.MYSQL_DATABASE_TEST_PASSWORD || 'root',
    database: process.env.MYSQL_DATABASE_TEST_NAME || 'simple_pay_test',
    entities: [...entities],
    synchronize: true,
  });
