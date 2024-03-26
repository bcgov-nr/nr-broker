export const AWS_REGION = 'ca-central-1';
export const AWS_KINESIS_BUFFER_TIME = 100;
export const AWS_KINESIS_MAX_RECORDS = 10;

export const TOKEN_RENEW_RATIO = 0.75;

export const HEADER_VAULT_ROLE_ID = 'x-vault-role-id';
export const HEADER_BROKER_TOKEN = 'x-broker-token';

export const TOKEN_SERVICE_WRAP_TTL = 60;
export const TOKEN_SERVICE_ALLOW_ORPHAN =
  process.env.TOKEN_SERVICE_ALLOW_ORPHAN === 'true';

export const COLLECTION_MAX_EMBEDDED = 40;

export const INTENTION_DEFAULT_TTL_SECONDS = 600;
export const INTENTION_MIN_TTL_SECONDS = 30;
export const INTENTION_MAX_TTL_SECONDS = 1800;
export const INTENTION_TRANSIENT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const SHORT_ENV_CONVERSION = {
  production: 'prod',
  development: 'dev',
};

export const ACTION_VALIDATE_TEAM_ADMIN =
  process.env.ACTION_VALIDATE_TEAM_ADMIN ?? '';
export const ACTION_VALIDATE_TEAM_DBA =
  process.env.ACTION_VALIDATE_TEAM_DBA ?? '';
export const ACTION_PROVISION_TOKEN_SELF = 'token/self';
export const ACTION_PROVISION_APPROLE_SECRET_ID = 'approle/secret-id';
export const VAULT_PROVISIONED_ACTION_SET = new Set([
  ACTION_PROVISION_TOKEN_SELF,
  ACTION_PROVISION_APPROLE_SECRET_ID,
]);

export const IS_PRIMARY_NODE = process.env.HOSTNAME?.endsWith('-0') ?? false;

export const AUDIT_LOGSTREAM_DIR = process.env.AUDIT_LOGSTREAM_DIR ?? '/tmp';
export const AUDIT_LOGSTREAM_SIZE = process.env.AUDIT_LOGSTREAM_SIZE ?? '50M';
export const AUDIT_LOGSTREAM_MAX_LOGS =
  process.env.AUDIT_LOGSTREAM_MAX_LOGS ?? '7';

export const VAULT_AUDIT_DEVICE_NAME = 'file';
export const VAULT_ENVIRONMENTS = Object.freeze([
  'production',
  'test',
  'development',
  'tools',
]);
export const VAULT_ENVIRONMENTS_SHORT = Object.freeze([
  'prod',
  'test',
  'dev',
  'tools',
]);
export const VAULT_SYNC_APP_AUTH_MOUNT =
  process.env.VAULT_APPROLE_PATH ?? 'vs_apps_approle';

export const JWT_MAX_AGE = '365d';
export const JWT_GENERATE_BLOCK_GRACE_PERIOD = 60000;

export const MILLISECONDS_IN_SECOND = 1000;
export const DAYS_10_IN_SECONDS = 60 * 60 * 24 * 10;
export const DAYS_365_IN_SECONDS = 60 * 60 * 24 * 365;

export const OAUTH2_CLIENT_MAP_DOMAIN =
  process.env.OAUTH2_CLIENT_MAP_DOMAIN ?? '';
export const OAUTH2_CLIENT_DOMAIN = process.env.OAUTH2_CLIENT_DOMAIN ?? 'idp';
export const OAUTH2_CLIENT_MAP_EMAIL =
  process.env.OAUTH2_CLIENT_MAP_EMAIL ?? 'email';
export const OAUTH2_CLIENT_MAP_GUID =
  process.env.OAUTH2_CLIENT_MAP_GUID ?? 'idir_user_guid';
export const OAUTH2_CLIENT_MAP_NAME =
  process.env.OAUTH2_CLIENT_MAP_NAME ?? 'display_name';
export const OAUTH2_CLIENT_MAP_ROLES =
  process.env.OAUTH2_CLIENT_MAP_ROLES ?? 'client_roles';
export const OAUTH2_CLIENT_MAP_USERNAME =
  process.env.OAUTH2_CLIENT_MAP_USERNAME ?? 'idir_username';

export const REDIS_PUBSUB_GRAPH = 'graph';
