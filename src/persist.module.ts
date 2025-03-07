// persist.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { persistConfig } from './persist.config';
import { PersistController } from './persist.controller';
import { PersistService } from './persist.service';
import { Definitions } from '@pitaman71/omniglot-live-data';

interface PersistModuleOptions {
  directory: Definitions.Directory;
}

@Module({})
export class PersistModule {
  static register(options: PersistModuleOptions): DynamicModule {
    return {
      imports: [ ConfigModule.forFeature(persistConfig) ],
      module: PersistModule,
      controllers: [PersistController],
      providers: [
        {
          provide: 'DIRECTORY',
          useValue: options.directory,
        },
        PersistService
      ],
    };
  }
}