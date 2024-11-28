import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users') // Table name explicitly defined as 'users'
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phoneNumber: string; // Store the user's phone number, unique to prevent duplicates

  @Column({ default: false })
  is_verified: boolean; // Indicates if the user has verified their phone number

  @CreateDateColumn({ name: 'created_at' }) // Column name for better readability in DB
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) // Column name for better readability in DB
  updatedAt: Date;
}
