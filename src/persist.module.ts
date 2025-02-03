// persist.module.ts
import { Module } from '@nestjs/common';
import { PersistController } from './persist.controller';
import { PersistService } from './persist.service';

@Module({
  controllers: [PersistController],
  providers: [PersistService]
})
export class PersistModule {}
