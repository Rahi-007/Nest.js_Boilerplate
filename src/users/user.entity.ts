import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';


@Entity({ tableName: 'users' })
export class User {
@PrimaryKey()
id!: number;


@Property()
fname!: string;


@Property()
lname!: string;


@Property({ unique: true })
@Unique()
email!: string;


@Property({ hidden: true })
password!: string; // hashed


@Property({ nullable: true })
phone?: string;


@Property({ type: 'timestamptz', defaultRaw: 'now()' })
createdAt: Date = new Date();


@Property({ type: 'timestamptz', onUpdate: () => new Date() })
updatedAt: Date = new Date();
}