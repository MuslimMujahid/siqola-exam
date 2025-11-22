import { IsOptional, IsEnum, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { MembershipStatus, Role } from 'generated/prisma/enums';
import { Transform } from 'class-transformer';

// Helper to transform single value or array to array
const toArray = ({ value }: { value: string | string[] | undefined }) => {
  if (value === undefined || value === null) return undefined;
  return Array.isArray(value) ? value : [value];
};

export class FilterUsersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(toArray)
  @IsEnum(Role, { each: true })
  role?: Role[];

  @IsOptional()
  @Transform(toArray)
  @IsEnum(MembershipStatus, { each: true })
  status?: MembershipStatus[];

  @IsOptional()
  @Transform(toArray)
  @IsString({ each: true })
  institutionId?: string[];

  @IsOptional()
  @Transform(toArray)
  @IsString({ each: true })
  groupId?: string[];

  @IsOptional()
  @Transform(toArray)
  @IsString({ each: true })
  excludeGroupId?: string[];
}
