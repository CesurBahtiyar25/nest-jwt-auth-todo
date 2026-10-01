import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';
import { Column } from 'typeorm';
import { users } from 'src/users/users.entity';

@Entity('todo')
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  task: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true }) // nullable true çünkü bazen user olmayabilir diyorsun
  userId: number;

  @ManyToOne(() => users, (user) => user.todos, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user: users;
}
