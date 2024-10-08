import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsImagesModule } from './products-images/products-images.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  imports: [ProductsImagesModule],
})
export class ProductsModule { }
