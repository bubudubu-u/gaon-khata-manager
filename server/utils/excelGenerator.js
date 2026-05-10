const XLSX = require('xlsx');
const { formatDateHindi, getEntryTypeHindi, getStatusHindi, getLandUnitHindi, getPaymentModeHindi } = require('./helpers');

class KhataExcelGenerator {
  constructor(entries, title = 'खाता रिपोर्ट') {
    this.entries = entries;
    this.title = title;
    this.workbook = XLSX.utils.book_new();
  }

  generate() {
    this.addKhataSheet();
    this.addSummarySheet();
    this.addPersonWiseSheet();
    return this.workbook;
  }

  addKhataSheet() {
    const data = this.entries.map(entry => ({
      'दिनांक (Date)': formatDateHindi(entry.date),
      'रसीद नं. (Receipt No.)': entry.receiptNumber,
      'व्यक्ति (Person)': entry.person?.name || 'N/A',
      'पिता का नाम (Father)': entry.person?.fatherName || 'N/A',
      'गाँव (Village)': entry.person?.village || 'N/A',
      'प्रकार (Type)': getEntryTypeHindi(entry.entryType),
      'वर्ष (Year)': entry.year,
      'भूमि (Land)': `${entry.landDetails.size} ${getLandUnitHindi(entry.landDetails.unit)}`,
      'खसरा नं. (Khasra)': entry.landDetails.khasraNumber || '-',
      'भूमि प्रकार (Land Type)': entry.landDetails.landType || '-',
      'कुल राशि (Total)': entry.financials.totalAmount,
      'भुगतान (Paid)': entry.financials.paidAmount,
      'बकाया (Pending)': entry.financials.remainingAmount,
      'छूट (Discount)': entry.financials.discount || 0,
      'भुगतान माध्यम (Mode)': getPaymentModeHindi(entry.financials.paymentMode),
      'स्थिति (Status)': getStatusHindi(entry.status),
      'विवरण (Description)': entry.description || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Set column widths
    const colWidths = [
      { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 20 },
      { wch: 15 }, { wch: 10 }, { wch: 8 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 30 }
    ];
    worksheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'खाता प्रविष्टियाँ');
  }

  addSummarySheet() {
    const totalAmount = this.entries.reduce((sum, e) => sum + e.financials.totalAmount, 0);
    const totalPaid = this.entries.reduce((sum, e) => sum + e.financials.paidAmount, 0);
    const totalPending = this.entries.reduce((sum, e) => sum + e.financials.remainingAmount, 0);
    const totalDiscount = this.entries.reduce((sum, e) => sum + (e.financials.discount || 0), 0);

    const summaryData = [
      ['विवरण', 'राशि'],
      ['कुल प्रविष्टियाँ', this.entries.length],
      ['कुल राशि', totalAmount],
      ['कुल भुगतान', totalPaid],
      ['कुल बकाया', totalPending],
      ['कुल छूट', totalDiscount]
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'सारांश');

    // Person-wise summary
    const personWise = {};
    this.entries.forEach(entry => {
      const personName = entry.person?.name || 'Unknown';
      if (!personWise[personName]) {
        personWise[personName] = { entries: 0, total: 0, paid: 0, pending: 0 };
      }
      personWise[personName].entries++;
      personWise[personName].total += entry.financials.totalAmount;
      personWise[personName].paid += entry.financials.paidAmount;
      personWise[personName].pending += entry.financials.remainingAmount;
    });

    const personData = [['व्यक्ति', 'प्रविष्टियाँ', 'कुल', 'भुगतान', 'बकाया']];
    Object.entries(personWise).forEach(([name, data]) => {
      personData.push([name, data.entries, data.total, data.paid, data.pending]);
    });

    const personSheet = XLSX.utils.aoa_to_sheet(personData);
    XLSX.utils.book_append_sheet(this.workbook, personSheet, 'व्यक्ति अनुसार');
  }

  addPersonWiseSheet() {
    // Add person-wise breakdown
  }

  getBuffer() {
    return XLSX.write(this.workbook, { type: 'buffer', bookType: 'xlsx' });
  }
}

module.exports = KhataExcelGenerator;
