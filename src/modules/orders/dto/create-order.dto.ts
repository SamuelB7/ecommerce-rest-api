import { OrderStatus } from "@/enums/order-status.enum";
import { ApiProperty } from "@nestjs/swagger";

type CartItem = {
    productId: string;
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty({
        example: 'PENDING',
        description: 'The status of an order',
        required: true,
        type: String
    })
    status: OrderStatus;

    @ApiProperty({
        example: 'f7b9b1b0-4b7b-4b7b-8b7b-7b7b7b7b7b7b',
        description: 'The id of the user who made the order',
        required: true,
        type: String
    })
    userId: string;

    @ApiProperty({
        example: [
            {
                productId: 'f7b9b1b0-4b7b-4b7b-8b7b-7b7b7b7b7b7b',
                quantity: 2
            }
        ],
        description: 'The array of products and their quantities',
        required: true,
        type: [Object]
    })
    cartItems: CartItem[];

    @ApiProperty({
        example: 100,
        description: 'The total amount of the order',
        required: true,
        type: Number
    })
    amount: number;

    @ApiProperty({
        example: '123 Main St, Los Angeles, CA 90001',
        description: 'The address of the user',
        required: true,
        type: String
    })
    address: string;
}
