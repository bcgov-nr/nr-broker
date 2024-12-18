import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubSyncService } from './github-sync.service';
import { VaultModule } from '../vault/vault.module';
import { RedisModule } from '../redis/redis.module';
import { GithubHealthIndicator } from './github.health';
import { PersistenceModule } from '../persistence/persistence.module';

@Module({
  imports: [VaultModule, RedisModule, PersistenceModule],
  providers: [GithubService, GithubSyncService, GithubHealthIndicator],
  exports: [GithubService, GithubSyncService, GithubHealthIndicator],
})
export class GithubModule {}
