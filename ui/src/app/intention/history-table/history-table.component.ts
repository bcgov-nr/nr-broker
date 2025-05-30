import {
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Router } from '@angular/router';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  MatSnackBar,
  MatSnackBarModule,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import prettyMilliseconds from 'pretty-ms';
import { switchMap } from 'rxjs';

import { GraphUtilService } from '../../service/graph-util.service';
import { CollectionApiService } from '../../service/collection-api.service';
import { GanttGraphComponent } from '../gantt-graph/gantt-graph.component';
import { ActionContentComponent } from '../action-content/action-content.component';
import { FilesizePipe } from '../../util/filesize.pipe';
import { CollectionDtoUnion } from '../../service/persistence/dto/collection-dto-union.type';
import { OutcomeIconComponent } from '../../shared/outcome-icon/outcome-icon.component';
import { PackageUtilService } from '../../service/package-util.service';
import { CollectionUtilService } from '../../service/collection-util.service';

@Component({
  selector: 'app-history-table',
  imports: [
    ClipboardModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTableModule,
    MatTooltipModule,
    MatSnackBarModule,
    ActionContentComponent,
    FilesizePipe,
    GanttGraphComponent,
    OutcomeIconComponent,
  ],
  templateUrl: './history-table.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
  styleUrl: './history-table.component.scss',
})
export class HistoryTableComponent implements OnInit, OnChanges {
  readonly intentionData = input<any[]>([]);
  readonly layout = input<'narrow' | 'normal'>('normal');
  readonly showHeader = input(true);
  readonly openFirst = input(false);
  readonly actionServiceFilter = input('');
  @Output() viewIntentionEvent = new EventEmitter<string>();

  propDisplayedColumns: string[] = [
    'project',
    'service',
    'action',
    'action-icon',
    'start',
    'outcome',
    'reason',
    'environment',
    'user',
  ];
  propDisplayedColumnsWithExpand: string[] = [
    ...this.propDisplayedColumns,
    'expand',
  ];
  expandedElement: any | null;

  constructor(
    private readonly router: Router,
    private readonly collectionApi: CollectionApiService,
    private readonly collectionUtil: CollectionUtilService,
    private readonly graphUtil: GraphUtilService,
    private readonly packageUtil: PackageUtilService,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnChanges(): void {
    const intentionData = this.intentionData();
    if (
      intentionData.length === 1 ||
      (this.openFirst() && intentionData.length > 0)
    ) {
      this.expandedElement = intentionData[0];
    }
  }

  ngOnInit(): void {
    if (this.layout() === 'narrow') {
      this.propDisplayedColumns = ['start-narrow', 'environment'];
      this.propDisplayedColumnsWithExpand = [
        ...this.propDisplayedColumns,
        'expand',
      ];
    }
  }

  viewIntention(id: string) {
    this.viewIntentionEvent.emit(id);
  }

  navigateHistoryById(id: string) {
    this.router.navigate([
      '/intention/history',
      {
        field: 'id',
        value: id,
      },
    ]);
  }

  totalDuration(intention: any) {
    return intention.transaction.duration
      ? prettyMilliseconds(intention.transaction.duration)
      : 0;
  }

  normalizedProgress(intention: any) {
    let progressCnt = 0;
    if (intention.actions) {
      progressCnt = intention.actions.reduce(
        (currentValue: number, action: any) => {
          if (action.trace.outcome) {
            return 2 + currentValue;
          } else if (action.trace.start) {
            return 1 + currentValue;
          }
          return currentValue;
        },
        0,
      );
    }
    return Math.round((progressCnt / (intention.actions.length * 2)) * 100);
  }

  openCollection(
    $event: MouseEvent,
    collection: keyof CollectionDtoUnion,
    key: string,
    value: string,
  ) {
    this.collectionApi
      .doUniqueKeyCheck(collection, key, value)
      .pipe(
        switchMap((ids) => {
          if (ids.length === 1) {
            return this.collectionApi.getCollectionById(collection, ids[0]);
          }
          this.openSnackBar(`The ${collection} was not found.`);
          throw new Error(`The ${collection} was not found`);
        }),
      )
      .subscribe((collectionDto) => {
        if ($event.altKey) {
          this.graphUtil.openInGraph(collectionDto.vertex, 'vertex');
        } else {
          this.router.navigate([`/browse/${collection}/${collectionDto.id}`]);
        }
      });
    return false;
  }

  async openPackageBuildVersion(id: string, version: string) {
    this.collectionApi.getCollectionById('service', id).subscribe((service) => {
      return this.packageUtil.openPackageBuildVersion(service.vertex, version);
    });
  }

  viewPackage(action: any) {
    this.collectionUtil.openServicePackage(
      action.service.id,
      action.package.id,
    );
  }

  private openSnackBar(message: string) {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    config.verticalPosition = 'bottom';
    this.snackBar.open(message, 'Dismiss', config);
  }
}
