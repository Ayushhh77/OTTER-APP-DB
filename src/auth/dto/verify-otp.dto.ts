import { IsPhoneNumber, IsNotEmpty, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  @IsNotEmpty()
  otp: string;
}
