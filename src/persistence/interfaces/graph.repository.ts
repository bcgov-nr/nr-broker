import { GraphTypeaheadResult } from '../../graph/dto/graph-typeahead-result.dto';
import { CollectionDtoUnion } from '../dto/collection-dto-union.type';
import { CollectionConfigInstanceDto } from '../dto/collection-config.entity';
import { EdgeInsertDto } from '../dto/edge-rest.dto';
import { EdgeEntity } from '../dto/edge.entity';
import {
  BrokerAccountProjectMapDto,
  GraphDataResponseDto,
  GraphDeleteResponseDto,
} from '../dto/graph-data.dto';
import { VertexInfoDto } from '../dto/vertex-info.dto';
import { VertexPointerDto } from '../dto/vertex-pointer.dto';
import { VertexSearchDto } from '../dto/vertex-rest.dto';
import { VertexEntity } from '../dto/vertex.entity';
import { GraphProjectServicesResponseDto } from '../dto/graph-project-services-rest.dto';
import { GraphServerInstallsResponseDto } from '../dto/graph-server-installs-rest.dto';
import { ServiceDetailsResponseDto } from '../dto/service-rest.dto';
import { UserPermissionRestDto } from '../dto/user-permission-rest.dto';
import { GraphVertexConnections } from '../dto/collection-combo.dto';
import { GraphUpDownDto } from '../dto/graph-updown.dto';
import { ServiceInstanceDetailsResponseDto } from '../dto/service-instance-rest.dto';

export abstract class GraphRepository {
  // Data for graph
  public abstract getData(
    includeCollection: boolean,
  ): Promise<GraphDataResponseDto>;
  public abstract getDataSlice(
    collections: string[],
  ): Promise<GraphDataResponseDto>;
  public abstract getProjectServices(): Promise<
    GraphProjectServicesResponseDto[]
  >;
  public abstract getServerInstalls(): Promise<
    GraphServerInstallsResponseDto[]
  >;
  public abstract getServiceDetails(
    id: string,
  ): Promise<ServiceDetailsResponseDto>;
  public abstract getServiceInstanceDetails(
    id: string,
  ): Promise<ServiceInstanceDetailsResponseDto>;
  public abstract getUserPermissions(
    id: string,
  ): Promise<UserPermissionRestDto>;
  // Edge
  public abstract addEdge(edge: EdgeInsertDto): Promise<EdgeEntity>;
  public abstract editEdge(
    id: string,
    edge: EdgeInsertDto,
  ): Promise<EdgeEntity>;
  public abstract deleteEdge(id: string): Promise<GraphDeleteResponseDto>;
  public abstract getEdge(id: string): Promise<EdgeEntity | null>;
  public abstract getEdgeByNameAndVertices(
    name: string,
    source: string,
    target: string,
  ): Promise<EdgeEntity>;
  public abstract searchEdgesShallow(
    name: string,
    source?: string,
    target?: string,
  ): Promise<EdgeEntity[]>;
  public abstract getEdgeConfigByVertex(
    sourceId: string,
    targetCollection?: string,
    edgeName?: string,
  ): Promise<CollectionConfigInstanceDto[]>;
  // Vertex
  public abstract addVertex(
    vertex: VertexEntity,
    collection: CollectionDtoUnion[typeof vertex.collection],
  ): Promise<VertexEntity>;
  public abstract editVertex(
    id: string,
    vertex: VertexEntity,
    collection: CollectionDtoUnion[typeof vertex.collection],
    ignoreBlankFields?: boolean,
  ): Promise<VertexEntity>;
  public abstract deleteVertex(id: string): Promise<GraphDeleteResponseDto>;
  public abstract getVertex(id: string): Promise<VertexEntity | null>;
  public abstract getVertexByName(
    collection: keyof CollectionDtoUnion,
    name: string,
  ): Promise<VertexEntity | null>;
  public abstract getVertexConnections(
    id: string,
  ): Promise<GraphVertexConnections>;
  public abstract getVertexInfo(id: string): Promise<VertexInfoDto>;
  public abstract searchVertex(
    collection: keyof CollectionDtoUnion,
    edgeName?: string,
    edgeTarget?: string,
  ): Promise<VertexSearchDto[]>;
  public abstract getUserConnectedVertex(id: string): Promise<string[]>;
  public abstract getVertexByParentIdAndName(
    collection: keyof CollectionDtoUnion,
    parentId: string,
    name: string,
  ): Promise<VertexEntity | null>;
  public abstract getUpstreamVertex<T extends VertexPointerDto>(
    id: string,
    index: number,
    matchEdgeNames: string[] | null,
  ): Promise<GraphUpDownDto<T>[]>;
  public abstract getDownstreamVertex<T extends VertexPointerDto>(
    id: string,
    index: number,
    maxDepth: number,
  ): Promise<GraphUpDownDto<T>[]>;
  public abstract getBrokerAccountServices(
    id: string,
  ): Promise<BrokerAccountProjectMapDto>;

  public abstract vertexTypeahead<T extends keyof CollectionDtoUnion>(
    text: string,
    collections?: T[],
    offset?: number,
    limit?: number,
  ): Promise<GraphTypeaheadResult>;

  public abstract reindexCache(): Promise<boolean>;
}
