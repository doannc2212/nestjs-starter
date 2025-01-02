import { Inject } from '@nestjs/common';
import { Account, AccountProperties } from 'src/domain/aggregate/account';
import { AccountFactory } from 'src/domain/aggregate/account.factory';
import { AccountRepository } from 'src/domain/repositories/account.repository';
import { writeActionManager } from '../database/database.module';
import { AccountEntity } from '../database/entities/account.entity';

export class AccountRepositoryImplementation implements AccountRepository {
  @Inject() private readonly accountFactory: AccountFactory;

  async save(account: Account | Account[]): Promise<void> {
    const models = Array.isArray(account) ? account : [account];
    const entities = models.map((model) => this.modelToEntity(model));
    await writeActionManager.manager
      .getRepository(AccountEntity)
      .save(entities);
  }

  async findById(id: string): Promise<Account | null> {
    const entity = await writeActionManager.manager
      .getRepository(AccountEntity)
      .findOneBy({ id });
    return entity ? this.entityToModel(entity) : null;
  }

  async findByName(name: string): Promise<Account[]> {
    const entities = await writeActionManager.manager
      .getRepository(AccountEntity)
      .findBy({ name });
    return entities.map((entity) => this.entityToModel(entity));
  }

  async findByEmail(email: string): Promise<Account> {
    const entity = await writeActionManager.manager
      .getRepository(AccountEntity)
      .findOneBy({ email });
    return entity ? this.entityToModel(entity) : null;
  }

  private modelToEntity(model: Account): AccountEntity {
    // remove unwanted properties
    const properties = JSON.parse(JSON.stringify(model)) as AccountProperties;
    return {
      ...properties,
      id: properties.id,
      createdAt: properties.createdAt,
      updatedAt: properties.updatedAt,
      deletedAt: properties.deletedAt,
    };
  }

  private entityToModel(entity: AccountEntity): Account {
    return this.accountFactory.reconstitute(entity);
  }
}
