import { IsString } from 'class-validator';

export class AddGroupMemberDto {
  @IsString()
  userId: string;
}
