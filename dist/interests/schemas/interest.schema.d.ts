import { HydratedDocument } from "mongoose";
export type InterestDocument = HydratedDocument<Interest>;
export declare class Interest {
    name: string;
}
export declare const InterestSchema: import("mongoose").Schema<Interest, import("mongoose").Model<Interest, any, any, any, import("mongoose").Document<unknown, any, Interest, any, {}> & Interest & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Interest, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Interest>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Interest> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
