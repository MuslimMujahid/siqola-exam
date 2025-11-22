import { IsArray, IsString } from 'class-validator';

export class RemoveBatchGroupMembersDto {
  @IsArray()
  @IsString({ each: true })
  userIds: string[];
}
