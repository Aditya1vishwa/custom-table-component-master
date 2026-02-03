import { useCallback, useMemo, useState, useEffect } from "react"
import type { ServerTableState, SortOrder } from "@/components/data-table/types"
import { DEFAULT_TABLE_STATE, isSortOrder } from "@/lib/table-utils"

export interface UseTableStateGenericOptions {
  /** Initial/default limit */
  defaultLimit?: number
  /** Keys of custom filters to track */
  filterParamKeys?: readonly string[]
  /** Persist column visibility */
  persistColumnVisibility?: boolean
  /** Initial state (overrides defaults) */
  initialState?: Partial<ServerTableState>
  /** Callback when state changes (for persistence) */
  onStateChange?: (state: ServerTableState) => void
  /** Load initial state from external source (e.g., URL, localStorage) */
  loadInitialState?: () => Partial<ServerTableState>
}

/**
 * Generic hook for managing table state.
 * Works independently of Next.js router - can be used anywhere.
 * 
 * @example
 * ```tsx
 * const [state, setState] = useTableStateGeneric({
 *   defaultLimit: 20,
 *   filterParamKeys: ["status", "role"],
 *   onStateChange: (state) => {
 *     // Persist to URL, localStorage, etc.
 *   }
 * })
 * ```
 */
export function useTableStateGeneric(
  options: UseTableStateGenericOptions = {}
): [ServerTableState, (updates: Partial<ServerTableState>) => void] {
  const {
    defaultLimit = DEFAULT_TABLE_STATE.limit,
    filterParamKeys = [],
    persistColumnVisibility = false,
    initialState = {},
    onStateChange,
    loadInitialState,
  } = options

  // Load initial state from external source if provided
  const externalState = useMemo(() => {
    if (loadInitialState) {
      try {
        return loadInitialState()
      } catch {
        return {}
      }
    }
    return {}
  }, [loadInitialState])

  // Merge all initial states
  const baseState: ServerTableState = useMemo(
    () => ({
      ...DEFAULT_TABLE_STATE,
      limit: defaultLimit,
      ...externalState,
      ...initialState,
    }),
    [defaultLimit, externalState, initialState]
  )

  const [state, setStateInternal] = useState<ServerTableState>(baseState)

  // Sync with external state changes (e.g., URL changes)
  useEffect(() => {
    if (loadInitialState) {
      const external = loadInitialState()
      setStateInternal((prev) => ({ ...prev, ...external }))
    }
  }, [loadInitialState])

  const setState = useCallback(
    (updates: Partial<ServerTableState>) => {
      setStateInternal((prev) => {
        const next = { ...prev, ...updates }
        onStateChange?.(next)
        return next
      })
    },
    [onStateChange]
  )

  return [state, setState]
}
