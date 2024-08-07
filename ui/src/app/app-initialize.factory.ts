import { HttpClient } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from '../environments/environment';
import {
  CollectionConfigMap,
  CollectionEdgeConfigMap,
  UserDto,
} from './service/graph.types';
import { PreferenceRestDto } from './preference-rest.dto';
import { CollectionConfigRestDto } from './service/dto/collection-config-rest.dto';
import { GraphUtilService } from './service/graph-util.service';

let userInfo: UserDto;
let preferencesInit: PreferenceRestDto;
let configArr: CollectionConfigRestDto[];
let configMap: CollectionConfigMap;
let configSrcTarMap: CollectionEdgeConfigMap;

export const CURRENT_USER = new InjectionToken<UserDto>('CURRENT_USER', {
  providedIn: 'root',
  factory: () => userInfo,
});

export const INITIAL_PREFERENCES = new InjectionToken<PreferenceRestDto>(
  'INITIAL_PREFERENCES',
  {
    providedIn: 'root',
    factory: () => preferencesInit,
  },
);

export const CONFIG_ARR = new InjectionToken<CollectionConfigRestDto[]>(
  'CONFIG_ARR',
  {
    providedIn: 'root',
    factory: () => configArr,
  },
);

export const CONFIG_MAP = new InjectionToken<CollectionConfigMap>(
  'CONFIG_MAP',
  {
    providedIn: 'root',
    factory: () => configMap,
  },
);

export const CONFIG_EDGE_CONFIG_MAP =
  new InjectionToken<CollectionEdgeConfigMap>('CONFIG_EDGE_CONFIG_MAP', {
    providedIn: 'root',
    factory: () => configSrcTarMap,
  });

export function appInitializeUserFactory(
  http: HttpClient,
): () => Observable<any> {
  return () =>
    http.get<UserDto>(`${environment.apiUrl}/v1/collection/user/self`).pipe(
      tap((user) => {
        userInfo = user;
      }),
      catchError((e) => {
        if (e.status === 401) {
          window.location.href = `${environment.apiUrl}/auth/login`;
        }
        // Create obserable that never completes to stall start up
        return new Observable();
      }),
    );
}

export function appInitializePrefFactory(
  http: HttpClient,
): () => Observable<any> {
  return () =>
    http
      .get<PreferenceRestDto>(`${environment.apiUrl}/v1/preference/self`)
      .pipe(
        tap((preferences) => {
          preferencesInit = preferences;
        }),
        catchError((e) => {
          if (e.status === 401) {
            window.location.href = `${environment.apiUrl}/auth/login`;
          }
          // Create obserable that never completes to stall start up
          return new Observable();
        }),
      );
}

export function appInitializeConfigFactory(
  http: HttpClient,
): () => Observable<any> {
  return () =>
    http
      .get<
        CollectionConfigRestDto[]
      >(`${environment.apiUrl}/v1/collection/config`)
      .pipe(
        tap((configArrInner) => {
          configArr = configArrInner;
          configMap = GraphUtilService.configArrToMap(configArrInner);
          configSrcTarMap = GraphUtilService.configArrToSrcTarMap(
            configArr,
            configMap,
          );
        }),
        catchError((e) => {
          if (e.status === 401) {
            window.location.href = `${environment.apiUrl}/auth/login`;
          }
          // Create obserable that never completes to stall start up
          return new Observable();
        }),
      );
}
