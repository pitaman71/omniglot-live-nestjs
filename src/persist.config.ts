// persist.config.ts
import _ from 'lodash';
import {z} from 'zod';
import { registerAs, ConfigService, ConfigType } from '@nestjs/config';

export const PERSIST_CONFIG_KEY = 'persist';

export const persistConfigSchema = z.object({
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string()
});

// Extract the TypeScript type from the schema
export type PersistConfig = z.infer<typeof persistConfigSchema>;
  
export const persistConfig = registerAs(PERSIST_CONFIG_KEY, (): PersistConfig => {
  console.log('Persist config starting to load...');
  const merged = _.merge(
    process.env.APP_CONFIG ? JSON.parse(process.env.APP_CONFIG) : {}, 
    process.env
  );
  
  // Zod's parse will throw if validation fails
  return persistConfigSchema.parse(merged);
});

export type PersistConfigType = ConfigType<typeof persistConfig>;
