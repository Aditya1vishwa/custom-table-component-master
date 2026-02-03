"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/types"

interface StatusSelectProps {
    row: User
}

export function StatusSelect({ row }: StatusSelectProps) {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const { mutate, isPending } = useMutation({
        mutationFn: async (newStatus: string) => {
            const response = await fetch(`/api/users/${row.id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            })

            if (!response.ok) {
                throw new Error("Failed to update status")
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            toast({
                title: "Status updated",
                description: `User ${row.name}'s status has been updated.`,
            })
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to update status. Please try again.",
                variant: "destructive",
            })
        },
    })

    return (
        <Select
            defaultValue={row.status}
            onValueChange={(value) => mutate(value)}
            disabled={isPending}
        >
            <SelectTrigger
                className={`w-[110px] h-8 text-xs ${row.status === "active"
                    ? "text-green-600"
                    : row.status === "pending"
                        ? "text-amber-600"
                        : "text-muted-foreground"
                    }`}
            >
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="active" className="text-green-600">
                    Active
                </SelectItem>
                <SelectItem value="pending" className="text-amber-600">
                    Pending
                </SelectItem>
                <SelectItem value="inactive" className="text-muted-foreground">
                    Inactive
                </SelectItem>
            </SelectContent>
        </Select>
    )
}
