import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from 'mongodb';
import { ApiHideProperty } from '@nestjs/swagger';
import { VertexPointerEntity } from './vertex-pointer.entity';

@Entity({ tableName: 'environment' })
export class EnvironmentEntity extends VertexPointerEntity {
  @ApiHideProperty()
  @PrimaryKey()
  @Property()
  _id: ObjectId;

  @SerializedPrimaryKey()
  id!: string; // won't be saved in the database

  @Property()
  name: string;

  @Property()
  short: string;

  @Property()
  aliases: string[];

  @Property()
  title: string;

  @Property()
  position: number;
}
