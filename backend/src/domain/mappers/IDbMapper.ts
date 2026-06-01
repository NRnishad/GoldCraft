import { Result } from "@domain/shared/Result";

export interface IDbMapper<Entity, Persistence> {
  toDomain(response: Persistence): Result<Entity>;
  toPersistence(entity: Entity): any;
}
