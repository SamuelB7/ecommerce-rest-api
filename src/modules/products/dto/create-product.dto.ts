import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        example: 'Product Name',
        description: 'The name of the product',
        required: true,
        type: String
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'Product Description',
        description: 'The description of the product',
        required: true,
        type: String
    })
    @IsString()
    @IsNotEmpty()
    description: string

    @ApiProperty({
        example: 100,
        description: 'The price of the product',
        required: true,
        type: Number
    })
    @IsNumber()
    @IsNotEmpty()
    price: number

    @ApiProperty({
        example: ['path-to-image/image1.jpg', 'path-to-image/image2.jpg'],
        description: 'The array of images of the product',
        required: false,
        type: [String]
    })
    @IsArray()
    images?: string[]
}
