import { PrismaService } from '@/prisma/prisma.service';
import { paginatedData } from '@/utils/paginated-data';
import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prismaService: PrismaService,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {

    const product = await this.prismaService.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price
      },
      include: {
        images: true
      }
    });

    if (createProductDto.images.length > 0) {
      await Promise.all(createProductDto.images.map(async (image) => {
        await this.prismaService.productImage.create({
          data: {
            productId: product.id,
            url: image,
          }
        })
      }));
    }

    return product;
  }

  async findAll(page: number, limit: number): Promise<paginatedData<Product>> {
    const products = await this.prismaService.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: true
      }
    });

    const total = await this.prismaService.product.count();

    return {
      data: products,
      total
    }
  }

  async findOne(id: string): Promise<Product> {
    return await this.prismaService.product.findUnique({
      where: {
        id
      },
      include: {
        images: true
      }
    })
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    return await this.prismaService.product.update({
      where: {
        id
      },
      data: {
        name: updateProductDto.name,
        description: updateProductDto.description,
        price: updateProductDto.price
      }
    });
  }

  async remove(id: string): Promise<Product> {
    return await this.prismaService.product.delete({
      where: {
        id
      }
    });
  }
}
