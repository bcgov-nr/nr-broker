import { EdgeDto } from '../dto/edge.dto';
import { GraphDataResponseDto } from '../dto/graph-data.dto';
import { VertexInsertDto } from '../dto/vertex-rest.dto';
import { VertexDto } from '../dto/vertex.dto';

export abstract class GraphRepository {
  // Data for graph
  public abstract getData(
    includeCollection: boolean,
  ): Promise<GraphDataResponseDto>;
  // Edge
  public abstract addEdge(edge: EdgeDto): Promise<EdgeDto>;
  public abstract deleteEdge(id: string): Promise<boolean>;
  public abstract getEdge(id: string): Promise<EdgeDto | null>;
  // Vertex
  public abstract addVertex(
    vertex: VertexInsertDto,
    ignorePermissions?: boolean,
  ): Promise<VertexDto>;
  public abstract editVertex(
    id: string,
    vertex: VertexInsertDto,
  ): Promise<VertexDto>;
  public abstract deleteVertex(id: string): Promise<boolean>;
  public abstract getVertex(id: string): Promise<VertexDto | null>;
}
