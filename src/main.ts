import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3001', // Allow the frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization', // Allow required headers
    credentials: true, // If you use cookies or authorization headers
  });

  await app.listen(3000);
  console.log('Backend is running on http://localhost:3000');
}
bootstrap();
