import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from 'mongodb';
import { ApiHideProperty } from '@nestjs/swagger';
import { VertexPointerEntity } from './vertex-pointer.entity';

@Entity({ tableName: 'project' })
export class ProjectEntity extends VertexPointerEntity {
  @ApiHideProperty()
  @PrimaryKey()
  @Property()
  _id: ObjectId;

  @SerializedPrimaryKey()
  id!: string; // won't be saved in the database

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  email?: string;

  @Property()
  name: string;

  @Property({ nullable: true })
  title?: string;

  @Property({ nullable: true })
  website?: string;
}
