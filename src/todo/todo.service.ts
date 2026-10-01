import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';

@Injectable() //provider dedigimizde direkt olarak aslında servise akla geliyor ama servis providerlardan sadece bi tanesi
export class TodoService {
  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
  ) {}

  async create(
    id: number,
    task: string,
    completed: boolean,
    is_deleted: boolean,
    deletedAt: Date,
    userId: number,
  ): Promise<Todo> {
    const todo = this.todoRepository.create({
      id,
      task,
      completed,
      is_deleted,
      deletedAt,
      userId,
    });

    return this.todoRepository.save(todo);
  }

  async softDelete(id: number) {
    const deletes = await this.todoRepository.findOne({ where: { id } });
    if (!deletes) {
      throw new Error('Todo not found');
    }

    deletes.is_deleted = true; //silidiginde is_deleted kolnunu true çek
    deletes.deletedAt = new Date(); //silinme tarihini at
    return this.todoRepository.save(deletes); // save deletes
  }

  async update(id: number, completed: boolean) {
    const güncele = await this.todoRepository.findOneBy({ id });
    if (!güncele) {
      throw new Error('todo not found');
    }
    güncele.completed = completed;
    return this.todoRepository.save(güncele);
  }

  async findTodosByUserId(userId: number): Promise<Todo[]> {
    return this.todoRepository.find({ where: { userId } });
  }
}

// iş bizim iş mantıgını oldugu kısım conrolerdan gelen istegin işlendigi kısım

// bir sürü provider var başka ama en yaygın kullanılanı servisler

/* async update(id: number, is_deleted: boolean, deletedAt: Date) {
 
         const günc = await this.todoRepository.findOneBy({ id });
         if (!günc) {
             throw new Error("TOdo not found");
 
         }
         günc.is_deleted = is_deleted;
         günc.deletedAt = deletedAt
         return this.todoRepository.save(günc)
 
 
 
     }*/

/* async findTodosByUserId(usersid: number): Promise<Todo[]> {
        return this.todoRepository.find({ where: { users_id: id } });
    }*/
