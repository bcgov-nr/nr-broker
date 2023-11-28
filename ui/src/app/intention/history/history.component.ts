import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Subject, catchError, of, switchMap } from 'rxjs';

import { IntentionApiService } from '../../service/intention-api.service';
import { ActionContentComponent } from '../action-content/action-content.component';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { GanttGraphComponent } from '../gantt-graph/gantt-graph.component';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    ReactiveFormsModule,
    JsonPipe,
    ActionContentComponent,
    GanttGraphComponent,
  ],
  templateUrl: './history.component.html',
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
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit, OnDestroy {
  intentionData: any[] = [];
  intentionTotal = 0;
  pageIndex = 0;
  pageSize = 10;
  loading = true;
  selectedField: string = '';
  fieldValue!: string;
  fields = [
    { value: '', viewValue: '' },
    { value: 'id', viewValue: 'ID' },
    { value: 'project', viewValue: 'Project' },
    { value: 'service', viewValue: 'Service' },
    { value: 'action', viewValue: 'Action' },
    { value: 'username', viewValue: 'Username' },
  ];
  selectedStatus: string = 'all';
  status = [
    { value: 'all', viewValue: 'All' },
    { value: 'success', viewValue: 'Success' },
    { value: 'failure', viewValue: 'Failure' },
  ];
  propDisplayedColumns: string[] = [
    'project',
    'service',
    'action',
    'start',
    'outcome',
    'user',
  ];
  propDisplayedColumnsWithExpand: string[] = [
    ...this.propDisplayedColumns,
    'expand',
  ];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  private triggerRefresh = new Subject<void>();
  expandedElement: any | null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly intentionApi: IntentionApiService,
  ) {}

  ngOnInit(): void {
    this.triggerRefresh
      .pipe(
        switchMap(() => {
          let whereClause: any = {
            ...(this.selectedStatus !== 'all'
              ? { 'transaction.outcome': this.selectedStatus }
              : {}),
          };
          this.loading = true;
          if (this.selectedField) {
            if (this.selectedField === 'id') {
              whereClause = {
                ...whereClause,
                ...(this.fieldValue ? { _id: this.fieldValue.trim() } : {}),
              };
            } else if (this.selectedField === 'service') {
              whereClause = {
                ...whereClause,
                ...(this.fieldValue
                  ? { 'actions.service.name': this.fieldValue.trim() }
                  : {}),
              };
            } else if (this.selectedField === 'project') {
              whereClause = {
                ...whereClause,
                ...(this.fieldValue
                  ? { 'actions.service.project': this.fieldValue.trim() }
                  : {}),
              };
            } else if (this.selectedField === 'action') {
              whereClause = {
                ...whereClause,
                ...(this.fieldValue
                  ? { 'actions.action': this.fieldValue.trim() }
                  : {}),
              };
            } else if (this.selectedField === 'username') {
              whereClause = {
                ...whereClause,
                ...(this.fieldValue
                  ? { 'actions.user.name': this.fieldValue.trim() }
                  : {}),
              };
            }
          }
          if (this.range.value.start && this.range.value.end) {
            // Add 1 day to end date to be inclusive of the day
            const endData = new Date(this.range.value.end.getTime());
            endData.setDate(endData.getDate() + 1);
            whereClause = {
              ...whereClause,
              'transaction.start': {
                $gte: this.range.value.start,
                $lt: endData,
              },
            };
          }
          return this.intentionApi
            .searchIntentions(
              JSON.stringify(whereClause),
              this.pageIndex * this.pageSize,
              this.pageSize,
            )
            .pipe(
              catchError(() => {
                // Ignore errors for now
                return of({
                  data: [],
                  meta: { total: 0 },
                });
              }),
            );
        }),
      )
      .subscribe((data) => {
        this.intentionData = data.data;
        this.intentionTotal = data.meta.total;
        this.loading = false;
      });
    const params = this.route.snapshot.params;
    if (params['index']) {
      this.pageIndex = params['index'];
    }
    if (params['size']) {
      this.pageSize = params['size'];
    }
    if (params['field']) {
      this.selectedField = params['field'];
    }
    if (params['value']) {
      this.fieldValue = params['value'];
    }
    if (params['status']) {
      this.selectedStatus = params['status'];
    }
    this.refresh();
  }

  ngOnDestroy() {
    this.triggerRefresh.complete();
  }

  handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.refresh();
  }

  clear() {
    this.pageIndex = 0;
    this.selectedField = '';
    this.fieldValue = '';
    this.selectedStatus = 'all';
    this.range.reset();
    this.refresh();
  }

  filter() {
    this.pageIndex = 0;
    this.refresh();
  }

  refresh() {
    this.router.navigate(
      [
        '/intention/history',
        {
          index: this.pageIndex,
          size: this.pageSize,
          field: this.selectedField ?? 'id',
          value: this.fieldValue ?? '',
          status: this.selectedStatus ?? 'all',
        },
      ],
      {
        replaceUrl: true,
      },
    );
    this.triggerRefresh.next();
  }
}
