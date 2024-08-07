import { Inject, Injectable } from '@angular/core';
import { CURRENT_USER } from '../app-initialize.factory';
import { UserDto } from './graph.types';
import { UserPermissionRestDto } from './dto/user-permission-rest.dto';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private hasAdminPermission: boolean;
  constructor(@Inject(CURRENT_USER) readonly user: UserDto) {
    this.hasAdminPermission = !!user?.roles?.includes('admin');
  }

  public hasAdmin() {
    return this.hasAdminPermission;
  }

  public hasSudo(permissions: UserPermissionRestDto, vertex: string) {
    if (!permissions) {
      return false;
    }
    return this.hasAdminPermission || permissions.sudo.indexOf(vertex) !== -1;
  }

  public hasUpdate(permissions: UserPermissionRestDto, vertex: string) {
    if (!permissions) {
      return false;
    }
    return this.hasAdminPermission || permissions.update.indexOf(vertex) !== -1;
  }

  public hasDelete(permissions: UserPermissionRestDto, vertex: string) {
    if (!permissions) {
      return false;
    }
    return this.hasAdminPermission || permissions.delete.indexOf(vertex) !== -1;
  }

  public hasApprove(permissions: UserPermissionRestDto, vertex: string) {
    if (!permissions) {
      return false;
    }
    return (
      this.hasAdminPermission || permissions.approve.indexOf(vertex) !== -1
    );
  }
}
