import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GoalType, Prisma } from '@prisma/client';
import { CreateMasturbationGoalDto } from './dto/request/create-masturbation-goal.dto';
import { CreateMasturbationRecordDto } from './dto/request/create-masturbation-record.dto';
import { MasturbationGoalQueryDto } from './dto/request/masturbation-goal-query.dto';
import { MasturbationRecordQueryDto } from './dto/request/masturbation-record-query.dto';
import { MasturbationStatisticsQueryDto } from './dto/request/masturbation-statistics-query.dto';
import { UpdateMasturbationGoalDto } from './dto/request/update-masturbation-goal.dto';
import { UpdateMasturbationRecordDto } from './dto/request/update-masturbation-record.dto';
import { MasturbationRepository } from './masturbation.repository';

@Injectable()
export class MasturbationService {
  constructor(
    private readonly masturbationRepository: MasturbationRepository,
  ) {}

  async createRecord(createRecordDto: CreateMasturbationRecordDto) {
    await this.validateUser(createRecordDto.userId);

    try {
      return await this.masturbationRepository.createRecord({
        userId: createRecordDto.userId,
        date: this.parseDateOnly(createRecordDto.date),
        count: createRecordDto.count ?? 1,
        note: createRecordDto.note,
      });
    } catch (error) {
      if (this.isPrismaUniqueError(error)) {
        throw new ConflictException('이미 해당 일자의 기록이 존재합니다.');
      }
      throw new BadRequestException('자위 기록 생성에 실패했습니다.');
    }
  }

  async findRecords(query: MasturbationRecordQueryDto) {
    await this.validateUser(query.userId);
    const from = query.from ? this.parseDateOnly(query.from) : undefined;
    const to = query.to ? this.parseDateOnly(query.to) : undefined;
    this.validateDateRange(from, to);

    return this.masturbationRepository.findRecords({
      userId: query.userId,
      from,
      to,
    });
  }

  async findRecordById(userId: string, id: string) {
    await this.validateUser(userId);

    const record = await this.masturbationRepository.findRecordById(userId, id);
    if (!record) {
      throw new NotFoundException('자위 기록을 찾을 수 없습니다.');
    }

    return record;
  }

  async updateRecord(id: string, updateRecordDto: UpdateMasturbationRecordDto) {
    await this.findRecordById(updateRecordDto.userId, id);

    try {
      return await this.masturbationRepository.updateRecord(
        updateRecordDto.userId,
        id,
        {
          ...(updateRecordDto.date
            ? { date: this.parseDateOnly(updateRecordDto.date) }
            : {}),
          ...(updateRecordDto.count !== undefined
            ? { count: updateRecordDto.count }
            : {}),
          ...(updateRecordDto.note !== undefined
            ? { note: updateRecordDto.note }
            : {}),
        },
      );
    } catch (error) {
      if (this.isPrismaUniqueError(error)) {
        throw new ConflictException('이미 해당 일자의 기록이 존재합니다.');
      }
      throw new BadRequestException('자위 기록 수정에 실패했습니다.');
    }
  }

  async deleteRecord(userId: string, id: string) {
    await this.findRecordById(userId, id);
    return this.masturbationRepository.deleteRecord(userId, id);
  }

