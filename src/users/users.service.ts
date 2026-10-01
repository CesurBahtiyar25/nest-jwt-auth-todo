import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { users } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(users) private usersRepository: Repository<users>,
  ) {}

  async create(data: any): Promise<users> {
    return this.usersRepository.save(data);
  }

  async findOne(condition: any): Promise<users | null> {
    return this.usersRepository.findOne(condition);
  } /* async finndTodoById(userİd: number)
         return this.todoRepository.findOne({ where: { user: { id: users } } }) */
}
