import express from 'express';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import createCsvWriter from 'csv-writer';
import { PayrollSlip, PayrollItem, Company, PayrollTerm } from '../models/index.js';
import { Op } from 'sequelize';
import moment from 'moment';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Get salary summary data
router.get('/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;

    const whereClause = { userId };
    if (startDate && endDate) {
      whereClause.slipDate = {
        [Op.between]: [startDate, endDate]
      };
    }

    const payrollSlips = await PayrollSlip.findAll({
      where: whereClause,
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['name']
        },
        {
          model: PayrollItem,
          as: 'payrollItems',
          include: [
            {
              model: PayrollTerm,
              as: 'payrollTerm'
            }
          ]
        }
      ],
      order: [['slipDate', 'DESC']]
    });

    // Calculate summary
    const summary = {
      totalSlips: payrollSlips.length,
      totalGross: 0,
      totalNet: 0,
      totalDeductions: 0,
      monthlyData: [],
      yearlyData: []
    };

    payrollSlips.forEach(slip => {
      summary.totalGross += parseFloat(slip.totalGross);
      summary.totalNet += parseFloat(slip.totalNet);
      summary.totalDeductions += parseFloat(slip.totalDeductions);

      // Monthly data
      const monthKey = moment(slip.slipDate).format('YYYY-MM');
      const monthData = summary.monthlyData.find(m => m.month === monthKey);
      if (monthData) {
        monthData.gross += parseFloat(slip.totalGross);
        monthData.net += parseFloat(slip.totalNet);
        monthData.deductions += parseFloat(slip.totalDeductions);
      } else {
        summary.monthlyData.push({
          month: monthKey,
          gross: parseFloat(slip.totalGross),
          net: parseFloat(slip.totalNet),
          deductions: parseFloat(slip.totalDeductions)
        });
      }

      // Yearly data
      const yearKey = moment(slip.slipDate).format('YYYY');
      const yearData = summary.yearlyData.find(y => y.year === yearKey);
      if (yearData) {
        yearData.gross += parseFloat(slip.totalGross);
        yearData.net += parseFloat(slip.totalNet);
        yearData.deductions += parseFloat(slip.totalDeductions);
      } else {
        summary.yearlyData.push({
          year: yearKey,
          gross: parseFloat(slip.totalGross),
          net: parseFloat(slip.totalNet),
          deductions: parseFloat(slip.totalDeductions)
        });
      }
    });

    res.json(summary);
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// Export to PDF
router.post('/export/pdf', async (req, res) => {
  try {
    const { startDate, endDate, includeCharts, includeTables } = req.body;
    const userId = req.user.id;

    const whereClause = { userId };
    if (startDate && endDate) {
      whereClause.slipDate = {
        [Op.between]: [startDate, endDate]
      };
    }

    const payrollSlips = await PayrollSlip.findAll({
      where: whereClause,
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['name']
        },
        {
          model: PayrollItem,
          as: 'payrollItems',
          include: [
            {
              model: PayrollTerm,
              as: 'payrollTerm'
            }
          ]
        }
      ],
      order: [['slipDate', 'DESC']]
    });

    // Create PDF
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('GoalPay Salary Report', 20, 20);
    
    // Date range
    doc.setFontSize(12);
    doc.text(`Period: ${startDate || 'All time'} - ${endDate || 'Present'}`, 20, 35);
    
    let yPosition = 50;

    if (includeTables) {
      // Summary table
      const summaryData = [
        ['Total Slips', payrollSlips.length.toString()],
        ['Total Gross', `¥${payrollSlips.reduce((sum, slip) => sum + parseFloat(slip.totalGross), 0).toLocaleString()}`],
        ['Total Net', `¥${payrollSlips.reduce((sum, slip) => sum + parseFloat(slip.totalNet), 0).toLocaleString()}`],
        ['Total Deductions', `¥${payrollSlips.reduce((sum, slip) => sum + parseFloat(slip.totalDeductions), 0).toLocaleString()}`]
      ];

      doc.autoTable({
        startY: yPosition,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'grid'
      });

      yPosition = doc.lastAutoTable.finalY + 20;

      // Payroll slips table
      if (payrollSlips.length > 0) {
        const slipsData = payrollSlips.map(slip => [
          moment(slip.slipDate).format('YYYY-MM-DD'),
          slip.company?.name || 'N/A',
          `¥${parseFloat(slip.totalGross).toLocaleString()}`,
          `¥${parseFloat(slip.totalNet).toLocaleString()}`,
          `¥${parseFloat(slip.totalDeductions).toLocaleString()}`
        ]);

        doc.autoTable({
          startY: yPosition,
          head: [['Date', 'Company', 'Gross', 'Net', 'Deductions']],
          body: slipsData,
          theme: 'grid'
        });

        yPosition = doc.lastAutoTable.finalY + 20;
      }
    }

    if (includeCharts && payrollSlips.length > 0) {
      // Monthly trend chart (simplified as table for PDF)
      const monthlyData = {};
      payrollSlips.forEach(slip => {
        const month = moment(slip.slipDate).format('YYYY-MM');
        if (!monthlyData[month]) {
          monthlyData[month] = { gross: 0, net: 0, deductions: 0 };
        }
        monthlyData[month].gross += parseFloat(slip.totalGross);
        monthlyData[month].net += parseFloat(slip.totalNet);
        monthlyData[month].deductions += parseFloat(slip.totalDeductions);
      });

      const chartData = Object.entries(monthlyData).map(([month, data]) => [
        month,
        `¥${data.gross.toLocaleString()}`,
        `¥${data.net.toLocaleString()}`,
        `¥${data.deductions.toLocaleString()}`
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [['Month', 'Gross', 'Net', 'Deductions']],
        body: chartData,
        theme: 'grid'
      });
    }

    // Footer
    doc.setFontSize(10);
    doc.text(`Generated on ${moment().format('YYYY-MM-DD HH:mm:ss')}`, 20, doc.internal.pageSize.height - 20);

    // Send PDF
    const pdfBuffer = doc.output('arraybuffer');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="goalpay-report-${moment().format('YYYY-MM-DD')}.pdf"`);
    res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Export to CSV
router.post('/export/csv', async (req, res) => {
  try {
    const { startDate, endDate, includeCharts, includeTables } = req.query;
    const userId = req.user.id;

    const whereClause = { userId };
    if (startDate && endDate) {
      whereClause.slipDate = {
        [Op.between]: [startDate, endDate]
      };
    }

    const payrollSlips = await PayrollSlip.findAll({
      where: whereClause,
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['name']
        },
        {
          model: PayrollItem,
          as: 'payrollItems',
          include: [
            {
              model: PayrollTerm,
              as: 'payrollTerm'
            }
          ]
        }
      ],
      order: [['slipDate', 'DESC']]
    });

    // Create CSV
    const csvWriter = createCsvWriter({
      path: `temp/goalpay-report-${moment().format('YYYY-MM-DD')}.csv`,
      header: [
        { id: 'date', title: 'Date' },
        { id: 'company', title: 'Company' },
        { id: 'gross', title: 'Gross Amount' },
        { id: 'net', title: 'Net Amount' },
        { id: 'deductions', title: 'Deductions' },
        { id: 'currency', title: 'Currency' }
      ]
    });

    const records = payrollSlips.map(slip => ({
      date: moment(slip.slipDate).format('YYYY-MM-DD'),
      company: slip.company?.name || 'N/A',
      gross: slip.totalGross,
      net: slip.totalNet,
      deductions: slip.totalDeductions,
      currency: slip.currency
    }));

    await csvWriter.writeRecords(records);

    // Read and send CSV file
    const csvPath = `temp/goalpay-report-${moment().format('YYYY-MM-DD')}.csv`;
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    
    // Clean up temp file
    fs.unlinkSync(csvPath);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="goalpay-report-${moment().format('YYYY-MM-DD')}.csv"`);
    res.send(csvContent);

  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).json({ error: 'Failed to generate CSV' });
  }
});

export default router;
