import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {HttpStatus, INestApplication, ValidationPipe} from '@nestjs/common'
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger'
import {ResponseFormatInterceptor} from './configs/interceptors'
import {GlobalExceptionFilter} from './configs/exception-filters'
import {ValidationException} from './configs/exceptions'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.enableVersioning()
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (error) => {
        return new ValidationException(error, HttpStatus.BAD_REQUEST)
      },
    }),
  )
  app.useGlobalInterceptors(new ResponseFormatInterceptor())
  app.useGlobalFilters(new GlobalExceptionFilter())
  bootstrapSwaggerDocument(app)
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()

function bootstrapSwaggerDocument(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('My Drive API')
    .setDescription('API Collection for My Drive Application.')
    .setVersion('1.0')
    .build()
  SwaggerModule.setup('api', app, () =>
    SwaggerModule.createDocument(app, config),
  )
}
