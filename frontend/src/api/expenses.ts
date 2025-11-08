import client from "./client"
import type { Expense } from "@/types"

export const expensesApi = {
  getAll: (filters?: Record<string, string | number | boolean>) =>
    client.get<Expense[]>("/api/v1/expenses", { params: filters }),
  getById: (id: string) => client.get<Expense>(`/api/v1/expenses/${id}`),
  create: (data: Partial<Expense>) => client.post<Expense>("/api/v1/expenses", data),
  update: (id: string, data: Partial<Expense>) => client.put<Expense>(`/api/v1/expenses/${id}`, data),
}
