import { UserRole, Gender } from '../enum/user.enum';

export interface User {
  id: string;                    // 내부 고유 ID
  email: string;                 // 이메일
  name?: string;                 // 이름
  role: UserRole;                // 역할 (USER, ADMIN)
  gender?: Gender;               // 성별 (MALE, FEMALE)
  birthDate?: Date;              // 생년월일
  createdAt: Date;               // 가입일
  updatedAt: Date;               // 수정일
}

export interface UserProfile {
  id: string;
  userId: string;
  height?: number;               // 키 (cm)
  weight?: number;               // 몸무게 (kg)
  createdAt: Date;
  updatedAt: Date;
}

export interface MasturbationWeek {
  id: string;
  userId: string;
  weekStartDate: Date;           // 주 시작일 (월요일)
  count: number;                 // 해당 주 자위 횟수
  createdAt: Date;
  updatedAt: Date;
}