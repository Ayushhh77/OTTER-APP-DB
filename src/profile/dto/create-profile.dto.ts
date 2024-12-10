import {
  IsString,
  IsEmail,
  IsBoolean,
  IsArray,
  IsDate,
  Length,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @Length(1, 255)
  fullName: string;

  @IsDate()
  dob: Date;

  @IsString()
  @Length(1, 50)
  gender: string;

  @IsString()
  @Length(1, 255)
  location: string;

  @IsEmail()
  @Length(1, 255)
  email: string;

  @IsBoolean()
  invitePartner: boolean;

  partnerPhoneNumber: string;

  @IsArray()
  interests: string[];
}
