'use strict';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '617383119989-51guogcj4koagsmlkg74jr5bsvd6nvv0.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'OlmNOOWx4EnS_aC70JYyDZZq';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://192.168.99.100/auth/google/callback';

const PORT = process.env.PORT || 4242;
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://unleash_user:passord@localhost:5432/unleash';
const SECRET = process.env.SECRET || 'secret';
const SHARED_SECRET = 'shared-secret';

const unleash = require('unleash-server');
const googleAdminAuth = require('./google-auth-hook');

unleash.start({
  databaseUrl: DATABASE_URL,
  secret: SECRET,
  adminAuthentication: 'custom',
  preRouterHook: googleAdminAuth
}).then(server => {
    console.log(`Accepting requests on on http://localhost:${server.app.get(PORT)}`);
});
