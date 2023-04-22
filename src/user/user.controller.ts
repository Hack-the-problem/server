import { Body, Controller, NotFoundException, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthUser } from 'src/decorators/auth';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Put()
  async updateUser(
    @AuthUser() user: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log(user);
    if (!user) throw new NotFoundException();
    return await this.userService.update(user, updateUserDto);
  }
}
