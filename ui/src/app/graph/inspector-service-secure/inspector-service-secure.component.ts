import {
  Component,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CollectionApiService } from '../../service/collection-api.service';
import { ServiceRestDto } from '../../service/dto/service-rest.dto';
import { CURRENT_USER } from '../../app-initialize.factory';
import { UserDto } from '../../service/graph.types';
import { InspectorServiceSecureDialogComponent } from '../inspector-service-secure-dialog/inspector-service-secure-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-inspector-service-secure',
  standalone: true,
  imports: [
    ClipboardModule,
    FormsModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './inspector-service-secure.component.html',
  styleUrl: './inspector-service-secure.component.scss',
})
export class InspectorServiceSecureComponent implements OnChanges {
  @Input() service!: ServiceRestDto;
  @Input() userIndex!: number | undefined;
  data: any;
  reveal = false;

  constructor(
    private readonly collectionApi: CollectionApiService,
    @Inject(CURRENT_USER) public readonly user: UserDto,
    private readonly dialog: MatDialog,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['service']) {
      this.loadServiceSecure();
    }
  }

  public openSecureDialog(api: string, role: any) {
    this.dialog.open(InspectorServiceSecureDialogComponent, {
      width: '500px',
      data: {
        api,
        role,
      },
    });
  }

  private loadServiceSecure() {
    if (this.service) {
      this.collectionApi.getServiceSecure(this.service.id).subscribe((data) => {
        this.data = data;
      });
    }
  }
}
