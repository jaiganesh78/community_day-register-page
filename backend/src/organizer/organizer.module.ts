import { Module } from '@nestjs/common';
import { OrganizerController } from './organizer.controller';
import { AttendanceService } from './attendance.service';

@Module({
  controllers: [OrganizerController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class OrganizerModule {}
