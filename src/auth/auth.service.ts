import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { DB_ERROR_STATUS_CODES } from "src/constants";

import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { IAcessToken, IJwtPayload } from "./types";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authCredentials: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentials;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === DB_ERROR_STATUS_CODES.DUPLICATE_VALUE) {
        throw new ConflictException("Username already exists");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(authCredentials: AuthCredentialsDto): Promise<IAcessToken> {
    const { username, password } = authCredentials;
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: IJwtPayload = { username };

      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException("Wrong credentials");
    }
  }
}
