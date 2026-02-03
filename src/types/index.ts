export type PaymentStatus = "pending" | "processing" | "success" | "failed"

export interface User {
    id: string
    name: string
    email: string
    phone: string
    company: string
    department: string
    location: string
    role: string
    status: string
    plan: string

    lastLoginAt: string | Date
    createdAt: string | Date
}

export type UsersTableFiltersProps = {
    status: string | null
    role: string | null
    onStatusChange: (status: string | null) => void
    onRoleChange: (role: string | null) => void
}
