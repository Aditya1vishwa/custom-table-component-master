import { NextRequest, NextResponse } from "next/server"
import type { User } from "@/types"
import { getFilteredUsers } from "@/lib/data-helpers"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)))
  const search = (searchParams.get("search") ?? "").toLowerCase().trim()
  const sort_by = searchParams.get("sort_by") ?? "name"
  const sort_order = searchParams.get("sort_order") === "desc" ? "desc" : "asc"
  const filterStatus = searchParams.get("filter_status") ?? ""
  const filterRole = searchParams.get("filter_role") ?? ""

  const dataList = getFilteredUsers({
    search,
    status: filterStatus || undefined,
    role: filterRole || undefined,
    sortBy: sort_by,
    sortOrder: sort_order as "asc" | "desc",
  })

  // Pagination
  const total = dataList.length
  const offset = (page - 1) * limit
  const data = dataList.slice(offset, offset + limit)


  const totalPages = Math.ceil(total / limit)
  await new Promise((resolve) => setTimeout(resolve, 200))
  return NextResponse.json({
    data,
    total,
    page,
    limit,
    totalPages,
  })
}
