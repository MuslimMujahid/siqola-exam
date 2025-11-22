import { IsArray, IsString } from 'class-validator';

export class AddBatchGroupMembersDto {
  @IsArray()
  @IsString({ each: true })
  userIds: string[];
}
