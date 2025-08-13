import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterAuthDto } from '../auth/dto/register-auth.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schemas';
import { Model, Types } from 'mongoose';
import { PasswordHashHelper } from 'src/helper/hash/password-hash.helper';
import { Role } from 'src/config/enums/roles_enums';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(dto: RegisterAuthDto) {
    // Check if a user with the same email, username, or phone number exists
    const existingUser = await this.userModel
      .findOne({
        $or: [
          { email: dto.email },
          { username: dto.username },
          { phoneNumber: dto.phoneNumber },
        ],
      })
      .exec();

    // Throw a BadRequestException if a user already exists
    if (existingUser) {
      let message = 'User already exists.';
      if (existingUser.email === dto.email) {
        message = 'A user with this email already exists.';
      } else if (existingUser.username === dto.username) {
        message = 'A user with this username already exists.';
      } else if (existingUser.phoneNumber === dto.phoneNumber) {
        message = 'phone number already exists.';
      }
      throw new BadRequestException(message);
    }

    // Hash the password and create the new user
    const passwordGenerator = await PasswordHashHelper.hash(dto.password);
    dto.password = passwordGenerator.hash;

    const createdUser = new this.userModel({
      ...dto,
      password_key: passwordGenerator.passKey,
      role: dto.role || Role.Disabled,
    });

    // Save the new user and return the document
    try {
      return await createdUser.save();
    } catch (error) {
      throw new BadRequestException('Error creating user.');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel
      .findOne({ email })
      .select('+password')
      .select('+password_key')
      .exec();

    if (!user) {
      throw new NotFoundException('Could not find user.');
    }

    const isPasswordCorrect = await PasswordHashHelper.comparePassword(
      password,
      user.password_key,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new NotFoundException('Could not find user.');
    }

    return user;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('Could not find user.');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid user ID.');
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Could not find user.');
    }

    return {
      message: 'User updated successfully',
      data: updatedUser,
    };
  }
}
