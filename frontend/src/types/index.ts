export interface User {
  id: string
  email: string
  fullName: string
  role: "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER" | "FINANCE" | "VIEWER"
  defaultHourlyRate: number
  timezone: string
}

export interface Project {
  id: string
  code: string
  name: string
  description?: string
  status: "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED"
  projectManagerId: string
  startDate: string
  endDate?: string
  budgetAmount?: number
  currency: string
  projectManager?: User
  teamMembers?: User[]
  tasks?: Task[]
}

export interface Task {
  id: string
  projectId: string
  title: string
  description?: string
  state: "NEW" | "IN_PROGRESS" | "BLOCKED" | "DONE"
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  assigneeId?: string
  estimateHours?: number
  dueDate?: string
  assignee?: User
}

export interface Timesheet {
  id: string
  userId: string
  projectId: string
  taskId?: string
  workDate: string
  durationHours: number
  hourlyRate: number
  amount: number
  billable: boolean
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED"
  invoiced: boolean
  notes?: string
}

export interface Expense {
  id: string
  userId: string
  projectId: string
  amount: number
  currency: string
  date: string
  category: string
  billable: boolean
  approved: boolean
  reimbursed: boolean
  notes?: string
}

export interface CustomerInvoice {
  id: string
  number: string
  projectId?: string
  status: "DRAFT" | "SUBMITTED" | "POSTED" | "PAID" | "CANCELLED"
  totalAmount: number
  currency: string
  createdAt: string
  invoiceLines?: InvoiceLine[]
}

export interface InvoiceLine {
  id: string
  invoiceId: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  timesheetId?: string
  expenseId?: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface ProjectFinancials {
  projectId: string
  revenue: number
  cost: number
  profit: number
  profitMargin: number
}
