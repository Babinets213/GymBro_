/**
 * Запускає додаток GymBro.
 */
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Отримуємо налаштування для SSL, якщо вони ввімкнені.
  const ssl = process.env.SSL === 'true' ? true : false;
  const keyPath = process.env.SSL_KEY_PATH || '';
  const certPath = process.env.SSL_CERT_PATH || '';
  let httpsOptions = null;

  // Якщо SSL ввімкнено, завантажуємо ключ і сертифікат.
  if (ssl) {
    httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  }

  // Створюємо екземпляр додатку NestJS.
  const app = await NestFactory.create(AppModule, { httpsOptions });

  // Отримуємо порт та ім'я хоста для сервера.
  const PORT = process.env.PORT || 3999;
  const HOSTNAME = process.env.HOSTNAME || 'localhost';

  // Конфігурація для Swagger.
  const config = new DocumentBuilder()
    .setTitle('GymBro')
    .setDescription('Приложение для отслеживания прогресса в тренажерном зале')
    .setVersion('1.0.0')
    .build();

  // Створюємо документацію Swagger.
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Встановлюємо глобальний обробник валідації.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Встановлюємо глобальний префікс для API.
  app.setGlobalPrefix('api');

  // Ввімкнення CORS.
  app.enableCors();

  // Прослуховуємо порт та виводимо повідомлення про запуск сервера.
  await app.listen(PORT, () =>
    console.log(
      `\n[OK] Server running at http${ssl ? 's' : ''}://${HOSTNAME}:${PORT}/`,
    ),
  );
}

bootstrap(); // Запускаємо додаток.
