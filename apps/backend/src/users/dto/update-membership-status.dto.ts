import { IsEnum } from 'class-validator';

export enum MembershipStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export class UpdateMembershipStatusDto {
  @IsEnum(MembershipStatus)
  status: MembershipStatus;
}
