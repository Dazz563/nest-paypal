import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.userRepo.findOne({
      where: {
        id: payload.sub,
      },
    });

    if (!user) {
      this.logger.debug(`User not found for id ${payload.sub}`);
      throw new UnauthorizedException();
    }

    // remove any sensitive data from the user object before sending it back
    delete user.password;
    delete user.email;
    console.log('Here is your user: ', user);

    // This will inject the user into the request object of our controller
    return user;
  }
}
