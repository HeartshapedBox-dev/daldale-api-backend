import { Controller, Post, Body } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { makeErrorApiResponseSchema } from 'src/common/decorators/error-response.decorator';
import { GoogleLoginDto } from './dto/request/google-login.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { GoogleLoginResponseDto } from './dto/response/google-login-response.dto';
import { CreateUserResponseDto } from './dto/response/create-user-response.dto';
import { UsersService } from './users.service';
import { UserErrorPresets } from './users.error';

@ApiTags('User')
@ApiExtraModels(ResponseDto, CreateUserResponseDto, GoogleLoginResponseDto, ErrorResponseDto)
@Controller('api/v1/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * daldale 인증 관련 API 입니다.
   * 유저의 로그인, 토큰 생성 , 토큰 검증 등을 처리합니다.
   *
   * @tag UsersLogin
   */
  @Post('create')
  @ApiOperation({
    summary: '사용자 생성',
    description: '사용자를 생성합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 생성 성공',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(CreateUserResponseDto),
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: '사용자 생성 실패',
    schema: makeErrorApiResponseSchema(
      UserErrorPresets.BadRequest,
      '/api/v1/user/create',
      'POST',
    ),
  })
  @ApiResponse({
    status: 409,
    description: '이미 존재하는 이메일입니다.',
    schema: makeErrorApiResponseSchema(
      UserErrorPresets.ConflictEmailExists,
      '/api/v1/user/create',
      'POST',
    ),
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}