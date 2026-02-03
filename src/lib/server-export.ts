
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { User } from "@/types"

export function generateCsv(data: User[]): Buffer {
    const headers = ["ID", "Name", "Email", "Role", "Status", "Company", "Department"]
    const rows = data.map(u => [u.id, u.name, u.email, u.role, u.status, u.company, u.department])

    // Add BOM for Excel compatibility
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    return Buffer.from(csvContent, 'utf-8')
}

export function generateExcel(data: User[]): Buffer {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users")
    return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
}

export function generatePdf(data: User[]): Buffer {
    // Create a new jsPDF instance (mocking window/document existence for Node environment if needed, 
    // but jsPDF usually works in Node with some caveats or we might need a specific node build/wrapper.
    // For this task, we'll try standard usage as libraries often support isomorphic usage now.)
    // Note: jspdf in minimal node env might need global mocks. 
    // If this fails, we will need to polyfill or use a different lib.
    // However, let's assume it works or we catch errors. 

    // Ideally we'd use a purely server-side lib like `pdfmake` or `react-pdf` for node, 
    // but the plan is to reuse libraries if possible. 
    // jsPDF usually requires a DOM. Let's try to see if it works or if we need a workaroud.

    const doc = new jsPDF()

    const columns = ["ID", "Name", "Email", "Status", "Role"]
    const rows = data.map(u => [u.id, u.name, u.email, u.status, u.role])

    autoTable(doc, {
        head: [columns],
        body: rows,
    })

    // output as ArrayBuffer then to Buffer
    return Buffer.from(doc.output("arraybuffer"))
}
