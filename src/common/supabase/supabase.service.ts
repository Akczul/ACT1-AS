import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  // Cliente central para consultar Supabase desde los módulos.
  readonly client: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_KEY');

    if (!url || !key) {
      throw new Error('SUPABASE_URL y SUPABASE_KEY son obligatorias');
    }

    // La URL base debe terminar en el proyecto, no en /rest/v1.
    this.client = createClient(url.replace(/\/rest\/v1\/?$/, ''), key);
  }
}