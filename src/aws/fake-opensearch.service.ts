import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { OpensearchService } from './opensearch.service';
import { AxiosResponseLike } from './aws.service';

@Injectable()
export class FakeOpensearchService extends OpensearchService {
  private readonly logger = new Logger(FakeOpensearchService.name);

  async search(index: string, data: any): Promise<AxiosResponseLike> {
    this.logger.verbose(`search [${index}]: ${JSON.stringify(data)}`);
    throw new ServiceUnavailableException();
  }
}
