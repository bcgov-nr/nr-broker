import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from 'mongodb';
import { ApiHideProperty } from '@nestjs/swagger';
import { VertexPointerEntity } from './vertex-pointer.entity';

@Entity({ tableName: 'brokerAccount' })
export class BrokerAccountEntity extends VertexPointerEntity {
  @ApiHideProperty()
  @PrimaryKey()
  @Property()
  _id: ObjectId;

  @SerializedPrimaryKey()
  id!: string; // won't be saved in the database

  @Property()
  email: string;

  @Property()
  clientId: string;

  @Property()
  name: string;

  @Property({ nullable: true })
  website?: string;

  @Property()
  enableUserImport: boolean;

  @Property()
  requireRoleId: boolean;

  @Property()
  requireProjectExists: boolean;

  @Property()
  requireServiceExists: boolean;

  @Property()
  skipUserValidation: boolean;

  @Property()
  maskSemverFailures: boolean;
}
