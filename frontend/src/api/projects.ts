import client from "./client"
import type { Project, ProjectFinancials } from "@/types"

export const projectsApi = {
  getAll: () => client.get<Project[]>("/api/v1/projects"),
  getById: (id: string) => client.get<Project>(`/api/v1/projects/${id}`),
  create: (data: Partial<Project>) => client.post<Project>("/api/v1/projects", data),
  update: (id: string, data: Partial<Project>) => client.put<Project>(`/api/v1/projects/${id}`, data),
  getFinancials: (id: string) => client.get<ProjectFinancials>(`/api/v1/projects/${id}/financials`),
}


