import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity()
export class Badge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column()
  img: string;

  @Column()
  category: 'bronze' | 'silver' | 'gold';

  @ManyToMany(() => User, user => user.badges)
  users: User[];
}
