
import { type Column } from "@tanstack/react-table"
import { ArrowUpDown, ArrowUp, ArrowDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DataTableColumnHeaderProps<TData, TValue>
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    column: Column<TData, TValue>
    title: React.ReactNode
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    const meta = column.columnDef.meta as { isSortable?: boolean; sortableId?: string } | undefined
    const isSortable = (meta?.isSortable && meta?.sortableId) && column.getCanSort();
    if (!isSortable) {
        return <div className={cn(className)}>{title}</div>
    }
    const sorted = column.getIsSorted()
    return (
        <div className={cn("flex items-center gap-1", className)}>
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 hover:bg-muted data-[state=open]:bg-accent"
                onClick={() => column.toggleSorting(sorted === "asc")}
            >
                <span className="text-sm font-medium leading-none">{title}</span>
                {sorted === "desc" ? (
                    <ArrowDown className="ml-2 h-4 w-4 opacity-50" />
                ) : sorted === "asc" ? (
                    <ArrowUp className="ml-2 h-4 w-4 opacity-50" />
                ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                )}
            </Button>
            {sorted && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground/50 hover:text-foreground"
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        column.clearSorting()
                    }}
                    title="Clear sort"
                >
                    <X className="h-4 w-4 opacity-60" />
                    <span className="sr-only">Clear sort</span>
                </Button>
            )}
        </div>
    )
}
