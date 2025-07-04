import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { OAUTH2_CLIENT_MAP_GUID } from '../constants';
import { CollectionRepository } from '../persistence/interfaces/collection.repository';

@Injectable()
export class AuthService {
  constructor(private readonly collectionRepository: CollectionRepository) {}

  public getUser(request: Request) {
    const userGuid: string = (request as any).user.userinfo[
      OAUTH2_CLIENT_MAP_GUID
    ];
    return this.collectionRepository.getCollectionByKeyValue(
      'user',
      'guid',
      userGuid,
    );
  }
}
