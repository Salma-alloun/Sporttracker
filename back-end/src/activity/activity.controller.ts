// src/activity/activity.controller.ts
import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post('save')
  async create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.create(createActivityDto);
  }

  @Get('user/:userId')
  async findAllByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.activityService.findAllByUser(userId);
  }

  @Get('stats/:userId')
  async getStats(@Param('userId', ParseIntPipe) userId: number) {
    return this.activityService.getStats(userId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.activityService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.activityService.remove(id);
  }
}