import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';
import { UpsertProfileDto } from './dto/profile.dto';

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  getMyProfile(@Req() req: any) {
    return this.profileService.getMyProfile(req.user.id);
  }

  @Put()
  upsertProfile(@Req() req: any, @Body() dto: UpsertProfileDto) {
    return this.profileService.upsertProfile(req.user.id, dto);
  }
}
