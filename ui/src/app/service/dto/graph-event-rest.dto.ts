import { EdgeRestDto } from './edge-rest.dto';
import {
  GraphDataResponseVertexDto,
  GraphDeleteResponseDto,
} from './graph-data.dto';

// Shared DTO: Copy in back-end and front-end should be identical
export type GraphEventRestDto =
  | GraphCollectionEventRestDto
  | GraphEdgeEventRestDto
  | GraphVertexEventRestDto
  | GraphDeleteEventRestDto;

export class GraphCollectionEventRestDto {
  event!: 'collection-edit';
  collection!: { id: string; vertex: string };
}

export class GraphEdgeEventRestDto {
  event!: 'edge-add' | 'edge-edit';
  edge!: EdgeRestDto;
}

export class GraphVertexEventRestDto {
  event!: 'vertex-add' | 'vertex-edit';
  vertex!: GraphDataResponseVertexDto;
}

export class GraphDeleteEventRestDto extends GraphDeleteResponseDto {
  event!: 'edge-delete' | 'vertex-delete';
}
