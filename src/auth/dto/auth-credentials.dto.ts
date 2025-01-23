import { IsNotEmpty } from "class-validator";

export class AuthCredentialsDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  password: string;
}
