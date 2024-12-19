import { ApiHideProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from 'mongodb';
import { VertexPointerEntity } from './vertex-pointer.entity';

@Entity({ tableName: 'team' })
export class TeamEntity extends VertexPointerEntity {
  @ApiHideProperty()
  @PrimaryKey()
  @Property()
  _id: ObjectId;

  @SerializedPrimaryKey()
  id!: string; // won't be saved in the database

  @Property()
  email: string;

  @Property()
  name: string;

  @Property({ nullable: true })
  website?: string;
}