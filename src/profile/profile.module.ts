import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Profile } from './entities/profile.entity';
import { User } from '../auth/entities/user.entity';
import { InvitationModule } from 'src/invitation/invitation.module';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, User]), InvitationModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
