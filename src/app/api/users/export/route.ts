
import { NextRequest, NextResponse } from "next/server"
import { getFilteredUsers } from "@/lib/data-helpers"
import { generateCsv, generateExcel, generatePdf } from "@/lib/server-export"

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format")
    const search = (searchParams.get("search") ?? "").toLowerCase().trim()
    const sort_by = searchParams.get("sort_by") ?? "name"
    const sort_order = searchParams.get("sort_order") === "desc" ? "desc" : "asc"
    const filterStatus = searchParams.get("filter_status") ?? ""
    const filterRole = searchParams.get("filter_role") ?? ""

    const data = getFilteredUsers({
        search,
        status: filterStatus || undefined,
        role: filterRole || undefined,
        sortBy: sort_by,
        sortOrder: sort_order,
    })

    if (format === "csv") {
        const buffer = generateCsv(data)
        return new NextResponse(buffer as any, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": 'attachment; filename="users.csv"',
            },
        })
    }

    if (format === "xlsx") {
        const buffer = generateExcel(data)
        return new NextResponse(buffer as any, {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": 'attachment; filename="users.xlsx"',
            },
        })
    }

    if (format === "pdf") {
        const buffer = generatePdf(data)
        return new NextResponse(buffer as any, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="users.pdf"',
            },
        })
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 })
}
