import { Role } from '@/decorators/roles-decorator';
import { UserRole } from '@/enums/user-role.enum';
import { JwtGuard } from '@/guards/jwt.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@UseGuards(RolesGuard)
@Role(UserRole.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiBody({ type: CreateUserDto })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get a paginated list of users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @Get()
  findAll(@Query('page', ParseIntPipe) page: number, @Query('limit', ParseIntPipe) limit: number) {
    return this.usersService.findAll(page, limit);
  }

  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'User found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiBody({ type: UpdateUserDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
