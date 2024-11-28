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
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

    // Send OTP via SMS
    try {
      await this.smsService.sendSms(phoneNumber, `Your OTP is ${otp}`);
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new HttpException(
        'Failed to send OTP. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Save OTP to the database
    const otpRecord = this.otpRepository.create({ phoneNumber, otp });
    await this.otpRepository.save(otpRecord);
  }

  // Verify OTP and log the user in
  async verifyOtp(phoneNumber: string, otp: string): Promise<string> {
    const otpRecord = await this.otpRepository.findOne({
      where: { phoneNumber },
      order: { createdAt: 'DESC' },
    });

    if (!otpRecord || otpRecord.otp !== otp) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }

    // Remove OTP after successful verification
    await this.otpRepository.remove(otpRecord);

    // Check if the user exists, or create a new one
    let user = await this.userRepository.findOne({ where: { phoneNumber } });
    if (!user) {
      user = this.userRepository.create({ phoneNumber });
      await this.userRepository.save(user);
    }

    // Generate JWT token
    return this.jwtService.sign({ userId: user.id });
  }
}
