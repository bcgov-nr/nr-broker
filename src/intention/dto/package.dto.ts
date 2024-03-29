import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Entity, Column } from 'typeorm';

@Entity()
export class PackageDto {
  @IsString()
  @IsOptional()
  @Column()
  architecture?: string;

  @IsString()
  @IsOptional()
  @Column()
  buildGuid?: string;

  @IsNumber()
  @IsOptional()
  @Column()
  buildNumber?: number;

  @IsString()
  @IsOptional()
  @Column()
  buildVersion?: string;

  @IsString()
  @IsOptional()
  @Column()
  checksum?: string;

  @IsString()
  @IsOptional()
  @Column()
  description?: string;

  @IsString()
  @IsOptional()
  @Column()
  installScope?: string;

  @IsString()
  @IsOptional()
  @Column()
  license?: string;

  @IsString()
  @IsOptional()
  @Column()
  name?: string;

  @IsString()
  @IsOptional()
  @Column()
  path?: string;

  @IsString()
  @IsOptional()
  @Column()
  reference?: string;

  @IsNumber()
  @IsOptional()
  @Column()
  size?: number;

  @IsString()
  @IsOptional()
  @Column()
  type?: string;

  @IsString()
  @IsOptional()
  @Column()
  version?: string;
}
