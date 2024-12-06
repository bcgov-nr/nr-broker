import { Component, Inject, Input, OnChanges } from '@angular/core';
import { of } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import {
  CollectionDtoRestUnion,
  CollectionNames,
} from '../../service/dto/collection-dto-union.type';
import { GraphApiService } from '../../service/graph-api.service';
import { CONFIG_MAP } from '../../app-initialize.factory';
import { CollectionConfigMap } from '../../service/graph.types';
import { GraphUpDownRestDto } from '../../service/dto/graph-updown-rest.dto';
import { CollectionUtilService } from '../../service/collection-util.service';

@Component({
    selector: 'app-inspector-people',
    imports: [MatTableModule, RouterModule],
    templateUrl: './inspector-people.component.html',
    styleUrl: './inspector-people.component.scss'
})
export class InspectorPeopleComponent implements OnChanges {
  @Input() collection!: CollectionNames;
  @Input() vertex!: string;

  propPeopleDisplayedColumns: string[] = ['role', 'name', 'via'];
  collectionPeople: GraphUpDownRestDto<any>[] | null = null;

  constructor(
    private readonly graphApi: GraphApiService,
    private readonly collectionUtil: CollectionUtilService,
    @Inject(CONFIG_MAP) public readonly configMap: CollectionConfigMap,
  ) {}

  ngOnChanges() {
    this.getUpstreamUsers(this.vertex).subscribe((data) => {
      this.collectionPeople = data;
      console.log(data);
    });
  }

  private getUpstreamUsers(vertexId: string) {
    const mapCollectionToEdgeName: { [key: string]: string[] } = {
      service: ['developer', 'lead-developer', 'owner', 'tester'],
      project: ['developer', 'lead-developer', 'owner', 'tester'],
      brokerAccount: ['administrator', 'lead-developer'],
    };
    if (!Object.keys(mapCollectionToEdgeName).includes(this.collection)) {
      return of([]);
    }

    return this.graphApi.getUpstream(
      vertexId,
      this.configMap['user'].index,
      mapCollectionToEdgeName[this.collection],
    );
  }

  navigate(collection: keyof CollectionDtoRestUnion, vertexId: string) {
    this.collectionUtil.openInBrowserByVertexId(collection, vertexId);
  }
}
