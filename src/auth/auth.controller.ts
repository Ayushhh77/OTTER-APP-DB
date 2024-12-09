import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { SendOtpDto } from '../auth/dto/send-otp.dto';
import { VerifyOtpDto } from '../auth/dto/verify-otp.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
@ApiTags('Authentication') // Grouped under 'Authentication' in Swagger UI
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to phone number' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid phone number.' })
  async sendOtp(@Body() sendOtpDto: SendOtpDto): Promise<{ message: string }> {
    await this.authService.sendOtp(sendOtpDto.phoneNumber);
    return { message: 'OTP has been sent sucessfully to your phone number' };
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP sent to the user' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or Expired OTP.' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<string> {
    return this.authService.verifyOtp(
      verifyOtpDto.phoneNumber,
      verifyOtpDto.otp,
    );
  }
}
