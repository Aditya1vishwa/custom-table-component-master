import { MOCK_USERS } from "@/lib/data"
import type { User } from "@/types"

export interface UserFilterParams {
    search?: string
    status?: string
    role?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
}

export function getFilteredUsers(params: UserFilterParams): User[] {
    const { search, status, role, sortBy = "name", sortOrder = "asc" } = params

    let list = [...MOCK_USERS]

    if (search) {
        const searchLower = search.toLowerCase().trim()
        list = list.filter(
            (u) =>
                u.name.toLowerCase().includes(searchLower) ||
                u.email.toLowerCase().includes(searchLower) ||
                u.company.toLowerCase().includes(searchLower) ||
                u.department.toLowerCase().includes(searchLower) ||
                u.location.toLowerCase().includes(searchLower) ||
                u.phone.toLowerCase().includes(searchLower)
        )
    }

    if (status) {
        list = list.filter((u) => u.status === status)
    }

    if (role) {
        list = list.filter((u) => u.role === role)
    }

    list.sort((a, b) => {
        const aVal = String((a as unknown as Record<string, unknown>)[sortBy] ?? "")
        const bVal = String((b as unknown as Record<string, unknown>)[sortBy] ?? "")
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        return sortOrder === "desc" ? -cmp : cmp
    })

    return list
}
