import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar usuarios guardados en Supabase' })
  @ApiOkResponse({ description: 'Lista de usuarios sin contraseñas' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido' })
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un usuario en Supabase' })
  @ApiOkResponse({ description: 'Usuario actualizado' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un usuario de Supabase' })
  @ApiOkResponse({ description: 'Usuario eliminado' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}