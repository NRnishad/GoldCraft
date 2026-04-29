export interface ILogoutRefreshSessionStore {
  delete(sessionId: string): Promise<void>;
}