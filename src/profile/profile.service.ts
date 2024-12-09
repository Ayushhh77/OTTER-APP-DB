import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { InvitationService } from 'src/invitation/invitation.service'; // Import the InvitationService
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private invitationService: InvitationService,
  ) {}

  async createProfile(
    userId: number,
    profileData: CreateProfileDto,
  ): Promise<any> {
    console.log('Received userId', userId);

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Check if a profile already exists for the user
    const existingProfile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });

    if (existingProfile) {
      throw new HttpException(
        'Profile already exists for this user',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create the profile
    const profile = this.profileRepository.create({
      ...profileData,
      user,
    });

    // Check if partner phone number exists
    let partner;
    if (profileData.partnerPhoneNumber) {
      partner = await this.userRepository.findOne({
        where: { phoneNumber: profileData.partnerPhoneNumber },
      });

      // Log partner information
      if (partner) {
        console.log('Partner found:', partner.fullName, partner.phoneNumber);
      } else {
        console.log(
          'Partner not found for phone number:',
          profileData.partnerPhoneNumber,
        );
      }
    }

    if (profileData.partnerPhoneNumber && partner) {
      profile.invitePartner = true; // Set this to true if partner is found
    } else {
      // If partner is not found, give the user a share link to invite them
      profile.invitePartner = false;
    }

    // Save the profile
    const savedProfile = await this.profileRepository.save(profile);

    // Handle invitation logic if applicable
    if (profileData.invitePartner && profileData.partnerPhoneNumber) {
      const result = await this.invitationService.sendInvitation(
        userId,
        profileData.partnerPhoneNumber,
      );
      return { profile: savedProfile, result };
    } else if (profileData.partnerPhoneNumber && !partner) {
      // If the partner doesn't exist, provide the share link to the user
      const invitationLink = `https://otterapp=${profileData.partnerPhoneNumber}`;
      return {
        profile: savedProfile,
        message:
          'Partner not found, but your profile has been created. You can share the invitation link with the partner:',
        invitationLink: invitationLink,
      };
    }

    return savedProfile;
  }

  async updateProfile(
    @Req() req,
    profileData: UpdateProfileDto,
  ): Promise<Profile> {
    // Fetch the user's profile
    const profile = await this.profileRepository.findOne({
      where: { user: { id: req.user.userId } },
    });

    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    // Update the profile
    Object.assign(profile, profileData);
    return this.profileRepository.save(profile);
  }

  async getProfile(userId: number): Promise<Profile> {
    // Fetch the user's profile
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    return profile;
  }
}
