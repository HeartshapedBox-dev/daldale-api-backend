import { Injectable } from '@nestjs/common';
import {
  DailyMasturbationRecord,
  MasturbationGoal,
  Prisma,
  User,
} from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class MasturbationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async createRecord(data: {
    userId: string;
    date: Date;
    count: number;
    note?: string;
  }): Promise<DailyMasturbationRecord> {
    return this.prisma.dailyMasturbationRecord.create({
      data,
    });
  }

  async findRecords(params: {
    userId: string;
    from?: Date;
    to?: Date;
  }): Promise<DailyMasturbationRecord[]> {
    const where: Prisma.DailyMasturbationRecordWhereInput = {
      userId: params.userId,
    };

    if (params.from || params.to) {
      where.date = {
        gte: params.from,
        lte: params.to,
      };
    }

    return this.prisma.dailyMasturbationRecord.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async findRecordById(
    userId: string,
    id: string,
  ): Promise<DailyMasturbationRecord | null> {
    return this.prisma.dailyMasturbationRecord.findFirst({
      where: { id, userId },
    });
  }

  async updateRecord(
    userId: string,
    id: string,
    data: Prisma.DailyMasturbationRecordUpdateInput,
  ): Promise<DailyMasturbationRecord> {
    return this.prisma.dailyMasturbationRecord.update({
      where: { id, userId },
      data,
    });
  }

  async deleteRecord(
    userId: string,
    id: string,
  ): Promise<DailyMasturbationRecord> {
    return this.prisma.dailyMasturbationRecord.delete({
      where: { id, userId },
    });
  }

  async sumRecordCount(userId: string, from: Date, to: Date): Promise<number> {
    const result = await this.prisma.dailyMasturbationRecord.aggregate({
      where: {
        userId,
        date: {
          gte: from,
          lte: to,
        },
      },
      _sum: {
        count: true,
      },
    });

    return result._sum.count ?? 0;
  }

  async findLatestActivityRecord(
    userId: string,
    to: Date,
  ): Promise<DailyMasturbationRecord | null> {
    return this.prisma.dailyMasturbationRecord.findFirst({
      where: {
        userId,
        count: {
          gt: 0,
        },
        date: {
          lte: to,
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async createGoal(
    data: Prisma.MasturbationGoalUncheckedCreateInput,
  ): Promise<MasturbationGoal> {
    return this.prisma.masturbationGoal.create({
      data,
    });
  }

  async findGoals(params: {
    userId: string;
    activeOnly?: boolean;
  }): Promise<MasturbationGoal[]> {
    return this.prisma.masturbationGoal.findMany({
      where: {
        userId: params.userId,
        ...(params.activeOnly ? { isActive: true } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findGoalById(
    userId: string,
    id: string,
  ): Promise<MasturbationGoal | null> {
    return this.prisma.masturbationGoal.findFirst({
      where: { id, userId },
    });
  }

  async updateGoal(
    userId: string,
    id: string,
    data: Prisma.MasturbationGoalUncheckedUpdateInput,
  ): Promise<MasturbationGoal> {
    return this.prisma.masturbationGoal.update({
      where: { id, userId },
      data,
    });
  }

  async deleteGoal(userId: string, id: string): Promise<MasturbationGoal> {
    return this.prisma.masturbationGoal.delete({
      where: { id, userId },
    });
  }
}
