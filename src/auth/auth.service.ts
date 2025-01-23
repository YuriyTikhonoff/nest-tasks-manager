import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(authCredentials: AuthCredentialsDto): Promise<void> {
    const { userName, password } = authCredentials;

    const user = this.userRepository.create({
      userName,
      password,
    });

    await this.userRepository.save(user);
  }
}
