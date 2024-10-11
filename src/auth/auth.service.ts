import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtservice: JwtService
  ) {}
  async register(createAuthDto: CreateAuthDto) {
    console.log(createAuthDto);
    const user = this.userRepository.create()
    user.name = createAuthDto.name;
    user.email = createAuthDto.email;
    user.password = await bcrypt.hash(createAuthDto.password, 10);
    user.role = createAuthDto.role
    await this.userRepository.save(user)
    
    return 'You are succesfully registered';
  }

async login(loginDto: { name: string; password: string}){
const user = await this.userRepository.findOneBy({ name: loginDto.name})
if(!user) {
  throw new NotFoundException('User not found !')
}
const checkPass = await bcrypt.compare(loginDto.password, user.password)
if(!checkPass) {
  throw new NotFoundException('Password wrong !')
}

const payload = { id: user.id, name: user.name, role: user.role}
const token = await this.jwtservice.sign(payload)
// user.password=undefined
const { password, ...userdata } = user
return { userdata, token}
}

 async getAllMyData(payload: any) {
  const user = await this.userRepository.findOneBy({ id: payload.id})
    return user;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
