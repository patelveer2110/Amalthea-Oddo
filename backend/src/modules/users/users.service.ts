import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/prisma/prisma.service"

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users= this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        createdAt: true,
      },
    })
    console.log(users);
    return users;
    
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        defaultHourlyRate: true,
        timezone: true,
        status: true,
        createdAt: true,
      },
    })
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
      },
    })
  }
}
