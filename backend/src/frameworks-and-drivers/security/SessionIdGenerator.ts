import crypto from "crypto";

export class SessionIdGenerator {
  generate(): string {
    return crypto.randomUUID();
  }
}