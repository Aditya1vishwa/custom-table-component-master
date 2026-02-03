"use client"
import { useQuery } from "@tanstack/react-query"
import { useDebounce } from "@/hooks/use-debounce"
import { tableStateToParams } from "@/lib/table-utils"
import { useTableState } from "@/components/data-table/hooks/use-table-state"
import { fetchUsers } from "@/lib/api/users"
import { ServerDataTable } from "@/components/data-table"
import { usersColumns } from "./columns"
import { UsersTableFilters } from "./users-table-filters"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Download } from "lucide-react"
import type { User } from "@/types"

const FILTER_PARAM_KEYS = ["status", "role"] as const
const PAGE_SIZE_OPTIONS = [10, 20, 50, 200] as const



export default function UsersPage() {

  const [tableState, setTableState] = useTableState({
    defaultLimit: 10,
    filterParamKeys: [...FILTER_PARAM_KEYS],
    persistColumnVisibility: true,
  })

  const debouncedSearch = useDebounce(tableState.search, 300)
  const params = tableStateToParams({ ...tableState, search: debouncedSearch })
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ["users", params],
    queryFn: () => fetchUsers(params),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const filterSlot = (
    <>
      <UsersTableFilters
        status={(tableState.filters.status as string) ?? null}
        role={(tableState.filters.role as string) ?? null}
        onStatusChange={(value) =>
          setTableState({
            filters: { ...tableState.filters, status: value ?? null },
            page: 1,
          })
        }
        onRoleChange={(value) =>
          setTableState({
            filters: { ...tableState.filters, role: value ?? null },
            page: 1,
          })
        }
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Download className="h-4 w-4" />
            Export
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() => {
              const exportParams = new URLSearchParams(params.toString())
              exportParams.set("format", "csv")
              window.location.href = `/api/users/export?${exportParams.toString()}`
            }}
          >
            Export to CSV
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              const exportParams = new URLSearchParams(params.toString())
              exportParams.set("format", "xlsx")
              window.location.href = `/api/users/export?${exportParams.toString()}`
            }}
          >
            Export to Excel
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              const exportParams = new URLSearchParams(params.toString())
              exportParams.set("format", "pdf")
              window.location.href = `/api/users/export?${exportParams.toString()}`
            }}
          >
            Export to PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )


  return (
    <main className="w-full px-4 py-6 overflow-x-auto">
      <h1 className="text-2xl font-semibold mb-6">Users</h1>
      <ServerDataTable<User>
        tableState={tableState}
        onTableStateChange={setTableState}
        columns={usersColumns}
        data={data?.data ?? []}
        total={data?.total ?? 0}
        isLoading={isLoading}
        isFetching={isFetching}
        onRefresh={refetch}
        filterSlot={filterSlot}
        searchPlaceholder="Search users..."
        enableColumnVisibility
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        expandableRowRender={(row) => (
          <div className="p-4 text-sm text-muted-foreground">
            <p>ID: {row.original.id}</p>
            <p>Created: {new Date(row.original.createdAt).toLocaleDateString()}</p>
          </div>
        )}
        enableRowSelection
        bulkActions={(selectedRows) => {
          return (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => alert(`Selected: ${selectedRows.map((r) => r.name).join(", ")}`)}
            >
              Action on {selectedRows.length} rows
            </Button>
          )
        }}
        emptyState={<p className="text-muted-foreground">No users found.</p>}
        error={error}
        errorState={
          error ? (
            <p className="text-destructive">Failed to load users. Try again.</p>
          ) : undefined
        }
      />
    </main>
  )
}
