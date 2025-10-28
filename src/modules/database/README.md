# Database Configuration

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/messenger_running_db?schema=public"

# Application
NODE_ENV="development"
PORT=3000
```

## Prisma Setup

1. Install Prisma dependencies:
```bash
pnpm add prisma @prisma/client
pnpm add -D prisma
```

2. Generate Prisma client:
```bash
npx prisma generate
```

3. Run database migrations:
```bash
npx prisma migrate dev --name init
```

## Usage

Import the DatabaseModule in your AppModule:

```typescript
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule],
  // ...
})
export class AppModule {}
```

Then inject PrismaService in your controllers/services:

```typescript
import { PrismaService } from './database/prisma.service';

@Injectable()
export class SomeService {
  constructor(private prisma: PrismaService) {}
  
  async createUser(data: any) {
    return this.prisma.user.create({ data });
  }
}
```
