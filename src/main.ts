import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    // origin: 'https://tfa-be-production.up.railway.app',
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization', 
    credentials: true, 
  });

  await app.listen(3000);
  console.log('Backend is running on http://localhost:3000');
}
bootstrap();
