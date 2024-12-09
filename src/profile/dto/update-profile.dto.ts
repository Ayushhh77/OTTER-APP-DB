export class UpdateProfileDto {
  fullName?: string;
  birthday?: Date;
  gender?: string;
  location?: string;
  email?: string;
  invitePartner?: boolean;
  partnerPhoneNumber?: string;
  interests?: string[];
}
