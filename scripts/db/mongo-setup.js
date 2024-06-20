db.service.drop();
db.vertex.drop();
db.edge.drop();
db.brokerAccount.drop();
db.project.drop();
db.environment.drop();
db.jwtRegistry.drop();
db.jwtBlock.drop();
db.serviceInstance.drop();
db.team.drop();
db.user.drop();
db.collectionConfig.drop();
db.intention.drop();
db.connectionConfig.drop();

db.jwtAllow.insertOne({});

db.connectionConfig.insertOne({
  collection: 'documentation',
  description:
    'Read the developer documentation to discover how teams can take advantage of it.',
  href: 'https://bcgov-nr.github.io/nr-broker/#/',
  name: 'Developer Documentation',
  order: 10,
});

db.connectionConfig.insertOne({
  collection: 'documentation',
  description:
    "Use NR Broker's interactive API documentation to test access and view data.",
  href: '/api',
  name: 'Swagger Documentation',
  order: 20,
});

// ==> Environments
result = db.vertex.insertOne({ collection: 'environment', name: 'production' });
db.environment.insertOne({
  name: 'production',
  short: 'prod',
  aliases: [],
  title: 'Production',
  position: 0,
  vertex: result.insertedId,
});
result = db.vertex.insertOne({ collection: 'environment', name: 'test' });
db.environment.insertOne({
  name: 'test',
  short: 'test',
  aliases: [],
  title: 'Test',
  position: 10,
  vertex: result.insertedId,
});
result = db.vertex.insertOne({
  collection: 'environment',
  name: 'development',
});
db.environment.insertOne({
  name: 'development',
  short: 'dev',
  aliases: [],
  title: 'Development',
  position: 20,
  vertex: result.insertedId,
});
result = db.vertex.insertOne({ collection: 'environment', name: 'tools' });
db.environment.insertOne({
  name: 'tools',
  short: 'tools',
  aliases: [],
  title: 'Tools',
  position: 30,
  vertex: result.insertedId,
});

