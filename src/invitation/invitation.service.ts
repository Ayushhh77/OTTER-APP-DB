import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Invitation } from './entities/invitation.entity';
import { Profile } from 'src/profile/entities/profile.entity';
@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  // Check if a user exists by phone number
  async findUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { phoneNumber },
    });
    return user || null;
  }

  // Send an invitation to a user
  async sendInvitation(userId: number, receiverPhoneNumber: string) {
    console.log(
      `Sending invitation from user with ID: ${userId} to ${receiverPhoneNumber}`,
    );

    // Find the sender (user who is sending the invitation)
    const sender = await this.userRepository.findOne({ where: { id: userId } });

    if (!sender) {
      throw new HttpException('Sender not found', HttpStatus.NOT_FOUND);
    }

    // Fetch the sender's profile
    const senderProfile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!senderProfile) {
      throw new HttpException('Sender profile not found', HttpStatus.NOT_FOUND);
    }

    console.log(
      `Sender found: ${senderProfile.fullName} ${sender.phoneNumber}`,
    );

    // Find the receiver by phone number
    const receiver = await this.findUserByPhoneNumber(receiverPhoneNumber);

    if (!receiver) {
      console.log(
        `Receiver not found for phone number: ${receiverPhoneNumber}`,
      );
      throw new HttpException('Receiver not found', HttpStatus.NOT_FOUND);
    }

    // Create and save the invitation
    const invitation = this.invitationRepository.create({
      sender,
      receiver,
      status: 'pending',
    });

    await this.invitationRepository.save(invitation);
    console.log(`Invitation created with ID: ${invitation.id}`);

    return { message: 'Invitation sent successfully', invitation };
  }

  // Update the invitation status (accepted or rejected)
  async updateInvitationStatus(
    invitationId: number,
    status: 'accepted' | 'rejected',
  ): Promise<any> {
    console.log(
      `Updating invitation with ID: ${invitationId} to status: ${status}`,
    );

    const invitation = await this.invitationRepository.findOne({
      where: { id: invitationId },
    });

    if (!invitation) {
      throw new HttpException('Invitation not found', HttpStatus.NOT_FOUND);
    }

    // Update the invitation status
    invitation.status = status;

    // Save the updated invitation back to the database
    await this.invitationRepository.save(invitation);

    console.log(`Invitation status updated to: ${status}`);

    return { message: `Invitation ${status} successfully.`, invitation };
  }
}
