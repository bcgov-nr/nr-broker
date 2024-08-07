import { Injectable } from '@angular/core';
import { CollectionDtoRestUnion } from './dto/collection-dto-union.type';
import { VertexRestDto } from './dto/vertex-rest.dto';

@Injectable({
  providedIn: 'root',
})
export class CollectionUtilService {
  constructor() {}

  /**
   * Narrows a collection union to a specific collection type based on name.
   * Calling code should evaluate if vertex if and collection vertex are a
   * equal to name before calling. Will throw error if collection does not match.
   * @param name The name of the collection type to narrow the collection to
   * @param vertex The vertex to use to narrow the collection.
   * @param collection The collection to narrow.
   * @returns The narrowed collection
   */
  narrowCollectionType<T extends keyof CollectionDtoRestUnion>(
    name: T,
    vertex: VertexRestDto,
    collection: CollectionDtoRestUnion[keyof CollectionDtoRestUnion],
  ) {
    if (vertex.collection === name && collection.vertex === vertex.id) {
      return collection as CollectionDtoRestUnion[T];
    }
    // Calling code should ALWAYS evaluate name and collection name's equality
    throw new Error();
  }
}
