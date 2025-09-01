import express from 'express';
import multer from 'multer';
import { PayrollSlip, PayrollItem, Company, PayrollTerm } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf');
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Get all payroll slips for user
router.get('/slips', async (req, res) => {
  try {
    const { startDate, endDate, companyId } = req.query;
    const userId = req.user.id;

    const whereClause = { userId };
    if (startDate && endDate) {
      whereClause.slipDate = {
        [Op.between]: [startDate, endDate]
      };
    }
    if (companyId) {
      whereClause.companyId = companyId;
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

    res.json(payrollSlips);
  } catch (error) {
    console.error('Error fetching payroll slips:', error);
    res.status(500).json({ error: 'Failed to fetch payroll slips' });
  }
});

// Get single payroll slip
router.get('/slips/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const payrollSlip = await PayrollSlip.findOne({
      where: { id, userId },
      include: [
        {
          model: Company,
          as: 'company'
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
      ]
    });

    if (!payrollSlip) {
      return res.status(404).json({ error: 'Payroll slip not found' });
    }

    res.json(payrollSlip);
  } catch (error) {
    console.error('Error fetching payroll slip:', error);
    res.status(500).json({ error: 'Failed to fetch payroll slip' });
  }
});

// Create payroll slip
router.post('/slips', async (req, res) => {
  try {
    const {
      companyId,
      slipDate,
      paymentPeriodStart,
      paymentPeriodEnd,
      totalGross,
      totalNet,
      totalDeductions,
      currency,
      notes,
      payrollItems
    } = req.body;

    const userId = req.user.id;

    // Create payroll slip
    const payrollSlip = await PayrollSlip.create({
      userId,
      companyId,
      slipDate,
      paymentPeriodStart,
      paymentPeriodEnd,
      totalGross,
      totalNet,
      totalDeductions,
      currency: currency || 'JPY',
      notes
    });

    // Create payroll items
    if (payrollItems && Array.isArray(payrollItems)) {
      const items = payrollItems.map(item => ({
        slipId: payrollSlip.id,
        termId: item.termId,
        originalLabel: item.originalLabel,
        amount: item.amount,
        itemType: item.itemType,
        category: item.category,
        customDescription: item.customDescription
      }));

      await PayrollItem.bulkCreate(items);
    }

    // Fetch created slip with items
    const createdSlip = await PayrollSlip.findByPk(payrollSlip.id, {
      include: [
        {
          model: Company,
          as: 'company'
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
      ]
    });

    res.status(201).json(createdSlip);
  } catch (error) {
    console.error('Error creating payroll slip:', error);
    res.status(500).json({ error: 'Failed to create payroll slip' });
  }
});

// Update payroll slip
router.put('/slips/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const payrollSlip = await PayrollSlip.findOne({
      where: { id, userId }
    });

    if (!payrollSlip) {
      return res.status(404).json({ error: 'Payroll slip not found' });
    }

    await payrollSlip.update(req.body);
    res.json(payrollSlip);
  } catch (error) {
    console.error('Error updating payroll slip:', error);
    res.status(500).json({ error: 'Failed to update payroll slip' });
  }
});

// Delete payroll slip
router.delete('/slips/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const payrollSlip = await PayrollSlip.findOne({
      where: { id, userId }
    });

    if (!payrollSlip) {
      return res.status(404).json({ error: 'Payroll slip not found' });
    }

    await payrollSlip.destroy();
    res.json({ message: 'Payroll slip deleted successfully' });
  } catch (error) {
    console.error('Error deleting payroll slip:', error);
    res.status(500).json({ error: 'Failed to delete payroll slip' });
  }
});

// Upload payroll slip file
router.post('/upload', upload.single('payrollFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = req.file.path;
    res.json({ 
      message: 'File uploaded successfully',
      fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

export default router;
