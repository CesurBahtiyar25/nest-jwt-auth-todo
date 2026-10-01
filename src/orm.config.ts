import { Type } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  username: 'postgres',
  password: process.env.DB_PASSWORD,
  port: 5432,
  host: '127.0.0.1',
  database: 'todo_db',
  synchronize: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
};
