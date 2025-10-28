import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUserDirectly(data: {
    email: string;
    name?: string;
    gender?: 'MALE' | 'FEMALE';
    birthDate?: Date;
    height?: number;
    weight?: number;
    weeklyMasturbationCount?: number;
  }): Promise<User> {
    // 이번 주 월요일 계산
    const getWeekStartDate = () => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 일요일이면 -6, 아니면 월요일까지의 차이
      const monday = new Date(today);
      monday.setDate(today.getDate() + diff);
      monday.setHours(0, 0, 0, 0);
      return monday;
    };

    // Prisma 트랜잭션으로 모든 데이터를 함께 생성
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

      // 2. UserProfile 생성 (키/몸무게가 있는 경우)
      if (data.height !== undefined || data.weight !== undefined) {
        await tx.userProfile.create({
          data: {
            userId: user.id,
            height: data.height,
            weight: data.weight,
          },
        });
      }

      // 3. MasturbationWeek 생성 (자위 횟수가 있는 경우)
      if (data.weeklyMasturbationCount !== undefined) {
        // Prisma 트랜잭션 내에서 직접 Prisma 모델 사용 (타입 안전)
        const masturbationWeekModel = tx as typeof tx & {
          masturbationWeek: typeof this.prisma.masturbationWeek;
        };
        await masturbationWeekModel.masturbationWeek.create({
          data: {
            userId: user.id,
            weekStartDate: getWeekStartDate(),
            count: data.weeklyMasturbationCount,
          },
        });
      }

      return user;
    });

    return result;
  }
}