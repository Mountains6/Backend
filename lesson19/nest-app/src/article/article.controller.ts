import {
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { PositiveNumberPipe } from 'src/common/pipes/positive-number.pipe';

@Controller('article')
export class ArticleController {
  constructor(private readonly articaeService: ArticleService) {}

  @Get()
  findAll() {
    return this.articaeService.findAll();
  }

  @Get('/get-auth-header')
  getAuthHeader(@Headers('authorization') token: string) {
    return { token };
  }

  @Get('/get-headers')
  getHeaders(@Headers() headers: Record<string, string>) {
    return headers;
  }

  @Get('/example-1')
  getRequestInfo(@Req() req: Request) {
    return { method: req.method };
  }

  // .../article/6
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe, PositiveNumberPipe) id: number) {
    console.log(id);
    return { id };
  }
}

// Из чего состоит request?
// Method, url, headers, body

// headers
// {
//   "content-type": "json"
// }
//
// body
// {
//   "email": "example@gmail.com"
// }
//
// url
// /users/3 - path
// 3 - path variable (переменная пути)
//
// /users?limit=3&new=true - path
// ?limit=3 - query params (парметры запроса)
//
// numbers: Record<string, number> = { "first": 45, "second": 54}
