import { IsArray, IsString, IsEnum } from 'class-validator';

export enum BulkOperationType {
  PUBLISH = 'PUBLISH',
  UNPUBLISH = 'UNPUBLISH',
  DELETE = 'DELETE',
}

export class BulkOperationsDto {
  @IsArray()
  @IsString({ each: true })
  examIds: string[];

  @IsEnum(BulkOperationType)
  operation: BulkOperationType;
}
