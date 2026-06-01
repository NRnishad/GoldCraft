import { Result } from "@domain/shared/Result";

export class Email {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  public static create(email: string): Result<Email> {
    if (!email) {
      return Result.fail<Email>("Email is required");
    }

    const emailTrimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailTrimmed)) {
      return Result.fail<Email>("Invalid email format");
    }

    return Result.ok(new Email(emailTrimmed));
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.getValue();
  }
}
