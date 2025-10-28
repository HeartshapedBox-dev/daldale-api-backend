import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseDto } from '../dto/response.dto';

export const ApiResponseWrapper = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  status: number = 200,
  description?: string,
) => {
  return applyDecorators(
    ApiExtraModels(ResponseDto, dataDto),
    ApiResponse({
      status,
      description: description || '요청이 성공적으로 처리되었습니다.',
      schema: {
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
      },
    }),
  );
};

