import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { CollectionModule } from '../collection/collection.module';
import { PersistenceModule } from '../persistence/persistence.module';
import { IntentionController } from './intention.controller';
import { IntentionService } from './intention.service';
import { ActionService } from './action.service';
import { ActionUtil } from './action.util';
import { AuthModule } from '../auth/auth.module';
import { UtilModule } from '../util/util.module';

@Module({
  imports: [
    AuthModule,
    AuditModule,
    CollectionModule,
    PersistenceModule,
    UtilModule,
  ],
  controllers: [IntentionController],
  providers: [IntentionService, ActionService, ActionUtil],
  exports: [ActionUtil],
})
export class IntentionModule {}
