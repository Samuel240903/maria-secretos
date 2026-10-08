import ExcelJS from 'exceljs'
import fs from 'fs'
import path from 'path'
import { PRODUCTS, CATEGORIES, LINKS } from '../src/data/products.js'

async function generateExcel() {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'María Secretos'
  workbook.lastModifiedBy = 'María Secretos'
  workbook.created = new Date()

  // Hoja 1: Catálogo Completo de Referencias
  const sheet = workbook.addWorksheet('Control de Referencias', {
    views: [{ state: 'frozen', ySplit: 1 }]
  })

  sheet.columns = [
    { header: 'Referencia (SKU)', key: 'ref', width: 18 },
    { header: 'Categoría', key: 'category', width: 24 },
    { header: 'Nombre del Producto', key: 'name', width: 35 },
    { header: 'Tipo de Eslabón / Piedra', key: 'linkOrStone', width: 24 },
    { header: 'Largo (cm)', key: 'length', width: 14 },
    { header: 'Grosor (mm)', key: 'mm', width: 14 },
    { header: 'Peso (g)', key: 'grams', width: 14 },
    { header: 'Precio (COP)', key: 'price', width: 18 },
    { header: 'Estado', key: 'status', width: 15 },
    { header: 'Ruta de Imagen', key: 'image', width: 45 },
    { header: 'Descripción Corta', key: 'description', width: 55 },
  ]

  // Estilo del encabezado
  const headerRow = sheet.getRow(1)
  headerRow.font = { bold: true, color: { argb: 'FFFFFF' }, size: 11 }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '9B722B' }
  }
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
  headerRow.height = 28

  PRODUCTS.forEach((p) => {
    const catObj = CATEGORIES.find((c) => c.id === p.category)
    const catName = catObj ? catObj.name : p.category
    const linkName = p.link ? LINKS[p.link] : (p.kind === 'ring' ? 'Esmeralda' : '-')
    const lengthStr = p.length ? (p.length.includes('-') ? `${p.length} cm` : `${p.length} cm`) : '-'
    const mmVal = p.mm != null ? p.mm : '-'
    const gramsVal = p.grams != null ? p.grams : '-'
    const priceVal = p.price != null ? p.price : 'Por consultar'
    const statusVal = p.soldOut ? 'Agotado' : 'Disponible'

    const row = sheet.addRow({
      ref: p.ref,
      category: catName,
      name: p.name,
      linkOrStone: linkName,
      length: lengthStr,
      mm: mmVal,
      grams: gramsVal,
      price: priceVal,
      status: statusVal,
      image: p.image,
      description: p.description,
    })

    row.alignment = { vertical: 'middle', horizontal: 'left' }
    row.getCell('ref').alignment = { vertical: 'middle', horizontal: 'center' }
    row.getCell('ref').font = { bold: true }
    row.getCell('length').alignment = { vertical: 'middle', horizontal: 'center' }
    row.getCell('mm').alignment = { vertical: 'middle', horizontal: 'center' }
    row.getCell('grams').alignment = { vertical: 'middle', horizontal: 'center' }
    row.getCell('status').alignment = { vertical: 'middle', horizontal: 'center' }
    
    if (p.soldOut) {
      row.getCell('status').font = { color: { argb: 'C53030' }, bold: true }
    } else {
      row.getCell('status').font = { color: { argb: '276749' }, bold: true }
    }

    if (p.price != null && typeof p.price === 'number') {
      row.getCell('price').numFmt = '"$"#,##0'
    }
  })

  // Hoja 2: Plantilla de Control de Pedidos
  const orderSheet = workbook.addWorksheet('Control de Pedidos', {
    views: [{ state: 'frozen', ySplit: 1 }]
  })

  orderSheet.columns = [
    { header: 'Nº Pedido', key: 'orderNum', width: 14 },
    { header: 'Fecha', key: 'date', width: 14 },
    { header: 'Cliente', key: 'client', width: 25 },
    { header: 'Teléfono / WhatsApp', key: 'phone', width: 20 },
    { header: 'Ciudad', key: 'city', width: 18 },
    { header: 'Referencia (SKU)', key: 'ref', width: 18 },
    { header: 'Producto', key: 'product', width: 30 },
    { header: 'Talla', key: 'size', width: 10 },
    { header: 'Cantidad', key: 'qty', width: 12 },
    { header: 'Precio Unitario', key: 'price', width: 18 },
    { header: 'Total', key: 'total', width: 18 },
    { header: 'Estado del Pedido', key: 'status', width: 20 },
    { header: 'Notas / Envío', key: 'notes', width: 35 },
  ]

  const orderHeaderRow = orderSheet.getRow(1)
  orderHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' }, size: 11 }
  orderHeaderRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '2C3E50' }
  }
  orderHeaderRow.alignment = { vertical: 'middle', horizontal: 'center' }
  orderHeaderRow.height = 28

  const sampleOrder = orderSheet.addRow({
    orderNum: 'PED-001',
    date: new Date().toLocaleDateString('es-CO'),
    client: 'Ejemplo Cliente',
    phone: '3001234567',
    city: 'Cali',
    ref: 'Ref. CAD-07',
    product: 'Cadena Lazo 2,7 mm',
    size: '-',
    qty: 1,
    price: 647000,
    total: 647000,
    status: 'Pendiente de pago',
    notes: 'Empaque de regalo'
  })
  sampleOrder.getCell('price').numFmt = '"$"#,##0'
  sampleOrder.getCell('total').numFmt = '"$"#,##0'

  const filePath = path.resolve('referencias_maria_secretos.xlsx')
  await workbook.xlsx.writeFile(filePath)
  console.log(`Excel generado exitosamente en: ${filePath}`)

  // Generar CSV también
  const csvHeaders = ['Referencia', 'Categoria', 'Nombre', 'Eslabon_o_Piedra', 'Largo_cm', 'Grosor_mm', 'Peso_g', 'Precio_COP', 'Estado', 'Imagen']
  const csvRows = PRODUCTS.map((p) => {
    const catObj = CATEGORIES.find((c) => c.id === p.category)
    const catName = catObj ? catObj.name : p.category
    const linkName = p.link ? LINKS[p.link] : (p.kind === 'ring' ? 'Esmeralda' : '-')
    return [
      `"${p.ref}"`,
      `"${catName}"`,
      `"${p.name}"`,
      `"${linkName}"`,
      `"${p.length || '-'}"`,
      `"${p.mm || '-'}"`,
      `"${p.grams || '-'}"`,
      `"${p.price || 'Por consultar'}"`,
      `"${p.soldOut ? 'Agotado' : 'Disponible'}"`,
      `"${p.image}"`
    ].join(',')
  })
  const csvContent = [csvHeaders.join(','), ...csvRows].join('\n')
  fs.writeFileSync(path.resolve('referencias_maria_secretos.csv'), '\uFEFF' + csvContent, 'utf-8')
  console.log(`CSV generado exitosamente.`)
}

generateExcel().catch(console.error)
