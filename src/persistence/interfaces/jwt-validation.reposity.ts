export abstract class JwtValidationRepository {
  /**
   * Returns if JWT match is found in allow list
   * @param jwt The JWT to test
   * @returns A promise resolving to true if the JWT is allowed and false otherwise
   */
  public abstract matchesAllowed(jwt: any): Promise<boolean>;
  /**
   * Returns if a JWT match is found in the block list
   * @param jwt The JWT to test
   * @returns A promise resolving to true if the JWT is blocked and false otherwise
   */
  public abstract matchesBlocked(jwt: any): Promise<boolean>;
}
