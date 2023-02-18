import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ActionDto } from '../../intention/dto/action.dto';
import { IntentionDto } from '../../intention/dto/intention.dto';
import { IntentionRepository } from '../interfaces/intention.repository';

@Injectable()
export class IntentionMongoRepository implements IntentionRepository {
  constructor(
    @InjectRepository(IntentionDto)
    private intentionRepository: MongoRepository<IntentionDto>,
  ) {}

  /**
   * Save intention to repository
   * @param intention The intention DTO to save
   * @returns Promise returning repository response
   */
  public async addIntention(intention: IntentionDto): Promise<any> {
    return await this.intentionRepository.save(intention);
  }

  /**
   * Return all expired intentions
   * @returns Promise of array of intentions that have expired
   */
  public async findExpiredIntentions(): Promise<IntentionDto[]> {
    const currentTime = new Date().valueOf();
    return this.intentionRepository.find({
      where: { expiry: { $lt: currentTime } } as any,
    });
  }

  /**
   * Returns the intention with matching token
   * @param token The intention token to match
   * @returns Promise resolving to matching intention or null otherwise
   */
  public async getIntentionByToken(
    token: string,
  ): Promise<IntentionDto | null> {
    return await this.intentionRepository.findOne({
      where: { 'transaction.token': token } as any,
    });
  }

  /**
   * Returns the intention containing an action with matching token
   * @param token The action token to match
   * @returns Promise resolving to matching intention or null otherwise
   */
  public async getIntentionByActionToken(
    token: string,
  ): Promise<IntentionDto | null> {
    return await this.intentionRepository.findOne({
      where: { 'actions.trace.token': token } as any,
    });
  }

  /**
   * Set intention action lifecycle state
   * @param token The action token to match
   * @param outcome The outcome (if ending)
   * @param type The lifecyle state
   * @returns A promise resolving to the updated action
   */
  public async setIntentionActionLifecycle(
    token: string,
    outcome: string | undefined,
    type: 'start' | 'end',
  ): Promise<ActionDto> {
    const intention = await this.getIntentionByActionToken(token);
    const action = IntentionDto.projectAction(intention, token);

    if (action) {
      const currentTime = new Date().toISOString();
      action.lifecycle = type === 'start' ? 'started' : 'ended';
      if (action.lifecycle === 'started') {
        action.trace.start = currentTime;
      }
      if (action.lifecycle === 'ended') {
        action.trace.end = currentTime;
        action.trace.outcome = outcome;
      }
      if (action.trace.start && action.trace.end) {
        action.trace.duration =
          Date.parse(action.trace.end).valueOf() -
          Date.parse(action.trace.start).valueOf();
      }
    }
    await this.intentionRepository.findOneAndReplace(
      { _id: intention.id },
      intention,
    );
    return action;
  }

  /**
   * Close intention with matching token
   * @param token The intention token to match
   * @returns Promise resolving to true if an intention is closed and false otherwise
   */
  public async closeIntentionByToken(token: string): Promise<boolean> {
    const intention = await this.getIntentionByToken(token);
    return this.closeIntention(intention);
  }

  /**
   * Close intention
   * @param intention The intention to close
   * @returns Promise resovling to true if an intention is closed and false otherwise
   */
  public async closeIntention(intention: IntentionDto): Promise<boolean> {
    if (intention) {
      const result = await this.intentionRepository.delete(intention.id);
      return result.affected === 1;
    }
    return false;
  }
}
