import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import the ConfigModule and ConfigService
import { AuthModule } from './auth/auth.module';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes config globally available
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import the ConfigModule to use the ConfigService
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'Ayush@123'),
        database: configService.get<string>('DB_NAME', 'Otter-DB'),
        synchronize: true,
        autoLoadEntities: true, // Automatically load entities
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    SmsModule,
  ],
})
export class AppModule {}
