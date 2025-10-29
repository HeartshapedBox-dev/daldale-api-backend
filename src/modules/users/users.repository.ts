import { Injectable } from '@nestjs/common';
import { Gender, Prisma, User, UserProfile, MasturbationWeek } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

type UserProfileWithoutUserId = Omit<UserProfile, 'userId'>;
type MasturbationWeekWithoutUserId = Omit<MasturbationWeek, 'userId'>;

export type UserWithRelations = User & {
  profile: UserProfileWithoutUserId | null;
  masturbationWeeks: MasturbationWeekWithoutUserId[];
};
@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: {
    email: string;
    name: string;
    gender: Gender;
    birthDate: Date;
    height: number;
    weight: number;
    weeklyMasturbationCount: number;
  }): Promise<UserWithRelations> {
    // Prisma 트랜잭션으로 모든 데이터를 함께 생성 (모두 성공하거나 모두 실패)
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. User 생성
      const user = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          gender: data.gender,
          birthDate: data.birthDate,
        },
      });

      // 2. UserProfile 생성 (필수)
      const profile = await tx.userProfile.create({
        data: {
          userId: user.id,
          height: data.height,
          weight: data.weight,
        },
      });

      // 3. MasturbationWeek 생성 (필수)
      const masturbationWeek = await tx.masturbationWeek.create({
        data: {
          userId: user.id,
          count: data.weeklyMasturbationCount,
        },
      });

      // 4. 관계 데이터 포함해서 리턴 (userId 중복 제거)
      const { userId: _, ...profileWithoutUserId } = profile;
      const { userId: __, ...masturbationWeekWithoutUserId } = masturbationWeek;
      
      return {
        ...user,
        profile: profileWithoutUserId,
        masturbationWeeks: [masturbationWeekWithoutUserId],
      };
    });

    return result;
  }
}