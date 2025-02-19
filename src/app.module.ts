
import { Module } from '@nestjs/common';
import { MenuModule } from './menu/menu.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
  imports: [MenuModule, PrismaModule],
})
export class AppModule {}
