import { PartialType } from '@nestjs/swagger';
import { CreateProductsImageDto } from './create-products-image.dto';

export class UpdateProductsImageDto extends PartialType(CreateProductsImageDto) {}
