"use client"



import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type RowSelectionState,
  type VisibilityState,
} from "@tanstack/react-table"
import type { ServerDataTableProps, SelectionColumnProps } from "./types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ServerPagination } from "./server-pagination"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableColumnVisibility } from "@/components/data-table/column-visibility"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, RefreshCw, Loader2, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

const DEFAULT_SEARCH_DEBOUNCE_MS = 300

function applyUpdater<T>(updater: T | ((old: T) => T), prev: T): T {
  return typeof updater === "function" ? (updater as (old: T) => T)(prev) : updater
}

function createSelectionColumn<TData>(
  props: SelectionColumnProps<TData>
): ColumnDef<TData, unknown> {
  const { setRowSelection } = props
  return {
    id: "select",
    header: ({ table }) => {
      const all = table.getIsAllPageRowsSelected()
      const some = table.getIsSomePageRowsSelected()
      return (
        <Checkbox
          checked={all ? true : some ? "indeterminate" : false}
          onCheckedChange={(checked) => {
            table.toggleAllPageRowsSelected(Boolean(checked))
          }}
          aria-label="Select all on page"
        />
      )
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
          aria-label="Select row"
        />
      )
    },
    enableSorting: false,
    enableHiding: false,
  }
}


export function ServerDataTable<TData>({
  tableState,
  onTableStateChange,
  columns,
  data,
  total,
  isLoading = false,
  isFetching = false,
  onRefresh,
  filterSlot,
  searchPlaceholder = "Search...",
  searchDebounceMs = DEFAULT_SEARCH_DEBOUNCE_MS,
  enableColumnVisibility = false,
  pageSizeOptions,
  expandableRowRender,
  enableRowSelection = false,
  rowSelection,
  onRowSelectionChange,
  bulkActions,
  emptyState,
  error = null,
  errorState,
  className,
}: ServerDataTableProps<TData>) {

  const [searchInput, setSearchInput] = React.useState<string>(tableState.search)
  const debouncedSearchInput = useDebounce(searchInput, searchDebounceMs)

  React.useEffect(() => {
    setSearchInput(tableState.search)
  }, [tableState.search])

  React.useEffect(() => {
    if (debouncedSearchInput === tableState.search) return
    onTableStateChange({ search: debouncedSearchInput, page: 1 })
  }, [debouncedSearchInput])

  const [internalRowSelection, setInternalRowSelection] =
    React.useState<RowSelectionState>({})
  const effectiveRowSelection = rowSelection ?? internalRowSelection
  const setRowSelection = React.useCallback(
    (updater: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState)) => {
      if (onRowSelectionChange) {
        onRowSelectionChange(updater as any)
        return
      }
      setInternalRowSelection((prev) => applyUpdater(updater, prev))
    },
    [onRowSelectionChange]
  )

  const effectiveColumns = React.useMemo<ColumnDef<TData, unknown>[]>(() => {
    if (!enableRowSelection) {
      return columns
    }
    const selectCol = createSelectionColumn<TData>({
      rowSelection: effectiveRowSelection,
      setRowSelection: setRowSelection as any,
    })
    return [selectCol, ...columns]
  }, [
    columns,
    enableRowSelection,
    effectiveRowSelection,
    setRowSelection,
  ])

  const table = useReactTable({
    data,
    columns: effectiveColumns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: Math.ceil(total / tableState.limit) || 0,
    state: {
      pagination: {
        pageIndex: tableState.page - 1,
        pageSize: tableState.limit,
      },
      sorting:
        tableState.sort_by != null
          ? [{ id: tableState.sort_by, desc: tableState.sort_order === "desc" }]
          : [],
      columnVisibility: (tableState.columnVisibility ?? {}) as VisibilityState,
      rowSelection: effectiveRowSelection,
    },
    manualPagination: true,
    manualSorting: true,
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: (updater) => {
      setRowSelection(updater as any)
    },
    onPaginationChange: (updater) => {
      const prev = { pageIndex: tableState.page - 1, pageSize: tableState.limit }
      const next = applyUpdater(updater, prev)
      onTableStateChange({
        page: next.pageIndex + 1,
        limit: next.pageSize,
      })
    },
    onSortingChange: (updater) => {
      const prev =
        tableState.sort_by != null
          ? [{ id: tableState.sort_by, desc: tableState.sort_order === "desc" }]
          : []
      const next = applyUpdater(updater, prev)
      const sort = next[0]
      onTableStateChange({
        sort_by: sort?.id ?? null,
        sort_order: sort?.desc ? "desc" : "asc",
      })
    },
    onColumnVisibilityChange: (updater) => {
      const next = applyUpdater(updater, tableState.columnVisibility ?? {})
      onTableStateChange({ columnVisibility: next })
    },
  })

  const totalPages = Math.ceil(total / tableState.limit) || 0
  const selectedRows = React.useMemo(() => {
    if (!enableRowSelection) return []
    return table.getSelectedRowModel().rows.map((r) => r.original)
  }, [enableRowSelection, table, effectiveRowSelection])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set())
  const toggleExpanded = (rowId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(rowId)) next.delete(rowId)
      else next.add(rowId)
      return next
    })
  }

  if (error && errorState) {
    return <div className={cn("rounded-md border border-destructive/50 bg-destructive/10 p-4", className)}>{errorState}</div>
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchInput}
              onChange={handleSearchChange}
              className="pl-8 h-9"
            />
          </div>
          {filterSlot}
          {onRefresh && (
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => onRefresh()}
              disabled={isFetching}
              title="Refresh"
            >
              <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
            </Button>
          )}
          {enableColumnVisibility && (
            <DataTableColumnVisibility table={table} />
          )}
        </div>
      </div>

      {enableRowSelection && selectedRows.length > 0 && bulkActions && (
        <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2">
          <span className="text-sm text-muted-foreground">
            {selectedRows.length} selected
          </span>
          {bulkActions(selectedRows)}
        </div>
      )}

      <div className="relative max-w-full overflow-x-auto rounded-md border">
        {isFetching && !isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-background/60">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        <Table>
          <TableHeader className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {expandableRowRender && <TableHead className="w-8" />}
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}>
                    {header.isPlaceholder
                      ? null
                      : (
                        <DataTableColumnHeader
                          column={header.column}
                          title={flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        />
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={effectiveColumns.length + (expandableRowRender ? 1 : 0)}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span className="text-muted-foreground">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={effectiveColumns.length + (expandableRowRender ? 1 : 0)}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyState ?? "No results."}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => {
                const rowId = row.id
                const isExpanded = expandedRows.has(rowId)
                return (
                  <React.Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() ? "selected" : undefined}
                    >
                      {expandableRowRender && (
                        <TableCell className="w-8">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => toggleExpanded(rowId)}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      )}
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                    {expandableRowRender && isExpanded && (
                      <TableRow>
                        <TableCell
                          colSpan={effectiveColumns.length + 1}
                          className="bg-muted/30 p-0"
                        >
                          {expandableRowRender(row)}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <ServerPagination
        page={tableState.page}
        limit={tableState.limit}
        total={total}
        totalPages={totalPages}
        onPageChange={(page) => onTableStateChange({ page })}
        onLimitChange={(limit) => onTableStateChange({ limit, page: 1 })}
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  )
}
