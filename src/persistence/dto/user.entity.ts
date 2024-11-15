import { ApiHideProperty } from '@nestjs/swagger';
import {
  Embeddable,
  Embedded,
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from 'mongodb';
import { VertexPointerDto } from './vertex-pointer.dto';

@Embeddable()
export class UserAliasDto {
  @Property()
  domain: string;

  @Property()
  guid: string;

  @Property()
  name: string;

  @Property()
  username: string;
}

@Entity({ tableName: 'user' })
export class UserEntity extends VertexPointerDto {
  @ApiHideProperty()
  @PrimaryKey()
  @Property()
  _id: ObjectId;

  @SerializedPrimaryKey()
  id!: string; // won't be saved in the database

  @Embedded(() => UserAliasDto, { array: true, nullable: true })
  alias?: UserAliasDto[];

  @Property()
  domain: string;

  @Property()
  email: string;

  @Property()
  guid: string;

  @Property()
  name: string;

  @Property()
  username: string;
}
