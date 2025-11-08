import { TaskPriority, TaskState } from "@prisma/client";
import { IsString, IsOptional, IsEnum, IsNumber, IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskState)
  @IsOptional()
  state?: TaskState;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @IsNumber()
  @IsOptional()
  estimateHours?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dueDate?: Date;
}