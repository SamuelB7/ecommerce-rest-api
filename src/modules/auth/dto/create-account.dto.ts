import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateAccountDto {
    @ApiProperty({
        example: 'John Doe',
        description: 'The name of the user',
        required: false,
        type: String
    })
    @IsString()
    name?: string;

    @ApiProperty({
        example: 'johndoe@email.com',
        description: 'User email',
        required: true,
        type: String,
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '1234567',
        description: 'User password',
        type: String,
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(7)
    password: string;
}