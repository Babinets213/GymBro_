import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './api/user/user.module';
import { RoutineModule } from './api/routine/routine.module';
import { RoleModule } from './api/role/role.module';
import { ExerciseModule } from './api/exercise/exercise.module';
import { WorkoutController } from './api/workout/workout.controller';
import { WorkoutService } from './api/workout/workout.service';
import { WorkoutModule } from './api/workout/workout.module';
import { SessionModule } from './api/session/session.module';
import { MuscleGroupModule } from './api/muscle-group/muscle-group.module';
import { SetModule } from './api/set/set.module';
import { NotifyGateway } from './websocket/notify.gateway';

/**
 * Головний модуль додатку, який імпортує та налаштовує різні підмодулі та сервіси.
 */
@Module({
  imports: [
    // Налаштування для зчитування .env змінних
    ConfigModule.forRoot({ isGlobal: true }),

    // Імпорт підмодулів
    AuthModule,
    PrismaModule,
    UserModule,
    RoutineModule,
    RoleModule,
    ExerciseModule,
    WorkoutModule,
    SessionModule,
    MuscleGroupModule,
    SetModule,
  ],
  providers: [NotifyGateway], // Реєстрація провайдерів (сервісів та інших компонентів)
})
export class AppModule {}