import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // Enable CORS to allow frontend to access backend
    app.enableCors({
      origin: 'http://localhost:4200',  // Allow only requests from your Angular app
      methods: 'GET, POST, PUT, DELETE, PATCH',  // Allow specific methods
      allowedHeaders: 'Content-Type, Authorization',  // Allow headers like Authorization if you're using JWT
    });
    
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
