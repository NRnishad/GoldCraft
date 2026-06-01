export interface GoogleOAuthUserProfile {
  googleId: string;
  name: string;
  email: string;
  emailVerified: boolean;
}

export interface IGoogleOAuthService {
  getAuthorizationUrl(): string;
  getProfileFromCode(code: string): Promise<GoogleOAuthUserProfile>;
}