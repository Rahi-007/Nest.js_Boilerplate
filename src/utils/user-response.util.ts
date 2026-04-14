import { IUser } from "../auth/entity/user.entity";
import { UserRes } from "../auth/dto/user.dto";

/**
 * Build a standardized user response object from a user entity
 * This utility ensures consistent user response formatting across the application
 */
export function buildUserResponse(user: IUser): UserRes {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName ?? "",
    email: user.email,
    phone: user.phone ?? "",
    address: user.address ?? "",
    role: user.role,
    dob: user.dob ?? undefined,
    lastLoggedIn: user.lastLoggedIn ?? undefined,
    gender: user.gender ?? "",
    bloodGroup: user.bloodGroup ?? "",
    avatar: user.avatar ?? "",
    isVerified: user.isVerified ?? false,
    isBlocked: user.isBlocked ?? false,
    createdAt: user.createdAt ?? undefined,
    updatedAt: user.updatedAt ?? undefined,
  };
}
