export class UpdateProfileDto {
  fullName?: string;
  dob?: Date;
  gender?: string;
  location?: string;
  email?: string;
  invitePartner?: boolean;
  partnerPhoneNumber?: string;
  interests?: string[];
}
