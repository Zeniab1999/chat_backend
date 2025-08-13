import { Interest } from './schemas/interest.schema';
import { Model, mongo } from 'mongoose';
export declare class InterestsService {
    private interestModel;
    constructor(interestModel: Model<Interest>);
    getAll(): Promise<(import("mongoose").Document<unknown, {}, Interest, {}, {}> & Interest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    bulkInsert(interests: string[]): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, Interest, {}, {}> & Interest & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    removeAll(): Promise<{
        message: string;
        data: mongo.DeleteResult;
    }>;
}
