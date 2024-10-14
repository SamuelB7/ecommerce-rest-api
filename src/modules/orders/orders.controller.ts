import { Role } from '@/decorators/roles-decorator';
import { UserRole } from '@/enums/user-role.enum';
import { JwtGuard } from '@/guards/jwt.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request } from 'express';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@UseGuards(RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Role(UserRole.ADMIN, UserRole.USER)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Role(UserRole.ADMIN)
  @Get()
  findAll(@Query('page', ParseIntPipe) page: number, @Query('limit', ParseIntPipe) limit: number) {
    return this.ordersService.findAll(page, limit);
  }

  @Role(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Role(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Role(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @Role(UserRole.ADMIN, UserRole.USER)
  @Get('user')
  findAllByUserId(@Req() request: Request, page: number, limit: number) {
    const { id }: Partial<User> = request.user;
    return this.ordersService.findAllByUserId(id, page, limit);
  }

  @Role(UserRole.ADMIN, UserRole.USER)
  @Get('user/:id')
  findOneByUserId(@Req() request: Request, id: string) {
    const { id: userId }: Partial<User> = request.user;
    return this.ordersService.findOneByUserId(userId, id);
  }
}
