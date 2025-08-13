import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Role } from 'src/config/enums/roles_enums';
export type UserDocument = HydratedDocument<User>;
export declare class User {
    _id?: Types.ObjectId;
    role: Role;
    name: string;
    username: string;
    email: string;
    password: string;
    password_key: string;
    phoneNumber: string;
    countryCode: string;
    about?: string;
    invitations?: string[];
    invitationRequests?: string[];
}
export declare const UserSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, mongoose.Document<unknown, any, User, any, {}> & User & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User, mongoose.Document<unknown, {}, mongoose.FlatRecord<User>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<User> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
