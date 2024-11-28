import { IsPhoneNumber, IsNotEmpty } from 'class-validator';

export class SendOtpDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;
}
