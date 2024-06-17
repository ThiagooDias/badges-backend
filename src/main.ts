import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Badges API')
    .setDescription(
      'A Badges API permite o gerenciamento e resgate de emblemas. Com esta API, você pode autenticar usuários, visualizar e resgatar emblemas disponíveis.',
    )
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticação')
    .addTag('user', 'Endpoints de usuários')
    .addTag('badges', 'Endpoints de emblemas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
