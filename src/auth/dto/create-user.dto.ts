import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsEnum,
  Length,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CreateUserDto {
  @IsString()
  @Length(2)
  username: string;

  @IsString()
  @Length(2)
  firstName: string;

  @IsString()
  @Length(2)
  lastName: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  //   @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //     message: 'password is too weak ',
  //   })
  password: string;
  //

  @IsString()
  @IsEmail()
  email: string;

  //   @IsEnum(UserRole)
  role: UserRole;
}
