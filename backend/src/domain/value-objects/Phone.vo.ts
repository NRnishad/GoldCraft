import { Result } from "@domain/shared/Result";

export class Phone {
  private readonly value: string;

  private constructor(phone: string) {
    this.value = phone;
  }

  public static create(phone: string): Result<Phone> {
    if (!phone) {
      return Result.fail<Phone>("Phone number is required");
    }

    const cleanedPhone = phone.trim();
    // Validate standard phone formats (10 to 15 digits optionally starting with +)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (!phoneRegex.test(cleanedPhone)) {
      return Result.fail<Phone>("Invalid phone number format");
    }

    return Result.ok(new Phone(cleanedPhone));
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Phone): boolean {
    return this.value === other.getValue();
  }
}
