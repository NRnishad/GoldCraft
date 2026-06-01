import { Result } from "@domain/shared/Result";
import { Email } from "@domain/value-objects/Email.vo";

export enum UserRole {
  JEWELLER = "jeweller",
  ADMIN = "admin",
}

export enum AuthProvider {
  LOCAL = "local",
  GOOGLE = "google",
}

export class User {
  private constructor(
    private readonly id: string,
    private name: string,
    private readonly email: Email,
    private passwordHash: string | undefined,
    private role: UserRole,
    private readonly authProvider: AuthProvider,
    private readonly googleId: string | undefined,
    private isActive: boolean,
    private isEmailVerified: boolean,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  public static create({
    id,
    name,
    email,
    passwordHash,
    role,
    authProvider,
    googleId,
    isActive = true,
    isEmailVerified = false,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: {
    id: string;
    name: string;
    email: Email;
    passwordHash?: string;
    role: UserRole;
    authProvider: AuthProvider;
    googleId?: string;
    isActive?: boolean;
    isEmailVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }): Result<User> {
    if (!id) {
      return Result.fail<User>("User ID is required");
    }

    if (!name || name.trim().length < 2) {
      return Result.fail<User>("Name must be at least 2 characters long");
    }

    if (!role) {
      return Result.fail<User>("User role is required");
    }

    if (!authProvider) {
      return Result.fail<User>("Auth provider is required");
    }

    if (authProvider === AuthProvider.LOCAL && !passwordHash) {
      return Result.fail<User>("Password hash is required for local accounts");
    }

    if (authProvider === AuthProvider.GOOGLE && !googleId) {
      return Result.fail<User>("Google ID is required for Google accounts");
    }

    const user = new User(
      id,
      name.trim(),
      email,
      passwordHash,
      role,
      authProvider,
      googleId,
      isActive,
      isEmailVerified,
      createdAt,
      updatedAt,
    );

    return Result.ok(user);
  }

  // --- Domain Logic Methods ---

  public verifyEmail(): void {
    this.isEmailVerified = true;
  }

  public block(): void {
    this.isActive = false;
  }

  public activate(): void {
    this.isActive = true;
  }

  public updatePassword(newPasswordHash: string): Result<void> {
    if (!newPasswordHash) {
      return Result.fail<void>("Password hash cannot be empty");
    }
    if (this.authProvider !== AuthProvider.LOCAL) {
      return Result.fail<void>("Cannot change password for non-local accounts");
    }
    this.passwordHash = newPasswordHash;
    return Result.ok();
  }

  public updateProfile(name: string): Result<void> {
    if (!name || name.trim().length < 2) {
      return Result.fail<void>("Name must be at least 2 characters long");
    }
    this.name = name.trim();
    return Result.ok();
  }

  public changeRole(newRole: UserRole): void {
    this.role = newRole;
  }

  // --- Getters ---

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): Email {
    return this.email;
  }

  public getPasswordHash(): string | undefined {
    return this.passwordHash;
  }

  public getRole(): UserRole {
    return this.role;
  }

  public getAuthProvider(): AuthProvider {
    return this.authProvider;
  }

  public getGoogleId(): string | undefined {
    return this.googleId;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getIsEmailVerified(): boolean {
    return this.isEmailVerified;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
