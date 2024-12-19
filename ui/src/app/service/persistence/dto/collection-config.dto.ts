import { CollectionNames } from './collection-dto-union.type';
import { EdgeDto } from './edge.dto';
import { UserPermissionNames } from './user-permission.dto';

// Shared DTO: Copy in back-end and front-end should be identical
export class CollectionEdgePermissions {
  request!: boolean;
}

export class CollectionEdgePrototype {
  description!: string;
  target!: string;
  targetName!: string;
  name!: string;
  permissions!: CollectionEdgePermissions;
  property!: CollectionFieldConfigMap;
  url!: string;
}

export class CollectionEdgeConfig {
  id!: string;
  collection!: CollectionNames;
  name!: string;
  onDelete?: 'cascade';
  relation!: 'oneToMany' | 'oneToOne';
  show!: boolean;
  inboundName?: string;
  namePath?: string;
  prototypes?: CollectionEdgePrototype[];
}

export type CollectionEdgeInstanceConfig = Omit<
  CollectionEdgeConfig,
  'prototypes'
> & {
  prototype: CollectionEdgePrototype;
};

export class CollectionFieldConfig {
  hint!: string;
  init?: 'uuid' | 'now';
  mask?: {
    [Property in UserPermissionNames]?: boolean | string[];
  };
  name!: string;
  placeholder?: string;
  required!: boolean;
  sort?: boolean;
  type!:
    | 'boolean'
    | 'date'
    | 'email'
    | 'embeddedDoc'
    | 'embeddedDocArray'
    | 'json'
    | 'number'
    | 'string'
    | 'stringArray'
    | 'url';
  unique?: boolean;
  uniqueParent?: boolean;
  value?: string | boolean;
  valuePath?: string;
}

export class CollectionFieldConfigMap {
  [key: string]: CollectionFieldConfig;
}

export class CollectionMap {
  getPath!: string;
  setPath!: string;
}

export class CollectionConfigParent {
  edgeName!: string;
}

export class CollectionConfigPermissions {
  browse!: boolean;
  create!: boolean;
  filter!: boolean;
  update!: boolean;
  delete!: boolean;
}

export class CollectionConfigDto {
  id!: string;
  browseFields!: string[];
  collection!: CollectionNames;
  collectionMapper!: CollectionMap[];
  collectionVertexName!: string;
  color!: string;
  edges!: CollectionEdgeConfig[];
  fields!: CollectionFieldConfigMap;
  hint!: string;
  index!: number;
  name!: string;
  parent!: CollectionConfigParent;
  permissions!: CollectionConfigPermissions;
  show!: boolean;
}

export class LinksAltDto {
  environmentPosition!: number;
  environmentTitle!: string;
  name!: string;
  url!: string;
}
export class LinksDto {
  default!: string;
  alt?: LinksAltDto[];
}

export class CollectionSyncConfig {
  index!: string;
  unique!: string;
  map!: {
    [key: string]:
      | {
          type: 'first';
          dest: string;
        }
      | {
          type: 'pick';
          endsWith: string[];
          dest: string;
        };
  };
}

export type CollectionConfigInstanceDto = Omit<CollectionConfigDto, 'edges'> & {
  edge: CollectionEdgeInstanceConfig;
  instance?: EdgeDto;
  links?: LinksDto;
};