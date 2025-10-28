import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { User } from '@prisma/client';
import { GoogleLoginDto } from './dto/request/google-login.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // 이메일 중복 확인
      const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new ConflictException('이미 존재하는 이메일입니다.');
      }

      // 사용자 생성 (트랜잭션으로 User, UserProfile, MasturbationWeek 함께 생성)
      const user = await this.usersRepository.createUserDirectly({
        email: createUserDto.email,
        name: createUserDto.name,
        gender: createUserDto.gender,
        birthDate: createUserDto.birthDate ? new Date(createUserDto.birthDate) : undefined,
        height: createUserDto.height,
        weight: createUserDto.weight,
        weeklyMasturbationCount: createUserDto.weeklyMasturbationCount,
      });

      // Prisma의 null을 undefined로 변환
      return {
        ...user,
        name: user.name ?? null,
        gender: user.gender ?? null,
        birthDate: user.birthDate ?? null,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('사용자 생성에 실패했습니다.');
    }
  }

  private async generateToken(user: User) {
    // 실제 구현에서는 JWT 서비스를 사용하여 토큰 생성
    // 여기서는 예시로 간단한 구조만 제공
    
    return {
      accessToken: `access_token_${user.id}`,
      refreshToken: `refresh_token_${user.id}`,
      expiresIn: 3600
    };
  }
}
