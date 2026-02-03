import type { User } from "@/types"

export const MOCK_USERS: User[] = Array.from({ length: 87 }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ["admin", "editor", "viewer"][i % 3] as User["role"],
    status: ["active", "inactive", "pending"][i % 3] as User["status"],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    phone: `+1-555-01${String(i).padStart(2, "0")}`,
    company: ["Acme Inc", "Globex", "Initech", "Umbrella", "Soylent"][i % 5],
    department: ["Engineering", "Sales", "Support", "Marketing", "Finance"][i % 5],
    location: ["NYC", "SF", "London", "Berlin", "Remote"][i % 5],
    plan: ["free", "pro", "business", "enterprise"][i % 4] as User["plan"],
    lastLoginAt: new Date(Date.now() - (i % 14) * 3600_000).toISOString(),
}))
