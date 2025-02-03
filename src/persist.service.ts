// data.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as rxjs from 'rxjs';

import * as Introspection from 'typescript-introspection';
import { 
  Definitions, 
  Mutations, 
  PersistZone, 
  ProposeZone, 
  Stores 
} from '@pitaman71/omniglot-live-data';
import { 
  Journal, 
  Local, 
  PropertyMapper, 
  RelationMapper 
} from '@pitaman71/omniglot-live-dynamodb';

import { PersistConfig } from './persist.config';

@Injectable()
export class PersistService implements OnModuleInit {
  private _server: Local.Server|undefined;

  constructor(
    private configService: ConfigService,
    private directory: Definitions.Directory
  ) {}

  async onModuleInit() {
    const isDevelopment = this.configService.get('NODE_ENV') !== 'production';
    const config = this.configService.get<PersistConfig['services']>('services');
    if(!config)
      throw new Error('services must be configured');
    const endpoint = isDevelopment 
      ? 'http://localhost:8000' 
      : config['com.amazonaws'].dynamodb.endpoint;

    console.log(`NODE_ENV = ${process.env.NODE_ENV}`);
    console.log(`Binding to DynamoDB at ${endpoint}`);

    this._server = new Local.Server(this.directory, '', {
      ...config['com.amazonaws'].dynamodb,
      endpoint
    });
  }

  persistZone(): PersistZone.PersistZone {
    if(!this._server) throw new Error('DataService initialization failed');
    return new PersistZone.PersistZone(this._server._persist);
  }

  proposeZone(slug: string): ProposeZone.ProposeZone {
    return new ProposeZone.ProposeZone(slug, this.persistZone());
  }

  async bind() {
    if(!this._server) throw new Error('DataService initialization failed');
    return this._server._persist.bind();
  }

  async clear() {
    if(!this._server) throw new Error('DataService initialization failed');
    return this._server._persist.clear();
  }

  async replay<MutationType extends Mutations.BaseMutation>(
    key: Stores.Key<any>,
    receive: rxjs.Observer<MutationType>
  ): Promise<Introspection.Reference<MutationType>> {
    if(!this._server) throw new Error('DataService initialization failed');
    return this._server._persist.replay(key, receive);
  }

  async pull<MutationType extends Mutations.BaseMutation>(
    key: Stores.Key<any>,
    since: Introspection.Reference<MutationType>,
    receive: rxjs.Observer<MutationType>
  ): Promise<Introspection.Reference<MutationType>> {
    if(!this._server) throw new Error('DataService initialization failed');
    return this._server._persist.pull(key, since, receive);
  }

  async push<MutationType extends Mutations.BaseMutation>(
    key: Stores.Key<any>,
    ...suffix: MutationType[]
  ): Promise<MutationType> {
    if(!this._server) throw new Error('DataService initialization failed');
    return this._server._persist.push(key, ...suffix);
  }
}