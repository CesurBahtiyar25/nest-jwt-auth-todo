import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001',  // Frontend adresini belirt
    credentials: true,  // Eğer cookie ile çalışıyorsan bu gerekli
  });
  await app.listen(process.env.PORT ?? 3000);


}
bootstrap();


//uygulamamnın başlangıç kısmmıdır  