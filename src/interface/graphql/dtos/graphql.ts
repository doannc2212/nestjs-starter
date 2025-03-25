
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class OrderItem {
    id: string;
    itemId: string;
    orderId: string;
    quantity: number;
}

export class Order {
    id: string;
    userId: string;
    address: string;
    orderItems: OrderItem[];
    createdAt: Date;
    updatedAt?: Nullable<Date>;
    deletedAt?: Nullable<Date>;
}

export class Meta {
    count?: Nullable<number>;
}

export abstract class IQuery {
    abstract findOrderById(id: string): Nullable<Order> | Promise<Nullable<Order>>;
}

export abstract class IMutation {
    abstract createOrder(userId: string, address: string): Nullable<Void> | Promise<Nullable<Void>>;

    abstract addItem(orderId: string, itemId: string, quantity: number): Nullable<Void> | Promise<Nullable<Void>>;

    abstract removeItem(orderId: string, itemId: string): Nullable<Void> | Promise<Nullable<Void>>;

    abstract updateQuantity(orderId: string, itemId: string, quantity: number): Nullable<Void> | Promise<Nullable<Void>>;

    abstract closeOrder(orderId: string): Nullable<Void> | Promise<Nullable<Void>>;
}

export type Void = any;
type Nullable<T> = T | null;
