import { config as dotenvConfig } from 'dotenv';

// Load environment variables from .env.test if exists, otherwise .env
dotenvConfig({ path: '.env.test' });
