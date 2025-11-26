import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
    constructor(private svc: WeatherService) { }

    @Post('logs')
    async receive(@Body() body: any) {
        const payload = {
            location: body.location || body.city || 'unknown',
            timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
            temperature: body.temperature,
            humidity: body.humidity,
            wind_speed: body.wind_speed,
            condition: body.condition,
            raw: body,
        };
        return this.svc.create(payload);
    }

    @Get('logs')
    list() {
        return this.svc.list(200);
    }

    @Get('insights')
    insights() {
        return this.svc.generateInsights();
    }

    @Get('export/csv')
    async exportCsv(@Res() res: Response) {
        const csv = await this.svc.exportCsv();
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=weather_export.csv');
        res.send(csv);
    }
}
