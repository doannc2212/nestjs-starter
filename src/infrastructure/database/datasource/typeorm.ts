import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { OrderItemEntity } from '../entities/order-item.entity';
import { OrderEntity } from '../entities/order.entity';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: `${process.env.DATABASE_HOST}`,
  port: `${process.env.DATABASE_PORT}`,
  username: `${process.env.DATABASE_USERNAME}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  entities: [OrderItemEntity, OrderEntity],
  migrations: ['src/**/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
};

export const typeorm = registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
