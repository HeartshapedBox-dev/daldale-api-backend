import { Injectable, ConflictException } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UsersRepository } from './users.repository';
import { TokenPayload } from '../auth/jwt/interfaces/token.interface';
import { AuthJwtService } from '../auth/jwt/jwt.service';
import { CreateUserResponseDto, UserProfileResponseDto, MasturbationWeekResponseDto } from './dto/response/create-user-response.dto';
import { UserRole, Gender } from './enum/user.enum';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authJwtService: AuthJwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
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

    // 토큰 생성
    const payload: TokenPayload = {
      sub: user.id,
      userId: user.id,
      role: user.role as string,
    };
    const tokenPair = await this.authJwtService.generateTokenPair(payload);

    // 프로필 변환 (null -> undefined)
    const profileDto: UserProfileResponseDto | null = user.profile
      ? {
          id: user.profile.id,
          height: user.profile.height ?? undefined,
          weight: user.profile.weight ?? undefined,
          createdAt: user.profile.createdAt,
          updatedAt: user.profile.updatedAt,
        }
      : null;

    // 주간 자위 횟수 변환
    const masturbationWeeksDto: MasturbationWeekResponseDto[] = user.masturbationWeeks.map((week) => ({
      id: week.id,
      count: week.count,
      createdAt: week.createdAt,
      updatedAt: week.updatedAt,
    }));

    // 응답 객체 생성
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      gender: user.gender as Gender,
      birthDate: user.birthDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: profileDto as UserProfileResponseDto,
      masturbationWeeks: masturbationWeeksDto,
      tokens: {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
      },
    };
  }
}
