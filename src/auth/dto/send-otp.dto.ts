import { IsNotEmpty, Matches } from 'class-validator';

export class SendOtpDto {
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message:
      'Invalid phone number format. Please provide a valid phone number with a country code (e.g., +13375902372).',
  })
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;
}
