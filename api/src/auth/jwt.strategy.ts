import { Injectable, OnModuleInit } from '@nestjs/common';
import * as passport from 'passport';
import { ExtractJwt, Strategy as PassportJwtStrategy } from 'passport-jwt';

interface JwtPayload {
    sub: string;
    email: string;
    role?: string;
}

@Injectable()
export class JwtStrategy implements OnModuleInit {
    onModuleInit() {
        const options = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'defaultSecretKey',
        };

        passport.use(
            new PassportJwtStrategy(options, (payload: JwtPayload, done: (err: any, user?: any) => void) => {
                done(null, { userId: payload.sub, email: payload.email, role: payload.role });
            }),
        );
    }
}
