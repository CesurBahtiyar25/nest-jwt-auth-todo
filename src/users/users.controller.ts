import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { users } from './users.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService,
    private AuthService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() body: users): Promise<users> {
    //console.log('Gelen istek gövdesi:', body); // gelen istegi logla
    const { id, username, email, password } = body;

    if (!password) {
      throw new BadRequestException('Password is required');
    }

    const hashedPassword = await bcrypt.hash(password, 12); //
    // console.log('Hashlenmiş şifre:', hashedPassword);

    // const hashedPassword = await bcrypt.compareSync()

    return this.UsersService.create({
      id,
      username,
      email,
      password: hashedPassword,
    });
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = body;

    // Kullanıcıyı email ile bul
    const users = await this.UsersService.findOne({ where: { email } });

    //console.log('Kullanıcı şifresi:', users?.password);

    // Kullanıcı bulunamazsa hata döndür güvenlik için hesabı
    if (!users || !users.password) {
      //bura sonra eklendi
      throw new BadRequestException('Invalid credentials');
    }

    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, users.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }
    //const accessToken = await this.jwtService.signAsync({ id: users.id })

    const { accessToken, refreshToken } =
      await this.AuthService.generteTokens(users);

    return {
      accessToken,
      refreshToken,
    };

    // const refreshToken = await this.jwtService.signAsync({ id: users.id }, { expiresIn: '7d' });

    // console.log('jwt token', accessToken)
    // console.log("ref", refreshToken)

    //response.cookie("accessToken", accessToken, { httpOnly: false });

    // response.cookie("refreshToken", refreshToken, { httpOnly: false });

    //signAsync() metodu, verilen veriyi şifreleyip, JWT formatında bir token üretir. Bu token daha sonra genellikle kimlik doğrulama için kullanılır.
    // Şifre doğruysa kullanıcıyı geri döndür
    // return {
    //  message: 'login success',
    //accessToken,
    // refreshToken
    //};
  }

  //burda body kısmına gecerli refres tokenı verdigmizde yeni access token üreitiyor postmande
  @Post('refresh')
  async refresh(
    @Body() body: { refreshToken: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken } = body;

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      //console.log("payload,", payload)
      //console.log("refresh tokkk", refreshToken)

      // Yeni access token üretimi
      //const newAccessToken = await this.jwtService.signAsync({ id: payload.id }, { expiresIn: '15m' });

      const newAccessToken = await this.AuthService.generateAccessToken(
        payload.id,
      );
      // console.log("yalandan", newAccessToken)

      // bi tane

      // Yeni access token'ı cookie ile gönder
      response.cookie('accessToken', newAccessToken, { httpOnly: false });

      return {
        accessToken: newAccessToken, //burda yeni üretigimiz access tokenı accesstoken adında çeviriyor
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Invalid refresh token');
    }
  }
}
