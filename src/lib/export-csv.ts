/**
 * Export an array of objects to CSV and trigger download.
 * Keys of the first object define columns; values are escaped for CSV.
 */
export function exportToCsv<T extends object>(
  data: T[],
  filename: string = "export.csv",
  columns?: (keyof T)[]
): void {
  if (data.length === 0) return
  const keys = columns ?? (Object.keys(data[0]) as (keyof T)[])
  const header = keys.map((k) => escapeCsvCell(String(k))).join(",")
  const rows = data.map((row) =>
    keys.map((k) => escapeCsvCell(String((row as Record<string, unknown>)[k as string] ?? ""))).join(",")
  )
  const csv = [header, ...rows].join("\r\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function escapeCsvCell(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
