import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async signUp(@Body() newUserDetails: CreateUserDto): Promise<object> {
    return this.authService.register(newUserDetails);
  }

  @Post('/login')
  async signIn(
    @Body() loginDetails: AuthCredentialsDto,
  ): Promise<{ token: string }> {
    return this.authService.login(loginDetails);
  }
}
