# ServerDataTable - Production-Ready Server-Side Data Table

A fully-featured, generic server-side data table component built with Next.js, React, TypeScript, TanStack Table, and shadcn/ui.

## Features

- ✅ **Server-side pagination, sorting, and search** - All data operations handled server-side
- ✅ **URL-driven state** - Table state persists in URL (refresh/share URL preserves state)
- ✅ **TanStack Query integration** - Proper caching and background refetching
- ✅ **Row selection** - Single and bulk selection with custom actions
- ✅ **Expandable rows** - Show additional details inline
- ✅ **Column visibility** - Toggle columns on/off (persisted in URL)
- ✅ **Custom filters** - Pass any filter UI via props
- ✅ **Loading states** - Initial loading and background refetch indicators
- ✅ **Error handling** - Custom error states
- ✅ **Fully typed** - Complete TypeScript support
- ✅ **Framework agnostic** - Can work without Next.js router (use `useTableStateGeneric`)

## Installation

```bash
npm install @tanstack/react-table @tanstack/react-query
```

Required shadcn/ui components (already included):
- `table`
- `input`
- `button`
- `checkbox`
- `select`
- `dropdown-menu`
- `label`

## Quick Start

### Basic Usage

```tsx
import { ServerDataTable } from "@/components/data-table"
import { useTableState } from "@/hooks"
import { useServerTableQuery } from "@/hooks"

// Define columns
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  // ... more columns
]

// In your component
function UsersPage() {
  const [tableState, setTableState] = useTableState({
    defaultLimit: 10,
    filterParamKeys: ["status"], // Optional: persist filters in URL
  })

  const { data, isLoading } = useServerTableQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    tableState,
  })

  return (
    <ServerDataTable
      tableState={tableState}
      onTableStateChange={setTableState}
      columns={columns}
      data={data?.data ?? []}
      total={data?.total ?? 0}
      isLoading={isLoading}
    />
  )
}
```

### With Next.js Router (URL-driven state)

```tsx
import { useTableState } from "@/hooks/use-table-state"

const [state, setState] = useTableState({
  defaultLimit: 10,
  filterParamKeys: ["status", "role"],
  persistColumnVisibility: true,
})
```

### Without Next.js (Generic state)

```tsx
import { useTableStateGeneric } from "@/hooks/use-table-state-generic"

const [state, setState] = useTableStateGeneric({
  defaultLimit: 10,
  onStateChange: (state) => {
    // Persist to localStorage, state management, etc.
  },
})
```

## API Reference

### ServerDataTable Props

```typescript
interface ServerDataTableProps<TData> {
  // Required
  tableState: ServerTableState
  onTableStateChange: (updates: Partial<ServerTableState>) => void
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  total: number

  // Loading states
  isLoading?: boolean
  isFetching?: boolean
  onRefresh?: () => void

  // Search
  searchPlaceholder?: string
  searchDebounceMs?: number

  // Filters
  filterSlot?: React.ReactNode

  // Column visibility
  enableColumnVisibility?: boolean

  // Pagination
  pageSizeOptions?: readonly number[]

  // Row selection
  enableRowSelection?: boolean
  selectedRowIds?: Set<string | number>
  onSelectionChange?: (ids: Set<string | number>) => void
  getRowId?: (row: TData) => string | number
  bulkActions?: (selectedRows: TData[]) => React.ReactNode

  // Expandable rows
  expandableRowRender?: (row: Row<TData>) => React.ReactNode

  // States
  emptyState?: React.ReactNode
  error?: Error | null
  errorState?: React.ReactNode

  className?: string
}
```

### useTableState Hook

```typescript
const [state, setState] = useTableState({
  defaultLimit?: number
  filterParamKeys?: readonly string[]
  persistColumnVisibility?: boolean
})
```

### useServerTableQuery Hook

```typescript
const { data, isLoading, error } = useServerTableQuery<TData>({
  queryKey: readonly unknown[]
  queryFn: (params: ServerTableParams) => Promise<ServerTableResponse<TData>>
  tableState: ServerTableState
  searchDebounceMs?: number
})
```

## Examples

See `src/app/users/` for a complete example with:
- Sortable columns
- Custom filters
- Row selection
- Expandable rows
- Export to CSV
- Error handling

## Project Structure

```
src/
├── components/
│   └── data-table/
│       ├── server-data-table.tsx    # Main table component
│       ├── server-pagination.tsx    # Pagination component
│       ├── column-visibility.tsx    # Column toggle
│       ├── types.ts                 # Type definitions
│       └── index.ts                 # Exports
├── hooks/
│   ├── use-table-state.ts          # Next.js URL-driven state
│   ├── use-table-state-generic.ts  # Generic state (no Next.js)
│   ├── use-server-table-query.ts   # TanStack Query integration
│   ├── use-debounce.ts             # Debounce utility
│   └── index.ts                    # Exports
└── lib/
    ├── table-types.ts              # Core types
    └── export-csv.ts               # CSV export utility
```

## Type Safety

All components are fully typed with TypeScript:

```typescript
// Generic data type
ServerDataTable<User>

// Type-safe column definitions
const columns: ColumnDef<User>[] = [...]

// Type-safe query function
const queryFn = (params: ServerTableParams): Promise<ServerTableResponse<User>> => {
  // ...
}
```

## Customization

### Custom Filters

```tsx
<ServerDataTable
  filterSlot={
    <YourCustomFilters
      value={tableState.filters}
      onChange={(filters) => setTableState({ filters, page: 1 })}
    />
  }
/>
```

### Custom Empty State

```tsx
<ServerDataTable
  emptyState={<div>No data available</div>}
/>
```

### Custom Error State

```tsx
<ServerDataTable
  error={error}
  errorState={<div>Error: {error.message}</div>}
/>
```

## License

MIT
