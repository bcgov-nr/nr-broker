export const ACTION_PROVISION_TOKEN_SELF = 'token/self';
export const ACTION_PROVISION_APPROLE_SECRET_ID = 'approle/secret-id';
export const VAULT_PROVISIONED_ACTION_SET = new Set([
  ACTION_PROVISION_TOKEN_SELF,
  ACTION_PROVISION_APPROLE_SECRET_ID,
]);
