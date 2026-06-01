import { IRead, IWrite } from "@domain/repositories/base/base.Repo";
import { IDbMapper } from "@domain/mappers/IDbMapper";
import { Result } from "@domain/shared/Result";
import { Document, Model } from "mongoose";
import { injectable } from "inversify";

@injectable()
export abstract class BaseRepository<Entity, PersistenceDoc extends Document<any>, Filters = any>
  implements IWrite<Entity>, IRead<Entity, Filters>
{
  constructor(
    protected readonly mongooseModel: Model<PersistenceDoc>,
    protected readonly mapper: IDbMapper<Entity, PersistenceDoc>,
  ) {}

  public async create(entity: Entity): Promise<Result<Entity>> {
    try {
      const persistence = this.mapper.toPersistence(entity);
      // Remove Mongoose-generated ID if it's a placeholder to allow auto-generation or clean insert
      if (persistence._id && typeof persistence._id === "string" && persistence._id.length !== 24) {
        delete persistence._id;
      }

      const createdDoc = await this.mongooseModel.create(persistence);
      return this.mapper.toDomain(createdDoc);
    } catch (err: any) {
      return Result.fail<Entity>(`Failed to create entity: ${err.message}`);
    }
  }

  public async update(id: string, entity: Entity): Promise<Result<Entity>> {
    try {
      const persistence = this.mapper.toPersistence(entity);
      delete persistence._id; // Prevent updating the immutable _id

      const updatedDoc = await this.mongooseModel.findByIdAndUpdate(
        id,
        { $set: persistence },
        { new: true },
      ).exec();

      if (!updatedDoc) {
        return Result.fail<Entity>("Entity to update was not found");
      }

      return this.mapper.toDomain(updatedDoc);
    } catch (err: any) {
      return Result.fail<Entity>(`Failed to update entity: ${err.message}`);
    }
  }

  public async delete(id: string): Promise<Result<void>> {
    try {
      const deletedDoc = await this.mongooseModel.findByIdAndDelete(id).exec();
      if (!deletedDoc) {
        return Result.fail<void>("Entity to delete was not found");
      }
      return Result.ok<void>();
    } catch (err: any) {
      return Result.fail<void>(`Failed to delete entity: ${err.message}`);
    }
  }

  public async findById(id: string): Promise<Result<Entity | null>> {
    try {
      const doc = await this.mongooseModel.findById(id).exec();
      if (!doc) {
        return Result.ok<null>(null);
      }
      const domainEntityResult = this.mapper.toDomain(doc);
      if (domainEntityResult.isFailure) {
        return Result.fail<Entity | null>(domainEntityResult.getError());
      }
      return Result.ok<Entity | null>(domainEntityResult.getValue());
    } catch (err: any) {
      return Result.fail<Entity | null>(`Failed to find entity by ID: ${err.message}`);
    }
  }

  public async findAll(filters: Filters): Promise<Result<Entity[] | []>> {
    try {
      const docs = await this.mongooseModel.find(filters as any).exec();
      const entities: Entity[] = [];
      for (const doc of docs) {
        const domainEntityResult = this.mapper.toDomain(doc);
        if (domainEntityResult.isFailure) {
          console.warn(`[BaseRepository] Skipping corrupted document ${doc._id}: ${domainEntityResult.getError()}`);
          continue;
        }
        entities.push(domainEntityResult.getValue());
      }
      return Result.ok<Entity[] | []>(entities);
    } catch (err: any) {
      return Result.fail<Entity[] | []>(`Failed to query entities: ${err.message}`);
    }
  }
}
