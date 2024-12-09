import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  // Define the relationship between Profile and User
  @ManyToOne(() => User, (user) => user.profiles) // A user can have multiple profiles
  user: User;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  invitePartner: boolean;

  @Column({ nullable: true })
  partnerPhoneNumber: string;

  @Column('simple-array', { nullable: true })
  interests: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
