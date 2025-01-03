import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from 'mongodb';
import { VertexPointerEntity } from './vertex-pointer.entity';
import { COLLECTION_COLLATION_LOCALE } from '../../constants';

@Entity({ tableName: 'brokerAccount' })
export class BrokerAccountEntity extends VertexPointerEntity {
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
  @Index({ options: { collation: { locale: COLLECTION_COLLATION_LOCALE } } })
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
