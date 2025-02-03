// persist.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { PersistService } from './persist.service';
import { Tasks } from 'typescript-code-instruments';
import { JSONMarshal, Reference } from 'typescript-introspection';
import { Mutations } from '@pitaman71/omniglot-live-data';

@Controller('persist')
export class PersistController {
 private readonly logEnable = false;

 constructor(private readonly persistService: PersistService) {}

 @Post('bind')
 async bind(@Res() res: Response) {
   return await new Tasks.Instrument('nest.controller.bind')
     .logs(console.log, () => this.logEnable)
     .promises({}, async () => {
       await this.persistService.bind();
       res.status(200).json('');
     })
     .catch(e => {
       throw new HttpException(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
     });
 }

 @Post('clear')
 async clear(@Res() res: Response) {
   return new Tasks.Instrument('nest.controller.clear')
     .logs(console.log, () => this.logEnable)
     .promises({}, async () => {
       await this.persistService.clear();
       res.status(200).json('');
     })
     .catch(e => {
       throw new HttpException(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
     });
 }

 @Post('replay')
 async replay(@Req() req: Request, @Res() res: Response, @Body() payload: any) {
   res.setTimeout(60000, () => {
     res.status(408).send('Request Timeout');
   });

   return new Tasks.Instrument('nest.controller.replay')
     .logs(console.log, () => this.logEnable)
     .promises(payload, async () => {
       if (!payload.key) {
         throw new HttpException(
           `Payload is missing required attribute 'key': ${JSON.stringify(payload)}`,
           HttpStatus.BAD_REQUEST
         );
       }

       const mutations: Mutations.BaseMutation[] = [];
       const errors: any[] = [];

       await this.persistService.replay(payload.key, {
         next: (mutation) => mutations.push(mutation),
         error: (err) => errors.push(err),
         complete: () => {}
       });

       res.status(200).json({ mutations, errors });
     })
     .catch(e => {
       throw new HttpException(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
     });
 }

 @Post('pull')
 async pull(@Req() req: Request, @Res() res: Response, @Body() payload: any) {
   res.setTimeout(60000, () => {
     res.status(408).send('Request Timeout');
   });

   return new Tasks.Instrument('nest.controller.pull')
     .logs(console.log, () => this.logEnable)
     .promises(payload, async () => {
       if (!payload.key) {
         throw new HttpException(
           `Payload is missing required attribute 'key': ${JSON.stringify(payload)}`,
           HttpStatus.BAD_REQUEST
         );
       }

       if (!payload.key.property && !payload.key.relation) {
         throw new HttpException(
           `Payload is missing required attribute 'key.property' or 'key.relation': ${JSON.stringify(payload)}`,
           HttpStatus.BAD_REQUEST
         );
       }

       if (!payload.since) {
         payload.since = Reference.fromNull();
       }

       const mutations: Mutations.BaseMutation[] = [];
       const errors: any[] = [];

       await this.persistService.pull(payload.key, payload.since, {
         next: (mutation) => mutations.push(mutation),
         error: (err) => errors.push(err),
         complete: () => {}
       });

       if (errors.length > 0) {
         throw new HttpException({ mutations, errors }, HttpStatus.INTERNAL_SERVER_ERROR);
       }

       res.status(200).json({ mutations, errors });
     })
     .catch(e => {
       throw new HttpException(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
     });
 }

 @Post('push')
 async push(@Req() req: Request, @Res() res: Response, @Body() payload: any) {
   res.setTimeout(60000, () => {
     res.status(408).send('Request Timeout');
   });

   return new Tasks.Instrument('nest.controller.push')
     .logs(console.log, () => this.logEnable)
     .promises(payload, async () => {
       if (!payload.key) {
         throw new HttpException(
           `Payload is missing required attribute 'key': ${JSON.stringify(payload)}`,
           HttpStatus.BAD_REQUEST
         );
       }

       if (!payload.suffix) {
         throw new HttpException(
           `Payload is missing required attribute 'suffix': ${JSON.stringify(payload)}`,
           HttpStatus.BAD_REQUEST
         );
       }

       const last = await this.persistService.push(payload.key, ...payload.suffix);
       res.status(200).json({ last });
     })
     .catch(e => {
       throw new HttpException(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
     });
 }
}