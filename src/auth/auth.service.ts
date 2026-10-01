import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generteTokens(users) {
    const accessToken = await this.jwtService.signAsync(
      { id: users.id },
      { expiresIn: '5m' },
    );

    const refreshToken = await this.jwtService.signAsync(
      { id: users.id },
      { expiresIn: '40d' },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  // users  id: users.id
  // Refresh işlemi için yalnızca access token oluşturma fonksiyonu
  async generateAccessToken(id: number) {
    return await this.jwtService.signAsync({ id }, { expiresIn: '5m' });
  }
}
