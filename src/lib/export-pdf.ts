import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

/**
 * Export an array of objects to PDF and trigger download.
 */
export function exportToPdf<T extends object>(
    data: T[],
    filename: string = "export.pdf",
    columns?: (keyof T)[]
): void {
    if (data.length === 0) return

    const doc = new jsPDF()

    const keys = columns ?? (Object.keys(data[0]) as (keyof T)[])
    const head = [keys.map(String)]
    const body = data.map((row) =>
        keys.map((k) => String((row as Record<string, unknown>)[k as string] ?? ""))
    )

    autoTable(doc, {
        head,
        body,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { textColor: [50, 50, 50], fillColor: [240, 240, 240] },
    })

    doc.save(filename)
}
