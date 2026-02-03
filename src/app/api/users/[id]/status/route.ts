import { NextRequest, NextResponse } from "next/server"
import { MOCK_USERS } from "@/lib/data"

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { status } = body

        if (!status || !["active", "inactive", "pending"].includes(status)) {
            return NextResponse.json(
                { error: "Invalid status provided" },
                { status: 400 }
            )
        }

        const userIndex = MOCK_USERS.findIndex((u) => u.id === id)

        if (userIndex === -1) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Update user status
        MOCK_USERS[userIndex] = {
            ...MOCK_USERS[userIndex],
            status,
        }

        return NextResponse.json(MOCK_USERS[userIndex])
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
