import { Account } from '../aggregate/account';

export interface AccountRepository {
  save: (account: Account | Account[]) => Promise<void>;
  findById: (id: string) => Promise<Account | null>;
  findByName: (name: string) => Promise<Account[]>;
  findByEmail: (email: string) => Promise<Account | null>;
}
