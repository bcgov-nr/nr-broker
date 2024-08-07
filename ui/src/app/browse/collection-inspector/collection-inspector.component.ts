import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import {
  BehaviorSubject,
  Subject,
  Subscription,
  combineLatest,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';

import { GraphApiService } from '../../service/graph-api.service';
import { CollectionApiService } from '../../service/collection-api.service';
import { PermissionService } from '../../service/permission.service';
import { CONFIG_MAP } from '../../app-initialize.factory';
import { CollectionConfigMap } from '../../service/graph.types';

import { CollectionNames } from '../../service/dto/collection-dto-union.type';
import { CollectionConfigRestDto } from '../../service/dto/collection-config-rest.dto';
import { CollectionHeaderComponent } from '../../shared/collection-header/collection-header.component';
import { InspectorAccountComponent } from '../../graph/inspector-account/inspector-account.component';
import { InspectorInstallsComponent } from '../../graph/inspector-installs/inspector-installs.component';
import { InspectorInstancesComponent } from '../../graph/inspector-instances/inspector-instances.component';
import { InspectorIntentionsComponent } from '../../graph/inspector-intentions/inspector-intentions.component';
import { InspectorServiceSecureComponent } from '../../graph/inspector-service-secure/inspector-service-secure.component';
import { InspectorTeamComponent } from '../../graph/inspector-team/inspector-team.component';
import { InspectorVaultComponent } from '../../graph/inspector-vault/inspector-vault.component';
import { InspectorVertexFieldsComponent } from '../../graph/inspector-vertex-fields/inspector-vertex-fields.component';
import { VertexTagsComponent } from '../../graph/vertex-tags/vertex-tags.component';
import { InspectorServiceReleasesComponent } from '../../graph/inspector-service-releases/inspector-service-releases.component';
import { TeamServicesComponent } from '../team-services/team-services.component';
import { TeamAccountsComponent } from '../team-accounts/team-accounts.component';
import { TeamMembersComponent } from '../team-members/team-members.component';
import { InspectorConnectionsComponent } from '../../graph/inspector-connections/inspector-connections.component';
import { CollectionCombo } from '../../service/dto/collection-search-result.dto';
import { CollectionUtilService } from '../../service/collection-util.service';
import { VertexRestDto } from '../../service/dto/vertex-rest.dto';
import { EdgeRestDto } from '../../service/dto/edge-rest.dto';
import { GraphUtilService } from '../../service/graph-util.service';
import { InspectorPropertiesComponent } from '../../graph/inspector-properties/inspector-properties.component';
import { InspectorTimestampsComponent } from '../../graph/inspector-timestamps/inspector-timestamps.component';
import { InspectorPeopleComponent } from '../../graph/inspector-people/inspector-people.component';

@Component({
  selector: 'app-collection-inspector',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatGridListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    CollectionHeaderComponent,
    InspectorAccountComponent,
    InspectorInstallsComponent,
    InspectorInstancesComponent,
    InspectorIntentionsComponent,
    InspectorServiceSecureComponent,
    InspectorServiceReleasesComponent,
    InspectorTeamComponent,
    InspectorVaultComponent,
    InspectorVertexFieldsComponent,
    InspectorConnectionsComponent,
    InspectorPeopleComponent,
    InspectorPropertiesComponent,
    InspectorTimestampsComponent,
    TeamAccountsComponent,
    TeamMembersComponent,
    TeamServicesComponent,
    VertexTagsComponent,
  ],
  templateUrl: './collection-inspector.component.html',
  styleUrl: './collection-inspector.component.scss',
})
export class CollectionInspectorComponent implements OnInit, OnDestroy {
  // Url params
  public collection: CollectionNames = 'project';
  public collectionId!: string;
  routeSub: Subscription | null = null;

  // Loaded data
  public loading = true;
  public config!: CollectionConfigRestDto;
  public comboData!: CollectionCombo<any>;
  public serviceDetails: any = null;

  // Permissions
  hasAdmin = false;
  hasDelete = false;
  hasSudo = false;
  hasUpdate = false;
  hasApprove = false;

