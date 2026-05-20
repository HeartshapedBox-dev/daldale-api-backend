import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Type,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CreateMasturbationGoalDto } from './dto/request/create-masturbation-goal.dto';
import { CreateMasturbationRecordDto } from './dto/request/create-masturbation-record.dto';
import { MasturbationGoalQueryDto } from './dto/request/masturbation-goal-query.dto';
import { MasturbationRecordQueryDto } from './dto/request/masturbation-record-query.dto';
import { MasturbationStatisticsQueryDto } from './dto/request/masturbation-statistics-query.dto';
import { MasturbationUserQueryDto } from './dto/request/masturbation-user-query.dto';
import { UpdateMasturbationGoalDto } from './dto/request/update-masturbation-goal.dto';
import { UpdateMasturbationRecordDto } from './dto/request/update-masturbation-record.dto';
import { MasturbationGoalResponseDto } from './dto/response/masturbation-goal-response.dto';
import { MasturbationRecordResponseDto } from './dto/response/masturbation-record-response.dto';
import { MasturbationStatisticsResponseDto } from './dto/response/masturbation-statistics-response.dto';
import { MasturbationService } from './masturbation.service';

function responseSchema(dataDto: Type<unknown>) {
  return {
    allOf: [
      { $ref: getSchemaPath(ResponseDto) },
      {
        properties: {
          data: {
            $ref: getSchemaPath(dataDto),
          },
        },
      },
    ],
  };
}

@ApiTags('Masturbation')
@ApiExtraModels(
  ResponseDto,
  MasturbationRecordResponseDto,
  MasturbationGoalResponseDto,
  MasturbationStatisticsResponseDto,
)
@Controller('api/v1/masturbation')
export class MasturbationController {
  constructor(private readonly masturbationService: MasturbationService) {}

  @Post('records')
  @ApiOperation({ summary: '일별 자위 기록 생성' })
  @ApiResponse({
    status: 200,
    description: '일별 자위 기록 생성 성공',
    schema: responseSchema(MasturbationRecordResponseDto),
  })
  @ApiResponse({
    status: 400,
    description: '일별 자위 기록 생성 실패',
    type: ErrorResponseDto,
  })
  async createRecord(@Body() createRecordDto: CreateMasturbationRecordDto) {
    return this.masturbationService.createRecord(createRecordDto);
  }

  @Get('records')
  @ApiOperation({ summary: '일별 자위 기록 목록 조회' })
  async findRecords(@Query() query: MasturbationRecordQueryDto) {
    return this.masturbationService.findRecords(query);
  }

  @Get('records/statistics')
  @ApiOperation({ summary: '자위 기록 기반 통계 조회' })
  @ApiResponse({
    status: 200,
    description: '자위 기록 기반 통계 조회 성공',
    schema: responseSchema(MasturbationStatisticsResponseDto),
  })
  async getStatistics(@Query() query: MasturbationStatisticsQueryDto) {
    return this.masturbationService.getStatistics(query);
  }

  @Get('records/:id')
  @ApiOperation({ summary: '일별 자위 기록 단건 조회' })
  async findRecordById(
    @Param('id') id: string,
    @Query() query: MasturbationUserQueryDto,
  ) {
    return this.masturbationService.findRecordById(query.userId, id);
  }

  @Patch('records/:id')
  @ApiOperation({ summary: '일별 자위 기록 수정' })
  async updateRecord(
    @Param('id') id: string,
    @Body() updateRecordDto: UpdateMasturbationRecordDto,
  ) {
    return this.masturbationService.updateRecord(id, updateRecordDto);
  }

  @Delete('records/:id')
  @ApiOperation({ summary: '일별 자위 기록 삭제' })
  async deleteRecord(
    @Param('id') id: string,
    @Query() query: MasturbationUserQueryDto,
  ) {
    return this.masturbationService.deleteRecord(query.userId, id);
  }

  @Post('goals')
  @ApiOperation({ summary: '자위 습관 개선 목표 생성' })
  @ApiResponse({
    status: 200,
    description: '자위 습관 개선 목표 생성 성공',
    schema: responseSchema(MasturbationGoalResponseDto),
  })
  async createGoal(@Body() createGoalDto: CreateMasturbationGoalDto) {
    return this.masturbationService.createGoal(createGoalDto);
  }

  @Get('goals')
  @ApiOperation({ summary: '자위 습관 개선 목표 목록 조회' })
  async findGoals(@Query() query: MasturbationGoalQueryDto) {
    return this.masturbationService.findGoals(query);
  }

  @Get('goals/:id')
  @ApiOperation({ summary: '자위 습관 개선 목표 단건 조회' })
  async findGoalById(
    @Param('id') id: string,
    @Query() query: MasturbationUserQueryDto,
  ) {
    return this.masturbationService.findGoalById(query.userId, id);
  }

  @Patch('goals/:id')
  @ApiOperation({ summary: '자위 습관 개선 목표 수정' })
  async updateGoal(
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateMasturbationGoalDto,
  ) {
    return this.masturbationService.updateGoal(id, updateGoalDto);
  }

  @Delete('goals/:id')
  @ApiOperation({ summary: '자위 습관 개선 목표 삭제' })
  async deleteGoal(
    @Param('id') id: string,
    @Query() query: MasturbationUserQueryDto,
  ) {
    return this.masturbationService.deleteGoal(query.userId, id);
  }
}
