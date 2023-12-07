import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CollectionSearchResult } from './dto/collection-search-result.dto';
import { CollectionDtoUnion } from './dto/collection-dto-union.type';
import { GraphUtilService } from './graph-util.service';

@Injectable({
  providedIn: 'root',
})
export class CollectionApiService {
  constructor(
    private readonly util: GraphUtilService,
    private readonly http: HttpClient,
  ) {}

  public getCollectionById<T extends keyof CollectionDtoUnion>(
    name: T,
    id: string,
  ) {
    return this.http.get<CollectionDtoUnion[T]>(
      `${environment.apiUrl}/v1/collection/${this.util.snakecase(name)}/${id}`,
      {
        responseType: 'json',
      },
    );
  }

  public searchCollection<T extends keyof CollectionDtoUnion>(
    name: T,
    upstreamVertex: string | null = null,
    vertexId: string | null = null,
    offset = 0,
    limit = 5,
  ) {
    return this.http.post<CollectionSearchResult<CollectionDtoUnion[T]>>(
      `${environment.apiUrl}/v1/collection/${this.util.snakecase(
        name,
      )}/search?${upstreamVertex ? `upstreamVertex=${upstreamVertex}&` : ''}${
        vertexId ? `vertexId=${vertexId}&` : ''
      }offset=${offset}&limit=${limit}`,
      {
        responseType: 'json',
      },
    );
  }

  public getServiceSecure(serviceId: string) {
    return this.http.get(
      `${environment.apiUrl}/v1/collection/service/${serviceId}/secure`,
      {
        responseType: 'json',
      },
    );
  }
}
