import { Table } from "./base.entity";
import { Entity, Enum, Property } from "@mikro-orm/core";
import { BloodGroup, Gender, UserRole, UserStatus } from "../../utils/enums";

@Entity()
export class User extends Table {
  @Property({ length: 191, index: true })
  firstName!: string;

  @Property({ length: 191, nullable: true })
  lastName?: string;

  @Property({ length: 16, unique: true })
  phone!: string;

  // login
  @Property({ length: 64, unique: true })
  email!: string;

  @Property({ length: 64 })
  passHash!: string;

  //optional
  @Property({ length: 64, nullable: true })
  address?: string;

  @Property({ nullable: true, type: "datetime" })
  dob?: Date;

  @Enum({ items: () => Gender, nullable: true })
  gender?: Gender;

  @Enum({ items: () => BloodGroup, nullable: true })
  bloodGroup?: BloodGroup;

  // features
  @Enum({ items: () => UserStatus, default: UserStatus.Active })
  status?: UserStatus;

  @Enum({ items: () => UserRole, default: UserRole.USER })
  role!: UserRole;
}
