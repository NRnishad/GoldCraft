export type LoginUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "jeweller" | "admin";
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: "jeweller" | "admin";
};

export interface IUserRepository {
  findByEmail(email: string): Promise<LoginUser | null>;
  findById(userId: string): Promise<PublicUser | null>;
  updateLastLogin(userId: string, date: Date): Promise<void>;
}

