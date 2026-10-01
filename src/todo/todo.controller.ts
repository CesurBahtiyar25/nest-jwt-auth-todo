import {
  Controller,
  Body,
  Post,
  Get,
  Delete,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';

interface JwtPayload {
  id: number;
}

@Controller('todo') // dekarörler meta data /todo dedigimde wep siteisi aslında bizi buraya geiteriyo
export class TodoController {
  constructor(private todoService: TodoService) {}
  //bu servisi ınjekt etmem geregiyor conrolerlara import ediyoruz//^
  @Post()
  @UseGuards(JwtAuthGuard)
  async creatTodo(@Req() req, @Body() body: Todo): Promise<Todo> {
    const { id, task, completed, is_deleted, deletedAt } = body;
    const userId: number = req.user.id; // JWT'den gelen user ID
    //console.log(userId)
    return this.todoService.create(
      id,
      task,
      completed,
      is_deleted,
      deletedAt,
      userId,
    ); // bunla beraber sadece yönlendirici görevi görmeye başlıyor ^
  }

  @Delete(':id')
  async softDelete(@Param('id') id: number) {
    return this.todoService.softDelete(id);
  }

  /* @Put(":id")
 
     async update(@Param("id") id: number, @Body() updateData: { is_deleted: boolean, deletedAt: Date }) {  // is_deleted ve deletedAt'ı bir nesne olarak alıyoruz
         const { is_deleted, deletedAt } = updateData; // body içeriğini çıkartıyoru
 
         return this.todoService.update(id, is_deleted, deletedAt);
 
     }*/

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateData: { completed: boolean },
  ) {
    const { completed } = updateData;
    return this.todoService.update(id, completed);
  }

  @UseGuards(JwtAuthGuard)
  @Get('todos')
  async getUserTodos(@Req() req) {
    //console.log("request User", req.user)
    const userId: number = req?.user?.id; // JWT'den gelen user ID
    return this.todoService.findTodosByUserId(userId);
  }
}

//http isteklerini yönetigimiz kısım uygulamamıza gelen http isteklerini controllerüzerinden yönetişyoruz
