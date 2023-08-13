import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/health')
  getHealthcheck(): string {
    return 'OK';
  }
}