// ==> Collection Configs
result = db.collectionConfig.insertOne({
  collection: 'environment',
  collectionMapper: [{ getPath: 'name', setPath: 'name' }],
  collectionVertexName: 'name',
  index: 0,
  edges: [],
  fields: {
    name: {
      name: 'Name',
      required: true,
      type: 'string',
      unique: true,
      hint: 'A unique machine friendly key for the environment',
    },
    short: {
      name: 'Short Name',
      required: true,
      type: 'string',
      unique: true,
      hint: 'A short unique machine friendly key for the environment',
    },
    aliases: {
      name: 'Aliases',
      required: true,
      type: 'stringArray',
      hint: 'Set of service instance names to map to this environment',
    },
    title: {
      name: 'Title',
      required: true,
      type: 'string',
      hint: 'A freeform human readable alternative to the name',
    },
    position: {
      name: 'Position',
      required: true,
      type: 'number',
      hint: 'Ordering of environments with 0 being production',
    },
  },
  browseFields: ['title', 'name', 'short', 'position'],
  name: 'Environment',
  permissions: {
    browse: true,
    create: false,
    update: true,
    delete: false,
  },
  show: false,
});
result = db.collectionConfig.insertOne({
  collection: 'project',
  collectionMapper: [{ getPath: 'name', setPath: 'name' }],
  collectionVertexName: 'name',
  index: 1,
  edges: [
    {
      id: '213b9678',
      collection: 'service',
      name: 'component',
      relation: 'oneToMany',
      show: true,
    },
  ],
  fields: {
    name: {
      name: 'Name',
      required: true,
      type: 'string',
      unique: true,
      hint: 'A unique name for the project that must be lowercase kebab',
    },
    title: {
      name: 'Title',
      required: false,
      type: 'string',
      hint: 'A freeform non-technical alternative to the name',
      mask: {
        update: true,
      },
    },
    description: {
      name: 'Description',
      required: false,
      type: 'string',
      hint: 'A short human readable description of the entity',
      mask: {
        update: true,
      },
    },
    website: {
      name: 'Website URL',
      type: 'url',
      hint: 'The website documenting this project',
      mask: {
        update: true,
      },
    },
    email: {
      name: 'Email',
      type: 'email',
      hint: 'The email address to contact those running this project',
      mask: {
        update: true,
      },
    },
  },
  browseFields: ['name', 'title', 'website', 'email'],
  name: 'Project',
  permissions: {
    browse: true,
    create: true,
    update: true,
    delete: true,
  },
  show: true,
});
result = db.collectionConfig.insertOne({
  collection: 'service',
  collectionMapper: [{ getPath: 'name', setPath: 'name' }],
  collectionVertexName: 'name',
  index: 2,
  edges: [
    {
      id: '893c1dcb',
      collection: 'serviceInstance',
      name: 'instance',
      onDelete: 'cascade',
      relation: 'oneToMany',
      show: true,
    },
    {
      id: 'fc9bc870',
      collection: 'service',
      name: 'provision-token',
      onDelete: 'cascade',
      relation: 'oneToMany',
      show: true,
    },
  ],
  fields: {
    name: {
      name: 'Name',
      required: true,
      type: 'string',
      unique: true,
      hint: 'A unique name for the service that must be lowercase kebab',
    },
    title: {
      name: 'Title',
      required: false,
      type: 'string',
      hint: 'A freeform non-technical alternative to the name',
      mask: {
        update: true,
      },
    },
    description: {
      name: 'Description',
      required: false,
      type: 'string',
      hint: 'A short human readable description of the entity',
      mask: {
        update: true,
      },
    },
    scmUrl: {
      name: 'SCM URL',
      required: false,
      type: 'url',
      hint: 'Repository URL with slug and no trailing slash',
      mask: {
        update: true,
      },
    },
    vaultConfig: {
      type: 'embeddedDoc',
      required: false,
      mask: {
        sudo: ['approle.enabled', 'enabled', 'policyOptions.tokenPeriod'],
      },
    },
  },
  browseFields: ['name', 'title', 'scmUrl'],
  name: 'Service',
  permissions: {
    browse: true,
    create: true,
    update: true,
    delete: true,
  },
  show: true,
});
result = db.collectionConfig.insertOne({
  collection: 'serviceInstance',
  collectionMapper: [{ getPath: 'name', setPath: 'name' }],
  collectionVertexName: 'name',
  index: 3,
  edges: [
    {
      id: '48fb4f9f',
      collection: 'environment',
      name: 'deploy-type',
      inboundName: 'Instance',
      relation: 'oneToOne',
      show: true,
    },
    {
      id: 'a511d8fe',
      collection: 'serviceInstance',
      name: 'requires',
      inboundName: 'Required By',
      relation: 'oneToMany',
      show: false,
    },
    {
      id: 'a4056650',
      collection: 'server',
      name: 'installation',
      inboundName: 'Installs',
      relation: 'oneToMany',
      show: true,
    },
  ],
  fields: {
    name: {
      name: 'Name',
      required: true,
      type: 'string',
      hint: 'A name for the service instance',
      uniqueParent: true,
    },
    url: {
      name: 'URL',
      required: false,
      type: 'url',
      hint: 'The base url for the application',
    },
    action: {
      type: 'embeddedDoc',
    },
    actionHistory: {
      type: 'embeddedDocArray',
    },
  },
  browseFields: ['name', 'url'],
  graphVertexOmit: true,
  name: 'Instance',
  parent: {
    edgeName: 'instance',
  },
  permissions: {
    browse: false,
    create: true,
    update: true,
    delete: true,
  },
  show: false,
});
result = db.collectionConfig.insertOne({
  collection: 'user',
  collectionMapper: [{ getPath: 'name', setPath: 'name' }],
  collectionVertexName: 'name',
  index: 4,
  edges: [
    {
      id: 'f69ac0c8',
      collection: 'brokerAccount',
      name: 'administrator',
      inboundName: 'administrators',
      relation: 'oneToMany',
      show: true,
    },
    {
      id: '79ceccbd',
      collection: 'project',
      name: 'owner',
      relation: 'oneToMany',
      show: true,
    },
    {
      id: 'bbba80bc',
      collection: 'team',
      name: 'owner',
      relation: 'oneToMany',
      show: true,
    },
    {
      id: 'db00aada',
      collection: 'project',
      name: 'lead-developer',
      relation: 'oneToMany',
      show: true,
    },
    {
      id: 'aa573095',
      collection: 'team',
      name: 'lead-developer',
      relation: 'oneToMany',
      show: true,
    },
    {
      id: 'ad24909b',
      collection: 'project',
      name: 'developer',
      relation: 'oneToMany',
      show: true,
    },
    {
      id: 'ad796493',
      collection: 'team',
      name: 'developer',
      relation: 'oneToMany',
      show: true,
    },
  ],
  fields: {
    domain: {
      name: 'Domain',
      required: true,
      type: 'string',
    },
    email: {
      name: 'Email',
      required: true,
      type: 'email',
    },
    guid: {
      name: 'GUID',
      required: true,
      type: 'string',
    },
    name: {
      name: 'Name',
      required: true,
      type: 'string',
    },
    username: {
      name: 'Username',
      required: true,
      type: 'string',
    },
  },
  browseFields: ['domain', 'username', 'name', 'email'],
  name: 'User',
  permissions: {
    browse: true,
    create: false,
    update: false,
    delete: true,
  },
  show: false,
});