  private triggerRefresh = new BehaviorSubject(true);
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
    private readonly graphApi: GraphApiService,
    private readonly graphUtil: GraphUtilService,
    private readonly collectionApi: CollectionApiService,
    private readonly permission: PermissionService,
    public readonly collectionUtil: CollectionUtilService,
    @Inject(CONFIG_MAP) private readonly configMap: CollectionConfigMap,
  ) {}

  ngOnInit(): void {
    if (!this.routeSub) {
      this.routeSub = this.activatedRoute.params.subscribe(() => {
        this.initComponent();
        this.updateCollection();
      });
    }

    this.graphApi
      .createEventSource()
      .pipe(takeUntil(this.ngUnsubscribe), startWith(null))
      .subscribe((es: any) => {
        if (es !== null && this.comboData.collection) {
          if (es.event === 'edge-add') {
            if (
              es.edge.source === this.comboData.collection.vertex ||
              es.edge.target === this.comboData.collection.vertex
            ) {
              this.updateCollection();
              this.openSnackBar(`The object was updated.`);
            }
          }
          if (es.event === 'vertex-edit') {
            if (es.vertex.id === this.comboData.collection.vertex) {
              this.updateCollection();
              this.openSnackBar(`The object was updated.`);
            }
          } else if (es.event === 'collection-edit') {
            if (es.collection.vertex === this.comboData.collection.vertex) {
              this.updateCollection();
              this.openSnackBar(`The object was updated.`);
            }
          } else if (
            es.event === 'vertex-delete' ||
            es.event === 'edge-delete'
          ) {
            if (es.vertex.indexOf(this.comboData.collection.vertex) !== -1) {
              this.openSnackBar(`The object was deleted.`);
              this.back();
            } else if (
              es.adjacentVertex.indexOf(this.comboData.collection.vertex) !== -1
            ) {
              this.updateCollection();
              this.openSnackBar(`The object was updated.`);
            }
          }
        }
      });

    combineLatest([
      this.graphApi.getUserPermissions(),
      this.triggerRefresh.pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap(() => {
          return this.collectionApi.getCollectionComboById(
            this.collection,
            this.collectionId,
          );
        }),
      ),
    ]).subscribe(([permissions, comboData]) => {
      if (!this.configMap[this.collection]) {
        return;
      }

      this.config = this.configMap[this.collection];
      this.comboData = comboData;
      this.hasAdmin = this.permission.hasAdmin();
      this.hasSudo = this.permission.hasSudo(
        permissions,
        this.comboData.collection.vertex,
      );
      this.hasUpdate = this.permission.hasUpdate(
        permissions,
        this.comboData.collection.vertex,
      );
      this.hasDelete = this.permission.hasDelete(
        permissions,
        this.comboData.collection.vertex,
      );
      this.hasApprove = this.permission.hasApprove(
        permissions,
        this.comboData.collection.vertex,
      );

      if (this.collection === 'service') {
        this.collectionApi
          .getServiceDetails(this.comboData.collection.id)
          .subscribe((data: any) => {
            this.serviceDetails = data;
          });
      }
      this.loading = false;
    });
  }

  initComponent() {
    this.collection = this.activatedRoute.snapshot.params['collection'];
    this.collectionId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();

    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  updateCollection() {
    this.triggerRefresh.next(true);
  }

  navigate(target: EdgeRestDto | VertexRestDto) {
    if ('collection' in target) {
      this.collectionApi
        .searchCollection(target.collection, {
          vertexId: target.id,
          offset: 0,
          limit: 1,
        })
        .subscribe((result) => {
          if (result && result.meta.total > 0) {
            this.router.navigate(
              ['/browse', target.collection, result.data[0].collection.id],
              {
                replaceUrl: true,
              },
            );
          }
        });
    } else {
      this.graphUtil.openInGraph(target.id, 'edge');
    }
  }

  back() {
    this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  }

  private openSnackBar(message: string) {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    config.verticalPosition = 'bottom';
    this.snackBar.open(message, 'Dismiss', config);
  }
}
