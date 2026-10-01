import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './orm.config';
import { TodoModule } from './todo/todo.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from "@nestjs/jwt"

@Module({
  imports: [TypeOrmModule.forRoot(config), TodoModule, UsersModule, AuthModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
