import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { JwtAllowDto } from '../dto/jwt-allow.dto';
import { JwtBlockDto } from '../dto/jwt-block.dto';
import { JwtDto } from '../dto/jwt.dto';
import { JwtValidationRepository } from '../interfaces/jwt-validation.reposity';

export class JwtValidationMongoRepository implements JwtValidationRepository {
  constructor(
    @InjectRepository(JwtAllowDto)
    private jwtAllowRepository: MongoRepository<JwtAllowDto>,
    @InjectRepository(JwtBlockDto)
    private jwtBlockRepository: MongoRepository<JwtBlockDto>,
  ) {}

  /**
   * Returns if a JWT match is found in the allow list
   * @param jwt The JWT to test
   * @returns A promise resolving to true if the JWT is allowed and false otherwise
   */
  public async matchesAllowed(jwt: JwtDto): Promise<boolean> {
    return !!(await this.jwtAllowRepository.findOne({
      where: {
        $and: [
          {
            $or: [
              { client_id: jwt.client_id },
              { client_id: { $exists: false } },
            ],
          },
          {
            $or: [{ jti: jwt.jti }, { jti: { $exists: false } }],
          },
          {
            $or: [{ sub: jwt.sub }, { sub: { $exists: false } }],
          },
        ],
      } as any,
    }));
  }
  /**
   * Returns if a JWT match is found in the block list
   * @param jwt The JWT to test
   * @returns A promise resolving to true if the JWT is blocked and false otherwise
   */
  public async matchesBlocked(jwt: JwtDto): Promise<boolean> {
    return !!(await this.jwtBlockRepository.findOne({
      where: {
        $and: [
          {
            $or: [
              { client_id: jwt.client_id },
              { client_id: { $exists: false } },
            ],
          },
          {
            $or: [{ jti: jwt.jti }, { jti: { $exists: false } }],
          },
          {
            $or: [{ sub: jwt.sub }, { sub: { $exists: false } }],
          },
        ],
      } as any,
    }));
  }
}
