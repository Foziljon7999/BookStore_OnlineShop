import { IsNotEmpty, IsString } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsString()
    password: string;
    @IsNotEmpty()
    email: string;
    @IsString()
    role: string;
}