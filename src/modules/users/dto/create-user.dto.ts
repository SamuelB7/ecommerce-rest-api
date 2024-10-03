import { UserRole } from "@/enums/user-role.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
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
        example: 'USER',
        description: 'User role',
        required: true,
        type: String,
    })
    @IsEnum(UserRole)
    role?: UserRole;

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
