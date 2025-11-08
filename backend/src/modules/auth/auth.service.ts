import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common"
import  { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import  { PrismaService } from "@/prisma/prisma.service"
import  { SignUpDto } from "./dto/sign-up.dto"
import  { SignInDto } from "./dto/sign-in.dto"
import { log } from "node:console"

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signUpDto.email },
    })

    if (existingUser) {
      throw new BadRequestException("Email already in use")
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10)

    const user = await this.prisma.user.create({
      data: {
        email: signUpDto.email,
        fullName: signUpDto.fullName,
        passwordHash: hashedPassword,
        role: "TEAM_MEMBER",
        status: "ACTIVE",
      },
    })

    return this.generateToken(user)
  }

  async signIn(signInDto: SignInDto) {
    console.log(signInDto);
    console.log("Attempting to sign in user with email:", signInDto.email);
    
    
    const user = await this.prisma.user.findUnique({
      where: { email: signInDto.email },
    })
    log(user)

    if (!user) {
      log("User not found")
      throw new UnauthorizedException("Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(signInDto.password, user.passwordHash)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials")
    }

    return this.generateToken(user)
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role }
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    }
  }
}
