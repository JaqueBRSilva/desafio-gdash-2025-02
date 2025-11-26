import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authSvc: AuthService, private usersSvc: UsersService) { }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.usersSvc.findOneByEmail(body.email);
        if (!user) throw new UnauthorizedException('Credenciais inválidas');
        const ok = await bcrypt.compare(body.password, user.password);
        if (!ok) throw new UnauthorizedException('Credenciais inválidas');
        return this.authSvc.login(user);
    }
}
