// Shared DTO: Copy in back-end and front-end should be identical
export interface CollectionEdgeConfig {
  collection: string;
  name: string;
  onDelete?: 'cascade';
  relation: 'oneToMany' | 'oneToOne';
  inboundName?: string;
  namePath?: string;
}

export interface CollectionFieldConfigMap {
  [key: string]: CollectionFieldConfig;
}

export interface CollectionFieldConfig {
  hint?: string;
  placeholder?: string;
  required: boolean;
  type: 'email' | 'json' | 'string' | 'url';
  value?: string;
}

export interface CollectionMap {
  getPath: string;
  setPath: string;
}

export interface CollectionConfigResponseDto {
  id: string;
  collection: string;
  collectionMapper: CollectionMap[];
  edges: CollectionEdgeConfig[];
  fields: CollectionFieldConfigMap;
  index: number;
  name: string;
  parent?: {
    edgeName: string;
  };
  permissions: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
}