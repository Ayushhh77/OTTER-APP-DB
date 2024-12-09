import { IsString } from 'class-validator';

export class CreateInvitationDto {
  @IsString()
  partnerPhoneNumber: string;
}
