import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [TypeOrmModule.forFeature([Todo]), AuthModule],
  controllers: [TodoController],    //   
  providers: [TodoService]   // export var bize şunu saglıyor sizin modülünüz içerisinde bulunan providerlı dışardaki bi modulün erişmesine saglıyor
  // siz bi modülü başka bi modül içerisine imort ettiginzde o modülün servisi kullanmak istiyosanız o servisi export ediyo olmanız lazım
})
export class TodoModule { }
