import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
// Marca rutas que no requieren token JWT.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);