import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SupabaseService } from '../../common/supabase/supabase.service';

export interface User {
  id: string | number;
  email: string;
  password: string;
  name: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private withoutPassword(user: User): Omit<User, 'password'> {
    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .select('id, email, password, name')
      .eq('email', email)
      .maybeSingle();

    if (error) throw new Error(`Error buscando usuario: ${error.message}`);
    return data ?? undefined;
  }

  async findById(id: string): Promise<User | undefined> {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .select('id, email, password, name')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(`Error buscando usuario: ${error.message}`);
    return data ?? undefined;
  }

  async create(email: string, password: string, name: string): Promise<User> {
    const exists = await this.findByEmail(email);
    if (exists) throw new ConflictException('Usuario ya existe');

    const hash = await bcrypt.hash(password, 10);
    const { data, error } = await this.supabaseService.client
      .from('users')
      .insert({ email, password: hash, name })
      .select('id, email, password, name')
      .single();

    if (error) throw new Error(`Error creando usuario: ${error.message}`);
    return data;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .select('id, email, name')
      .order('id');

    if (error) throw new Error(`Error listando usuarios: ${error.message}`);
    return data ?? [];
  }

  async update(
    id: string,
    changes: { email?: string; password?: string; name?: string },
  ): Promise<Omit<User, 'password'>> {
    const updateData = { ...changes };
    if (changes.password) updateData.password = await bcrypt.hash(changes.password, 10);

    const { data, error } = await this.supabaseService.client
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, email, password, name')
      .maybeSingle();

    if (error) throw new Error(`Error actualizando usuario: ${error.message}`);
    if (!data) throw new NotFoundException('Usuario no encontrado');
    return this.withoutPassword(data);
  }

  async remove(id: string): Promise<void> {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (error) throw new Error(`Error eliminando usuario: ${error.message}`);
    if (!data) throw new NotFoundException('Usuario no encontrado');
  }
}
