import { Component, Inject, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SystemApiService } from '../../service/system-api.service';
import { CURRENT_USER } from '../../app-initialize.factory';
import { HealthStatusService } from '../../service/health-status.service';
import { UserSelfDto } from '../../service/dto/user.dto';

@Component({
  selector: 'app-user-alias',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './user-alias.component.html',
  styleUrl: './user-alias.component.scss',
})
export class UserAliasComponent implements OnChanges {
  @Input() collection: any;

  isSelf = false;

  constructor(
    private readonly systemApi: SystemApiService,
    public readonly healthStatus: HealthStatusService,
    @Inject(CURRENT_USER) public readonly user: UserSelfDto,
  ) {}

  ngOnChanges(): void {
    this.isSelf = this.user.vertex === this.collection?.vertex;
  }

  public async linkGitHubAccount() {
    this.systemApi.userLinkGithub().subscribe({
      next: (data) => {
        window.location.href = data.url;
      },
      error: (err: any) => {
        console.log(err);
        // this.openSnackBar(
        //   'Syncing token failed: ' + (err?.statusText ?? 'unknown'),
        // );
      },
    });
  }
}
