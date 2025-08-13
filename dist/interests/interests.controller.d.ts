import { InterestsService } from './interests.service';
export declare class InterestsController {
    private readonly interestsService;
    constructor(interestsService: InterestsService);
    findOne(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/interest.schema").Interest, {}, {}> & import("./schemas/interest.schema").Interest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
}
