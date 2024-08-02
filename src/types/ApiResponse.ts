import { Message } from "@/models/User"



export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean; // optional since no need to check when signing up
  messages?: Array<Message>;
}