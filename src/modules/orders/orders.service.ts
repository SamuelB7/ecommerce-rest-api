import { PrismaService } from '@/prisma/prisma.service';
import { paginatedData } from '@/utils/paginated-data';
import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prismaService: PrismaService,
  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {

    const order = await this.prismaService.order.create({
      data: {
        status: createOrderDto.status,
        userId: createOrderDto.userId,
      },
      include: {
        ProductOrder: true
      }
    });

    await Promise.all(createOrderDto.cartItems.map(async (item) => {
      await this.prismaService.productOrder.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity
        }
      })
    }));

    await this.prismaService.payment.create({
      data: {
        amount: createOrderDto.amount,
        orderId: order.id,
        userId: createOrderDto.userId
      }
    });

    await this.prismaService.delivery.create({
      data: {
        orderId: order.id,
        userId: createOrderDto.userId,
        address: createOrderDto.address
      }
    });

    return order;
  }

  async findAll(page: number, limit: number): Promise<paginatedData<Order>> {
    const orders = await this.prismaService.order.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prismaService.order.count();

    return {
      data: orders,
      total
    }

  }

  async findOne(id: string): Promise<Order> {
    return await this.prismaService.order.findUnique({
      where: {
        id
      }
    })
  }

  async findAllByUserId(userId: string, page: number, limit: number): Promise<paginatedData<Order>> {
    const orders = await this.prismaService.order.findMany({
      where: {
        userId
      },
      skip: (page - 1) * limit,
      take: limit
    });

    const total = await this.prismaService.order.count({
      where: {
        userId
      }
    });

    return {
      data: orders,
      total
    }
  }

  findOneByUserId(userId: string, id: string): Promise<Order> {
    return this.prismaService.order.findFirst({
      where: {
        userId,
        id
      }
    })
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    return await this.prismaService.order.update({
      where: {
        id
      },
      data: {
        ...updateOrderDto
      }
    })
  }

  async remove(id: string): Promise<Order> {
    return await this.prismaService.order.delete({
      where: {
        id
      }
    })
  }
}
