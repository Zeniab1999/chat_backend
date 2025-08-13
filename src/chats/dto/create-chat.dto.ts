import { IsNotEmpty } from "class-validator";

export class CreateChatDto {

    readonly room_id?: string;// Optional, can be set by the servic
    readonly receiver_id?: string; // Optional, can be set by the servic

    @IsNotEmpty()
    readonly content: string;
    @IsNotEmpty()
    readonly sender_id: string; 
}
