import { User, UserRole } from "@entities/User";
import { IGetUserDetailsRepository } from "./IUserRepository";

export interface GetUserDetailsInput {
  userId: string;
}

export interface AdminUserDetails {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetUserDetailsOutput {
  user: AdminUserDetails;
}

export class GetUserDetailsUseCase {
  constructor(private readonly userRepository: IGetUserDetailsRepository) {}

  async execute(input: GetUserDetailsInput): Promise<GetUserDetailsOutput> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return {
      user: this.toAdminUserDetails(user),
    };
  }

  private toAdminUserDetails(user: User): AdminUserDetails {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}