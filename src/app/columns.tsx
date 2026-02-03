"use client"

import { type ColumnDef } from "@tanstack/react-table"
import type { User } from "@/types"
import { StatusSelect } from "@/components/data-table/status-select"

export const usersColumns: ColumnDef<User, unknown>[] = [
    {
        accessorKey: "id",
        header: "ID",
        meta: { isSortable: true, sortableId: "id" },
        cell: ({ row }) => (
            <span className="font-mono text-xs text-muted-foreground">
                {row.original.id}
            </span>
        ),
    },
    {
        accessorKey: "name",
        header: "Name",
        meta: { isSortable: true, sortableId: "name" },
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
        accessorKey: "email",
        header: "Email",
        meta: { isSortable: true, sortableId: "email" },
        cell: ({ row }) => (
            <span className="text-muted-foreground">{row.original.email}</span>
        ),
    },
    {
        accessorKey: "phone",
        header: "Phone",
        meta: { isSortable: true, sortableId: "phone" },
        cell: ({ row }) => (
            <span className="text-muted-foreground">{row.original.phone}</span>
        ),
    },
    {
        accessorKey: "company",
        header: "Company",
        meta: { isSortable: true, sortableId: "company" },
        cell: ({ row }) => row.original.company,
    },
    {
        accessorKey: "department",
        header: "Department",
        meta: { isSortable: true, sortableId: "department" },
        cell: ({ row }) => row.original.department,
    },
    {
        accessorKey: "location",
        header: "Location",
        meta: { isSortable: true, sortableId: "location" },
        cell: ({ row }) => row.original.location,
    },
    {
        accessorKey: "role",
        header: "Role",
        meta: { isSortable: true, sortableId: "role" },
        cell: ({ row }) => row.original.role,
    },
    {
        accessorKey: "status",
        header: "Status",
        meta: { isSortable: true, sortableId: "status" },
        cell: ({ row }) => <StatusSelect row={row.original} />,
    },
    {
        accessorKey: "plan",
        header: "Plan",
        meta: { isSortable: true, sortableId: "plan" },
        cell: ({ row }) => row.original.plan,
    },
    {
        accessorKey: "lastLoginAt",
        header: "Last login",
        meta: { isSortable: true, sortableId: "lastLoginAt" },
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {new Date(row.original.lastLoginAt).toLocaleString()}
            </span>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        meta: { isSortable: true, sortableId: "createdAt" },
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {new Date(row.original.createdAt).toLocaleDateString()}
            </span>
        ),
    },
]
