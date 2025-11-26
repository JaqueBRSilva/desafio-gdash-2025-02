import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async createDefaultAdmin() {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
    const adminPwd = process.env.DEFAULT_ADMIN_PASSWORD || '123456';
    const exists = await this.userModel.findOne({ email: adminEmail }).exec();
    if (!exists) {
      const hash = await bcrypt.hash(adminPwd, 10);
      const doc = new this.userModel({ email: adminEmail, password: hash, role: 'admin', name: 'Administrator' });
      await doc.save();
      console.log(`Usuário padrão criado: ${adminEmail} / ${adminPwd}`);
    } else {
      console.log('Usuário padrão já existe.');
    }
  }

  async create(dto: Partial<User>) {
    const hash = await bcrypt.hash(dto.password, 10);
    const created = new this.userModel({ ...dto, password: hash });
    return created.save();
  }

  async findAll() {
    return this.userModel.find().select('-password').exec();
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    const u = await this.userModel.findById(id).select('-password').exec();
    if (!u) throw new NotFoundException('Usuário não encontrado');
    return u;
  }

  async update(id: string, dto: Partial<User>) {
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);
    return this.userModel.findByIdAndUpdate(id, dto, { new: true }).select('-password').exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
