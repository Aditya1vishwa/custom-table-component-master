import * as XLSX from "xlsx"

/**
 * Export an array of objects to Excel and trigger download.
 */
export function exportToExcel<T extends object>(
    data: T[],
    filename: string = "export.xlsx",
    columns?: (keyof T)[]
): void {
    if (data.length === 0) return

    // Filter data if columns are specified
    const filteredData = columns
        ? data.map(row => {
            const filteredRow: any = {}
            columns.forEach(col => {
                filteredRow[col] = (row as any)[col]
            })
            return filteredRow
        })
        : data

    const worksheet = XLSX.utils.json_to_sheet(filteredData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data")

    // Write and trigger download
    XLSX.writeFile(workbook, filename)
}
