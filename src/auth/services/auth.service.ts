import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(authCredentials: CreateUserDto): Promise<object> {
    const { password } = authCredentials;

    // Hash password with bycrypt
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepo.create({
      ...authCredentials,
      password: hashedPassword,
    });

    try {
      await this.userRepo.save(user);
      return {
        message: 'Successful Register',
        data: user,
      };
    } catch (error) {
      console.log('duplicate error', error);

      // Check for duplicates
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('username or email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(authCredentials: AuthCredentialsDto): Promise<{ token: string }> {
    const { email, password } = authCredentials;

    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username: user.username, sub: user.id };

      const accessToken = await this.jwtService.signAsync(payload);

      return { token: accessToken };
    } else {
      throw new UnauthorizedException('please check login credentials');
    }
  }

  async forgotPassword(email: string): Promise<object> {
    return {};
  }
  async resetPassword(email: string): Promise<object> {
    return {};
  }
}
