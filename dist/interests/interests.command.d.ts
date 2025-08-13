import { InterestsService } from "./interests.service";
export declare class InterestCommand {
    private readonly interestsService;
    constructor(interestsService: InterestsService);
    seed(): Promise<void>;
}
