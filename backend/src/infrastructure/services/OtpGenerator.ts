import { injectable } from "inversify";
import { IOtpGenerator } from "@application/interfaces/IOtpGenerator";

@injectable()
export class OtpGenerator implements IOtpGenerator {
  public generate(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
