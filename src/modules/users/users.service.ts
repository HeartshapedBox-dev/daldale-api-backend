import { Injectable, ConflictException } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // 이메일 중복 확인
    const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.'); // 409 Conflict
    }

    // 사용자 생성 (트랜잭션으로 User, UserProfile, MasturbationWeek 함께 생성)
    const user = await this.usersRepository.createUser({
      email: createUserDto.email,
      name: createUserDto.name,
      gender: createUserDto.gender,
      birthDate: new Date(createUserDto.birthDate),
      height: createUserDto.height,
      weight: createUserDto.weight,
      weeklyMasturbationCount: createUserDto.weeklyMasturbationCount,
    });

    return user;
  }
}
