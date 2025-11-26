import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createObjectCsvStringifier } from 'csv-writer';
import { Model } from 'mongoose';
import { WeatherLog, WeatherLogDocument } from './schemas/weather-log.schema';

@Injectable()
export class WeatherService {
    constructor(@InjectModel(WeatherLog.name) private model: Model<WeatherLogDocument>) { }

    async create(log: Partial<WeatherLog>) {
        const doc = new this.model(log);
        return doc.save();
    }

    async list(limit = 100) {
        return this.model.find().sort({ createdAt: -1 }).limit(limit).exec();
    }

    async exportCsv() {
        const data = await this.model.find().sort({ createdAt: -1 }).lean().exec();
        const csvHeader = [
            { id: 'timestamp', title: 'timestamp' },
            { id: 'location', title: 'location' },
            { id: 'temperature', title: 'temperature' },
            { id: 'humidity', title: 'humidity' },
            { id: 'wind_speed', title: 'wind_speed' },
            { id: 'condition', title: 'condition' },
        ];
        const str = createObjectCsvStringifier({ header: csvHeader });
        const header = str.getHeaderString();
        const records = data.map((d) => ({
            timestamp: d.timestamp,
            location: d.location,
            temperature: d.temperature,
            humidity: d.humidity,
            wind_speed: d.wind_speed,
            condition: d.condition,
        }));
        return header + str.stringifyRecords(records);
    }

    async generateInsights() {
        const docs = await this.model.find().sort({ createdAt: -1 }).limit(500).lean().exec();
        if (!docs || docs.length === 0) {
            return { message: 'Sem dados suficientes para gerar insights.' };
        }
        const temps = docs.map((d) => Number(d.temperature)).filter((v) => !isNaN(v));
        const hums = docs.map((d) => Number(d.humidity)).filter((v) => !isNaN(v));
        const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);
        const avgTemp = avg(temps);
        const avgHum = avg(hums);

        const N = 10;
        const lastN = temps.slice(0, N);
        const prevN = temps.slice(N, N * 2);
        const lastAvg = avg(lastN);
        const prevAvg = avg(prevN);
        let trend = 'stable';
        if (lastAvg && prevAvg) {
            trend = lastAvg > prevAvg + 0.5 ? 'increasing' : lastAvg < prevAvg - 0.5 ? 'decreasing' : 'stable';
        }

        const alerts = [];
        if (avgTemp && avgTemp > 35) alerts.push('Calor extremo médio');
        if (avgHum && avgHum > 85) alerts.push('Umidade muito alta média');

        return {
            average_temperature: avgTemp,
            average_humidity: avgHum,
            recent_temperature_trend: trend,
            alerts,
            sample_count: docs.length,
        };
    }
}
