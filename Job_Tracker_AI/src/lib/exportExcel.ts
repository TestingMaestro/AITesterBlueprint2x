import * as ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import type { Job } from '@/types'
import { formatSalary, formatDate } from './utils'

export async function exportToExcel(jobs: Job[]) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Pipeline')

  // Define columns and widths
  worksheet.columns = [
    { key: 'company', width: 20 },
    { key: 'domain', width: 20 },
    { key: 'role', width: 30 },
    { key: 'department', width: 18 },
    { key: 'status', width: 15 },
    { key: 'salary', width: 20 },
    { key: 'aiScore', width: 12 },
    { key: 'dateApplied', width: 15 },
    { key: 'notes', width: 40 },
  ]

  // ROW 1: Main Title (Merged)
  worksheet.mergeCells('A1:I1')
  const titleRow = worksheet.getRow(1)
  titleRow.height = 30
  const titleCell = worksheet.getCell('A1')
  titleCell.value = 'Job Search Pipeline & Metrics'
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } } // Dark Blue
  titleCell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 14 }
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  titleCell.border = {
    top: { style: 'medium', color: { argb: 'FF000000' } },
    left: { style: 'medium', color: { argb: 'FF000000' } },
    right: { style: 'medium', color: { argb: 'FF000000' } },
    bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } }
  }

  // ROW 2: Category Headers
  worksheet.mergeCells('A2:D2') // IDENTIFICATION
  worksheet.getCell('A2').value = 'IDENTIFICATION'
  
  worksheet.getCell('E2').value = 'TRACKING' // STATUS is 1 col

  worksheet.mergeCells('F2:G2') // COMPENSATION & SCORING
  worksheet.getCell('F2').value = 'COMPENSATION & SCORING'

  worksheet.mergeCells('H2:I2') // TIMELINE & META
  worksheet.getCell('H2').value = 'TIMELINE & META'

  const catRow = worksheet.getRow(2)
  catRow.height = 25
  catRow.eachCell((cell, colNumber) => {
    // Check if cell is part of merged ranges or single cells we populated
    if (cell.value) {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5B9BD5' } } // Medium Blue
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 10 }
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.border = {
        left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        right: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      }
    }
  })

  // Ensure all cells in row 2 have the background color (including merged out ones)
  for (let i = 1; i <= 9; i++) {
    const c = catRow.getCell(i)
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5B9BD5' } }
    c.border = {
      left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      right: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
    }
  }

  // ROW 3: Column Sub-Headers
  const subHeaders = [
    'Company', 'Domain', 'Role', 'Department', // A to D
    'Status', // E
    'Salary', 'AI Score', // F to G
    'Date Applied', 'Notes' // H to I
  ]
  const subRow = worksheet.getRow(3)
  subRow.height = 35
  subHeaders.forEach((headerText, i) => {
    const cell = subRow.getCell(i + 1)
    cell.value = headerText
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5B9BD5' } } // the same medium blue as row 2
    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 10 }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cell.border = {
      left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      right: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      bottom: { style: 'medium', color: { argb: 'FF8EA9DB' } },
    }
  })

  // Freeze the top 3 header rows so they stay visible when scrolling
  worksheet.views = [
    { state: 'frozen', xSplit: 0, ySplit: 3 }
  ]

  // Add Data Rows (Row 4 onwards)
  jobs.forEach((job, index) => {
    const rowIndex = index + 4
    const row = worksheet.getRow(rowIndex)
    row.height = 30 // Taller row for easier reading mapped from UI image

    const isEven = index % 2 === 0
    const rowBgColor = isEven ? 'FFFFFFFF' : 'FFDDEBF7' // White or Light Blue-ish Gray

    const rowData = [
      job.company,
      job.url?.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] || '-',
      job.role,
      'Engineering', // Mocked based on structure
      job.status,
      job.salary_min ? formatSalary(job.salary_min, job.salary_max) : '—',
      job.ai_score ? job.ai_score.toString() : '—',
      job.applied_at ? formatDate(job.applied_at) : '-',
      job.url && job.url.length > 5 ? job.url : '-'
    ]

    rowData.forEach((val, i) => {
      const cell = row.getCell(i + 1)
      cell.value = val

      // Default Cell Styling
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBgColor } }
      cell.font = { color: { argb: 'FF000000' }, size: 10 }
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 }
      cell.border = {
        left: { style: 'thin', color: { argb: 'FFB4C6E7' } },
        right: { style: 'thin', color: { argb: 'FFB4C6E7' } },
        top: { style: 'thin', color: { argb: 'FFB4C6E7' } },
        bottom: { style: 'thin', color: { argb: 'FFB4C6E7' } },
      }

      // Column-Specific Tuning
      if (i === 4) { // Status (col E, index 4)
        cell.alignment = { vertical: 'middle', horizontal: 'center' }
        cell.font = { ...cell.font, bold: true }
        
        // Status color mapping based on User's UI reference where status has colored blocks
        const statusVal = job.status.toLowerCase()
        if (statusVal === 'offer' || statusVal === 'accepted') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } } // Light green
          cell.font.color = { argb: 'FF385723' } // Dark Green text
        } else if (statusVal === 'rejected') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCE4D6' } } // Light red/pink
          cell.font.color = { argb: 'FF833C0C' } // Dark Red text
        } else if (statusVal === 'interview' || statusVal === 'wishlist') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } } // Light yellow
          cell.font.color = { argb: 'FF7F6000' } // Dark Yellow text
        }
      } else if (i === 5 || i === 6 || i === 7) { // Salary, AI Score, Date Applied
        cell.alignment = { vertical: 'middle', horizontal: 'center' }
      }
    })
  })

  // Outer bold border around entire dataset for that enclosed feeling
  const lastRowIdx = jobs.length + 3
  for (let r = 1; r <= lastRowIdx; r++) {
    const row = worksheet.getRow(r)
    // Left border of column A
    const cellA = row.getCell(1)
    cellA.border = { ...cellA.border, left: { style: 'medium', color: { argb: 'FF000000' } } }
    
    // Right border of last column (I)
    const cellI = row.getCell(9)
    cellI.border = { ...cellI.border, right: { style: 'medium', color: { argb: 'FF000000' } } }

    // Bottom border of last row
    if (r === lastRowIdx) {
      for (let c = 1; c <= 9; c++) {
        const bottomCell = row.getCell(c)
        bottomCell.border = { ...bottomCell.border, bottom: { style: 'medium', color: { argb: 'FF000000' } } }
      }
    }
  }

  // Generate buffer and save
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, 'JobTracker_Export.xlsx')
}
