import {
    Body, Controller,
    Delete, Get,
    Param, Post, Put
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private svc: UsersService) { }

    @Post()
    create(@Body() body: any) {
        return this.svc.create(body);
    }

    @Get()
    list() {
        return this.svc.findAll();
    }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.svc.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.svc.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.svc.remove(id);
    }
}
