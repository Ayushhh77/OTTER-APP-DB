import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Profile } from '../../profile/entities/profile.entity';
import { Invitation } from '../../invitation/entities/invitation.entity'; // Import Invitation entity

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ default: false })
  isVerified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationship with Profile
  @OneToMany(() => Profile, (profile) => profile.user)
  profiles: Profile[];

  // Relationship with Sent Invitations
  @OneToMany(() => Invitation, (invitation) => invitation.sender)
  sentInvitations: Invitation[];

  // Relationship with Received Invitations
  @OneToMany(() => Invitation, (invitation) => invitation.receiver)
  receivedInvitations: Invitation[];
}
