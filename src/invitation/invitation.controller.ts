import {
  Controller,
  Post,
  Body,
  // Param,
  UseGuards,
  // Put,
  Req,
} from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('invitation')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @UseGuards(JwtAuthGuard)
  @Post('send')
  async sendInvitation(
    @Req() req, // Extract user from the request (JWT payload)
    @Body('receiverPhoneNumber') receiverPhoneNumber: string,
  ) {
    const senderId = req.user.userId; // Use userId from JWT token
    return this.invitationService.sendInvitation(senderId, receiverPhoneNumber);
  }

  // @UseGuards(JwtAuthGuard)
  // @Put(':invitationId/status')
  // async updateInvitationStatus(
  //   @Param('invitationId') invitationId: number,
  //   @Body() { status }: { status: 'accepted' | 'rejected' },
  // ) {
  //   return this.invitationService.updateInvitationStatus(invitationId, status);
  // }
}
