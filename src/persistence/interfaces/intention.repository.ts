import { ActionDto } from '../../intention/dto/action.dto';
import { IntentionDto } from '../../intention/dto/intention.dto';

export abstract class IntentionRepository {
  /**
   * Save intention to repository
   * @param intention The intention DTO to save
   * @returns Promise returning repository response
   */
  public abstract addIntention(intention: IntentionDto): Promise<any>;

  /**
   * Return all expired intentions
   * @returns Promise of array of intentions that have expired
   */
  public abstract findExpiredIntentions(): Promise<IntentionDto[]>;

  /**
   * Return intention with matching token
   * @param token The intention token to match
   * @returns Promise resolving to matching intention or null otherwise
   */
  public abstract getIntentionByToken(
    token: string,
  ): Promise<IntentionDto | null>;

  /**
   * Returns the intention containing an action with matching token
   * @param token The action token to match
   * @returns Promise resolving to matching intention or null otherwise
   */
  public abstract getIntentionByActionToken(
    token: string,
  ): Promise<IntentionDto | null>;

  /**
   * Set intention action lifecycle state
   * @param token The action token to match
   * @param outcome The outcome (if ending)
   * @param type The lifecyle state
   * @returns A promise resolving to the updated action
   */
  public abstract setIntentionActionLifecycle(
    token: string,
    outcome: string | undefined,
    type: 'start' | 'end',
  ): Promise<ActionDto>;

  /**
   * Close intention with matching token
   * @param token The intention token to match
   * @returns Promise resolving to true if an intention is closed and false otherwise
   */
  public abstract closeIntentionByToken(token: string): Promise<boolean>;

  /**
   * Close intention
   * @param intention The intention to close
   * @returns Promise resovling to true if an intention is closed and false otherwise
   */
  public abstract closeIntention(intention: IntentionDto): Promise<boolean>;
}
