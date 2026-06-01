import { OAuth2Client } from "google-auth-library";
import { injectable } from "inversify";
import { IGoogleOAuthService, GoogleOAuthProfile } from "@application/interfaces/IGoogleOAuthService";
import { env } from "@config/env";

@injectable()
export class GoogleOAuthService implements IGoogleOAuthService {
  private readonly client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_CALLBACK_URL,
    );
  }

  public getAuthorizationUrl(): string {
    return this.client.generateAuthUrl({
      access_type: "offline",
      scope: ["openid", "email", "profile"],
      prompt: "select_account",
    });
  }

  public async getProfileFromCode(code: string): Promise<GoogleOAuthProfile> {
    const { tokens } = await this.client.getToken(code);

    if (!tokens.id_token) {
      throw new Error("GOOGLE_ID_TOKEN_MISSING");
    }

    const ticket = await this.client.verifyIdToken({
      idToken: tokens.id_token,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.sub || !payload.email) {
      throw new Error("GOOGLE_PROFILE_INVALID");
    }

    return {
      googleId: payload.sub,
      name: payload.name || payload.email.split("@")[0],
      email: payload.email.toLowerCase(),
      emailVerified: Boolean(payload.email_verified),
    };
  }
}
