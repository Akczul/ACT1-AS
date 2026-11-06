import { Global, Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Global()
@Module({
  // Permite inyectar SupabaseService en cualquier módulo.
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}