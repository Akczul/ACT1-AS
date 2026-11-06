import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './common/supabase/supabase.module.js';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // Carga .env y comparte sus variables en toda la aplicación.
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
