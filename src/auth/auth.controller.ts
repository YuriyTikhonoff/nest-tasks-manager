import { Body, Controller, Post } from "@nestjs/common";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { AuthService } from "./auth.service";

@Controller("/auth")
export class AuthController {
  constructor(readonly authService: AuthService) {}
  @Post("/sign-up")
  signUp(@Body() authCredentials: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentials);
  }

  @Post("/sign-in")
  signIn(@Body() authCredentials: AuthCredentialsDto): Promise<string> {
    return this.authService.signIn(authCredentials);
  }
}
