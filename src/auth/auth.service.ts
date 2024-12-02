import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../auth/entities/user.entity';
import { OTP } from '../auth/entities/otp.entity';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(OTP) private otpRepository: Repository<OTP>,
    private jwtService: JwtService,
    private smsService: SmsService,
  ) {
    console.log('SmsService injected:', this.smsService);
  }

  // Generate and send OTP via SMS
  async sendOtp(phoneNumber: string): Promise<void> {
    if (!phoneNumber || !/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
      throw new HttpException(
        'Invalid phone number format. Please provide a valid 10-digit phone number.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await this.smsService.sendSms(
        phoneNumber,
        `Otter-App: Your OTP is ${otp}`,
      );
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new HttpException(
        'Failed to send OTP. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Set expiry to 10 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const otpRecord = this.otpRepository.create({
      phoneNumber,
      otp,
      expiresAt,
    });
    await this.otpRepository.save(otpRecord);
  }

  // Verify OTP and log the user in
  async verifyOtp(phoneNumber: string, otp: string): Promise<string> {
    if (!otp || otp.length !== 6) {
      throw new HttpException(
        'OTP must be exactly 6 digits',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Find the most recent OTP for the given phone number
    const otpRecord = await this.otpRepository.findOne({
      where: { phoneNumber },
      order: { createdAt: 'DESC' },
    });

    // If OTP record doesn't exist, throw an error
    if (!otpRecord) {
      throw new HttpException('OTP not found', HttpStatus.NOT_FOUND);
    }

    // Check if the OTP has expired
    const now = new Date();
    if (now > otpRecord.expiresAt) {
      // Delete the expired OTP record
      await this.otpRepository.remove(otpRecord);
      throw new HttpException('OTP has expired', HttpStatus.BAD_REQUEST);
    }

    // If the OTP is incorrect, throw an error
    if (otpRecord.otp !== otp) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }

    // Remove OTP after successful verification
    await this.otpRepository.remove(otpRecord);

    // Find the user by phone number
    let user = await this.userRepository.findOne({ where: { phoneNumber } });
    if (!user) {
      user = this.userRepository.create({ phoneNumber });
      await this.userRepository.save(user);
    }

    // Set the user as verified after OTP verification
    await this.userRepository.update({ phoneNumber }, { isVerified: true });

    // Generate and return JWT token
    return this.jwtService.sign({ userId: user.id });
  }
}
