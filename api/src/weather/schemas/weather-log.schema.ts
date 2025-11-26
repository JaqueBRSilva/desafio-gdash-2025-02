import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WeatherLogDocument = WeatherLog & Document;

@Schema({ timestamps: true })
export class WeatherLog {
    @Prop({ required: true })
    location: string;

    @Prop({ required: true })
    timestamp: Date;

    @Prop()
    temperature?: number;

    @Prop()
    humidity?: number;

    @Prop()
    wind_speed?: number;

    @Prop()
    condition?: string;

    @Prop({ type: Object })
    raw?: any;
}

export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);
