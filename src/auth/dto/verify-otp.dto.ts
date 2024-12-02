import { IsNotEmpty, Length, Matches } from 'class-validator';

export class VerifyOtpDto {
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message:
      'Invalid phone number format. Please provide a valid phone number.',
  })
  @IsNotEmpty({ message: 'Phone numner is required' })
  phoneNumber: string;

  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  @IsNotEmpty({ message: 'OTP is required' })
  otp: string;
}
