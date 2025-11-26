import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService implements OnModuleInit {
    constructor(private usersSvc: UsersService, private jwtSvc: JwtService) { }

    async onModuleInit() {
        await this.usersSvc.createDefaultAdmin();
    }

    async validateUser(email: string, pass: string) {
        const user = await this.usersSvc.findOneByEmail(email);
        if (!user) return null;
        const match = await bcrypt.compare(pass, user.password);
        if (!match) return null;
        const { password, ...rest } = user.toObject();
        return rest;
    }

    async login(user: any) {
        const payload = { sub: user._id, email: user.email, role: user.role };
        return { access_token: this.jwtSvc.sign(payload) };
    }
}
