import type { ServerTableState, ServerTableParams, SortOrder } from "@/components/data-table/types"

/**
 * Default state for URL-driven table
 */
export const DEFAULT_TABLE_STATE: Readonly<ServerTableState> = {
    page: 1,
    limit: 10,
    search: "",
    sort_by: null,
    sort_order: "asc",
    filters: {},
} as const

/**
 * Build query params for API from table state
 * @param state - Current table state
 * @returns Parameters ready to send to server API
 */
export function tableStateToParams(state: ServerTableState): ServerTableParams {
    const { page, limit, search, sort_by, sort_order, filters } = state
    return {
        page,
        limit,
        offset: (page - 1) * limit,
        search: search.trim() || "",
        sort_by,
        sort_order,
        filters,
    }
}

/**
 * Type guard to check if a value is a valid SortOrder
 */
export function isSortOrder(value: unknown): value is SortOrder {
    return value === "asc" || value === "desc"
}
