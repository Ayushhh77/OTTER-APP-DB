import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { SendOtpDto } from '../auth/dto/send-otp.dto';
import { VerifyOtpDto } from '../auth/dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  async sendOtp(@Body() sendOtpDto: SendOtpDto): Promise<{ message: string }> {
    await this.authService.sendOtp(sendOtpDto.phoneNumber);
    return { message: 'OTP has been ent sucessfully to your phone number' };
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<string> {
    return this.authService.verifyOtp(
      verifyOtpDto.phoneNumber,
      verifyOtpDto.otp,
    );
  }
}