result = db.collectionConfig.insertOne({
  collection: 'brokerAccount',
  collectionMapper: [{ getPath: 'name', setPath: 'name' }],
  collectionVertexName: 'name',
  index: 5,
  edges: [
    {
      id: 'f081e1be',
      collection: 'project',
      name: 'authorized',
      relation: 'oneToMany',
      show: true,
    },
    {
      id: 'cae8ebbc',
      collection: 'service',
      name: 'authorized',
      relation: 'oneToMany',
      show: true,
    },
  ],
  fields: {
    name: {
      name: 'Name',
      required: true,
      type: 'string',
      unique: true,
      hint: 'A descriptive name for the account',
    },
    email: {
      name: 'Email (sub)',
      required: true,
      type: 'email',
      hint: 'Email address to use as the sub claim in generated JWT',
    },
    clientId: {
      name: 'Client ID',
      required: true,
      init: 'uuid',
      type: 'string',
      hint: 'Generated UUID used to uniquely identify all generated JWTs',
    },
    website: {
      name: 'Website',
      required: false,
      type: 'url',
      hint: 'The location the account is used',
    },
    enableUserImport: {
      name: 'Enable user import',
      required: true,
      type: 'boolean',
      hint: 'Enable account to import users',
      value: false,
    },
    requireRoleId: {
      name: 'Require RoleId',
      required: true,
      type: 'boolean',
      hint: 'Must send Vault service role id to use actions. Recommended when JWT is shared by teams.',
    },
    requireProjectExists: {
      name: 'Require Project Exists',
      required: true,
      type: 'boolean',
      hint: 'Require project to be owned by account',
      value: true,
    },
    requireServiceExists: {
      name: 'Require Service Exists',
      required: false,
      type: 'boolean',
      hint: 'Require service to be owned by account',
      value: false,
    },
    skipUserValidation: {
      name: 'Skip User Validation',
      required: true,
      type: 'boolean',
      hint: 'Defaults unknown users to developer access',
      value: false,
    },
    maskSemverFailures: {
      name: 'Mask Semver Failures',
      required: true,
      type: 'boolean',
      hint: 'Replace invalid version with 0.0.0',
      value: false,
    },
  },
  browseFields: ['name', 'email', 'clientId', 'website', 'requireRoleId'],
  name: 'Broker Account',
  permissions: {
    browse: true,
    create: true,
    update: true,
    delete: true,
  },
  show: true,
});