  async getStatistics(query: MasturbationStatisticsQueryDto) {
    const user = await this.validateUser(query.userId);
    const referenceDate = query.referenceDate
      ? this.parseDateOnly(query.referenceDate)
      : this.toUtcDateOnly(new Date());

    const weekStart = this.getWeekStartDate(referenceDate);
    const weekEnd = this.addDays(weekStart, 6);
    const monthStart = new Date(
      Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), 1),
    );
    const monthEnd = new Date(
      Date.UTC(
        referenceDate.getUTCFullYear(),
        referenceDate.getUTCMonth() + 1,
        0,
      ),
    );
    const recent30Start = this.addDays(referenceDate, -29);

    const [weeklyCount, monthlyCount, recentRecords, latestActivityRecord] =
      await Promise.all([
        this.masturbationRepository.sumRecordCount(
          query.userId,
          weekStart,
          weekEnd,
        ),
        this.masturbationRepository.sumRecordCount(
          query.userId,
          monthStart,
          monthEnd,
        ),
        this.masturbationRepository.findRecords({
          userId: query.userId,
          from: recent30Start,
          to: referenceDate,
        }),
        this.masturbationRepository.findLatestActivityRecord(
          query.userId,
          referenceDate,
        ),
      ]);

    const recent30Days = this.buildTrend(
      recent30Start,
      referenceDate,
      recentRecords,
    );
    const recent7Days = recent30Days.slice(-7);
    const streakBaseDate =
      latestActivityRecord?.date ?? this.toUtcDateOnly(user.createdAt);
    const abstinenceStreakDays = latestActivityRecord
      ? this.diffDays(latestActivityRecord.date, referenceDate)
      : this.diffDays(streakBaseDate, referenceDate) + 1;

    return {
      referenceDate: this.formatDateOnly(referenceDate),
      weeklyCount,
      monthlyCount,
      abstinenceStreakDays,
      recent7Days,
      recent30Days,
    };
  }

  async createGoal(createGoalDto: CreateMasturbationGoalDto) {
    await this.validateUser(createGoalDto.userId);
    this.validateGoalPayload(createGoalDto);

    return this.masturbationRepository.createGoal({
      userId: createGoalDto.userId,
      type: createGoalDto.type,
      weeklyTargetCount:
        createGoalDto.type === GoalType.WEEKLY_COUNT
          ? createGoalDto.weeklyTargetCount
          : undefined,
      abstinenceTargetDays:
        createGoalDto.type === GoalType.ABSTINENCE
          ? createGoalDto.abstinenceTargetDays
          : undefined,
      startDate: this.parseDateOnly(createGoalDto.startDate),
      endDate: createGoalDto.endDate
        ? this.parseDateOnly(createGoalDto.endDate)
        : undefined,
      isActive: createGoalDto.isActive ?? true,
    });
  }

  async findGoals(query: MasturbationGoalQueryDto) {
    await this.validateUser(query.userId);

    return this.masturbationRepository.findGoals({
      userId: query.userId,
      activeOnly: query.activeOnly,
    });
  }

  async findGoalById(userId: string, id: string) {
    await this.validateUser(userId);

    const goal = await this.masturbationRepository.findGoalById(userId, id);
    if (!goal) {
      throw new NotFoundException('목표를 찾을 수 없습니다.');
    }

    return goal;
  }

  async updateGoal(id: string, updateGoalDto: UpdateMasturbationGoalDto) {
    const currentGoal = await this.findGoalById(updateGoalDto.userId, id);
    const nextType = updateGoalDto.type ?? currentGoal.type;
    const nextStartDate =
      updateGoalDto.startDate ?? this.formatDateOnly(currentGoal.startDate);
    const nextEndDate =
      updateGoalDto.endDate ??
      (currentGoal.endDate
        ? this.formatDateOnly(currentGoal.endDate)
        : undefined);
    const nextGoal = {
      type: nextType,
      weeklyTargetCount:
        updateGoalDto.weeklyTargetCount ??
        currentGoal.weeklyTargetCount ??
        undefined,
      abstinenceTargetDays:
        updateGoalDto.abstinenceTargetDays ??
        currentGoal.abstinenceTargetDays ??
        undefined,
      startDate: nextStartDate,
      endDate: nextEndDate,
    };
    this.validateGoalPayload(nextGoal);

    return this.masturbationRepository.updateGoal(updateGoalDto.userId, id, {
      ...(updateGoalDto.type ? { type: updateGoalDto.type } : {}),
      ...(nextType === GoalType.WEEKLY_COUNT
        ? { abstinenceTargetDays: null }
        : {}),
      ...(nextType === GoalType.ABSTINENCE ? { weeklyTargetCount: null } : {}),
      ...(updateGoalDto.weeklyTargetCount !== undefined
        ? { weeklyTargetCount: updateGoalDto.weeklyTargetCount }
        : {}),
      ...(updateGoalDto.abstinenceTargetDays !== undefined
        ? { abstinenceTargetDays: updateGoalDto.abstinenceTargetDays }
        : {}),
      ...(updateGoalDto.startDate
        ? { startDate: this.parseDateOnly(updateGoalDto.startDate) }
        : {}),
      ...(updateGoalDto.endDate
        ? { endDate: this.parseDateOnly(updateGoalDto.endDate) }
        : {}),
      ...(updateGoalDto.isActive !== undefined
        ? { isActive: updateGoalDto.isActive }
        : {}),
    });
  }

  async deleteGoal(userId: string, id: string) {
    await this.findGoalById(userId, id);
    return this.masturbationRepository.deleteGoal(userId, id);
  }

  private async validateUser(userId: string) {
    const user = await this.masturbationRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  private validateGoalPayload(goal: {
    type: GoalType;
    weeklyTargetCount?: number | null;
    abstinenceTargetDays?: number | null;
    startDate: string;
    endDate?: string;
  }) {
    if (goal.type === GoalType.WEEKLY_COUNT && goal.weeklyTargetCount == null) {
      throw new BadRequestException('주간 목표 횟수가 필요합니다.');
    }

    if (
      goal.type === GoalType.ABSTINENCE &&
      goal.abstinenceTargetDays == null
    ) {
      throw new BadRequestException('연속 절제 목표 일수가 필요합니다.');
    }

    if (
      goal.endDate &&
      this.parseDateOnly(goal.endDate) < this.parseDateOnly(goal.startDate)
    ) {
      throw new BadRequestException(
        '목표 종료 일자는 시작 일자보다 빠를 수 없습니다.',
      );
    }
  }

  private parseDateOnly(value: string): Date {
    const matched = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (!matched) {
      throw new BadRequestException('날짜는 YYYY-MM-DD 형식이어야 합니다.');
    }

    const date = new Date(
      Date.UTC(Number(matched[1]), Number(matched[2]) - 1, Number(matched[3])),
    );
    if (
      date.getUTCFullYear() !== Number(matched[1]) ||
      date.getUTCMonth() !== Number(matched[2]) - 1 ||
      date.getUTCDate() !== Number(matched[3])
    ) {
      throw new BadRequestException('유효하지 않은 날짜입니다.');
    }

    return date;
  }

  private toUtcDateOnly(date: Date): Date {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );
  }

  private getWeekStartDate(date: Date): Date {
    const dayOfWeek = date.getUTCDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    return this.addDays(date, diff);
  }

  private addDays(date: Date, days: number): Date {
    const nextDate = new Date(date);
    nextDate.setUTCDate(nextDate.getUTCDate() + days);
    return nextDate;
  }

  private diffDays(from: Date, to: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.max(
      0,
      Math.floor(
        (this.toUtcDateOnly(to).getTime() -
          this.toUtcDateOnly(from).getTime()) /
          msPerDay,
      ),
    );
  }

  private validateDateRange(from?: Date, to?: Date) {
    if (from && to && from > to) {
      throw new BadRequestException(
        '조회 시작 일자는 종료 일자보다 빠르거나 같아야 합니다.',
      );
    }
  }

  private buildTrend(
    from: Date,
    to: Date,
    records: { date: Date; count: number }[],
  ): { date: string; count: number }[] {
    const countByDate = new Map(
      records.map((record) => [this.formatDateOnly(record.date), record.count]),
    );
    const trend: { date: string; count: number }[] = [];

    for (
      let cursor = new Date(from);
      cursor <= to;
      cursor = this.addDays(cursor, 1)
    ) {
      const dateKey = this.formatDateOnly(cursor);
      trend.push({
        date: dateKey,
        count: countByDate.get(dateKey) ?? 0,
      });
    }

    return trend;
  }

  private formatDateOnly(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private isPrismaUniqueError(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    );
  }
}
