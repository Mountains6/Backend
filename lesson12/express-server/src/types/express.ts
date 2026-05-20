import { UserResponseDto } from "../modules/users/user.response.dto";

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserResponseDto;
    }
  }
}

export {};