result = db.collectionConfig.insertOne({
  collection: 'team',
  collectionMapper: [{ getPath: 'name', setPath: 'name' }],
  collectionVertexName: 'name',
  index: 6,
  edges: [
    {
      id: '802831d3',
      collection: 'brokerAccount',
      name: 'owns',
      inboundName: 'owned by',
      relation: 'oneToMany',
      show: true,
    },
    {
      id: '19d21999',
      collection: 'service',
      name: 'uses',
      inboundName: 'used by',
      relation: 'oneToMany',
      show: false,
    },
  ],
  fields: {
    name: {
      name: 'Name',
      required: true,
      type: 'string',
      unique: true,
      hint: 'A descriptive name for the team',
      mask: {
        update: true,
      },
    },
    email: {
      name: 'Email',
      required: true,
      type: 'email',
      hint: 'The email address to contact the team at',
      mask: {
        update: true,
      },
    },
    website: {
      name: 'Website',
      required: false,
      type: 'url',
      hint: 'The team website address',
      mask: {
        update: true,
      },
    },
  },
  browseFields: ['name', 'email', 'website'],
  name: 'Team',
  permissions: {
    browse: true,
    create: true,
    update: true,
    delete: true,
  },
  show: true,
});

result = db.collectionConfig.insertOne({
  collection: 'server',
  collectionMapper: [{ getPath: 'name', setPath: 'name' }],
  collectionVertexName: 'name',
  index: 7,
  edges: [],
  fields: {
    name: {
      name: 'Name',
      required: true,
      type: 'string',
      unique: true,
      hint: 'The lowercase name of the server',
    },
    acquired: {
      name: 'Acquired',
      required: true,
      type: 'date',
      hint: 'The date when the server was acquired',
    },
    architecture: {
      name: 'Architecture',
      required: false,
      type: 'string',
      hint: 'Machine architecture (x86_64, ...)',
    },
    description: {
      name: 'Description',
      required: false,
      type: 'string',
      hint: 'A short human readable description of the entity',
    },
    hostName: {
      name: 'Host Name',
      required: true,
      type: 'string',
      hint: 'The lowercase fully qualified domain name (FQDN) used to connect',
    },
    osFamily: {
      name: 'OS Family',
      required: false,
      type: 'string',
      hint: 'OS family (redhat, ...)',
    },
    osFull: {
      name: 'OS Full',
      required: false,
      type: 'string',
      hint: 'OS string containing things like name, version, code name',
    },
    osKernal: {
      name: 'OS Kernel',
      required: false,
      type: 'string',
      hint: 'Kernel version string',
    },
    osName: {
      name: 'OS Name',
      required: false,
      type: 'string',
      hint: 'OS name without version (Red Hat Enterprise Linux, ...)',
    },
    osType: {
      name: 'OS Type',
      required: false,
      type: 'string',
      hint: 'OS family like linux, macos, etc.',
    },
    osVersion: {
      name: 'OS Version',
      required: false,
      type: 'string',
      hint: 'System version string',
    },
  },
  browseFields: [
    'name',
    'hostName',
    'osType',
    'osFamily',
    'osVersion',
    'acquired',
  ],
  name: 'Server',
  permissions: {
    browse: true,
    create: true,
    update: true,
    delete: true,
  },
  show: true,
});

// ==> User setup
use('admin');
if (db.getUser('admin_db_engine') === null) {
  db.createUser({
    user: 'admin_db_engine',
    pwd: 'admin_secret',
    roles: [
      { role: 'userAdmin', db: 'admin' },
      { role: 'userAdmin', db: 'brokerDB' },
    ],
  });
}
