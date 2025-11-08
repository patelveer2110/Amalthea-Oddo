import client from "./client"
import type { User } from "../types"

export const usersApi = {
  getAll: () => client.get<User[]>("/api/v1/users"),
}
