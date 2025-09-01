import express from 'express';
import { PayrollTerm } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// Get all payroll terms
router.get('/terms', async (req, res) => {
  try {
    const { category, search, language } = req.query;
    const userId = req.user.id;

    const whereClause = {};
    if (category && category !== 'all') {
      whereClause.category = category;
    }
    if (search) {
      whereClause[Op.or] = [
        { standardKey: { [Op.iLike]: `%${search}%` } },
        { originalLabelEn: { [Op.iLike]: `%${search}%` } },
        { originalLabelJp: { [Op.iLike]: `%${search}%` } },
        { originalLabelZh: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const terms = await PayrollTerm.findAll({
      where: {
        [Op.or]: [
          { isCustom: false }, // System terms
          { createdBy: userId } // User's custom terms
        ],
        ...whereClause
      },
      order: [
        ['isCustom', 'ASC'],
        ['category', 'ASC'],
        ['standardKey', 'ASC']
      ]
    });

    res.json(terms);
  } catch (error) {
    console.error('Error fetching payroll terms:', error);
    res.status(500).json({ error: 'Failed to fetch payroll terms' });
  }
});

// Get single payroll term
router.get('/terms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const term = await PayrollTerm.findOne({
      where: {
        id,
        [Op.or]: [
          { isCustom: false },
          { createdBy: userId }
        ]
      }
    });

    if (!term) {
      return res.status(404).json({ error: 'Payroll term not found' });
    }

    res.json(term);
  } catch (error) {
    console.error('Error fetching payroll term:', error);
    res.status(500).json({ error: 'Failed to fetch payroll term' });
  }
});

// Create custom payroll term
router.post('/terms', async (req, res) => {
  try {
    const {
      standardKey,
      originalLabelEn,
      originalLabelJp,
      originalLabelZh,
      descriptionEn,
      descriptionJp,
      descriptionZh,
      category
    } = req.body;

    const userId = req.user.id;

    // Check if term already exists
    const existingTerm = await PayrollTerm.findOne({
      where: { standardKey }
    });

    if (existingTerm) {
      return res.status(400).json({ error: 'Term with this key already exists' });
    }

    const term = await PayrollTerm.create({
      standardKey,
      originalLabelEn,
      originalLabelJp,
      originalLabelZh,
      descriptionEn,
      descriptionJp,
      descriptionZh,
      category,
      isCustom: true,
      createdBy: userId
    });

    res.status(201).json(term);
  } catch (error) {
    console.error('Error creating payroll term:', error);
    res.status(500).json({ error: 'Failed to create payroll term' });
  }
});

// Update custom payroll term
router.put('/terms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const term = await PayrollTerm.findOne({
      where: {
        id,
        createdBy: userId,
        isCustom: true
      }
    });

    if (!term) {
      return res.status(404).json({ error: 'Payroll term not found or not editable' });
    }

    await term.update(req.body);
    res.json(term);
  } catch (error) {
    console.error('Error updating payroll term:', error);
    res.status(500).json({ error: 'Failed to update payroll term' });
  }
});

// Delete custom payroll term
router.delete('/terms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const term = await PayrollTerm.findOne({
      where: {
        id,
        createdBy: userId,
        isCustom: true
      }
    });

    if (!term) {
      return res.status(404).json({ error: 'Payroll term not found or not deletable' });
    }

    await term.destroy();
    res.json({ message: 'Payroll term deleted successfully' });
  } catch (error) {
    console.error('Error deleting payroll term:', error);
    res.status(500).json({ error: 'Failed to delete payroll term' });
  }
});

// Get terms by category
router.get('/categories/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const userId = req.user.id;

    const terms = await PayrollTerm.findAll({
      where: {
        category,
        [Op.or]: [
          { isCustom: false },
          { createdBy: userId }
        ]
      },
      order: [
        ['isCustom', 'ASC'],
        ['standardKey', 'ASC']
      ]
    });

    res.json(terms);
  } catch (error) {
    console.error('Error fetching terms by category:', error);
    res.status(500).json({ error: 'Failed to fetch terms by category' });
  }
});

// Search terms
router.get('/search', async (req, res) => {
  try {
    const { q, language } = req.query;
    const userId = req.user.id;

    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const terms = await PayrollTerm.findAll({
      where: {
        [Op.or]: [
          { standardKey: { [Op.iLike]: `%${q}%` } },
          { originalLabelEn: { [Op.iLike]: `%${q}%` } },
          { originalLabelJp: { [Op.iLike]: `%${q}%` } },
          { originalLabelZh: { [Op.iLike]: `%${q}%` } },
          { descriptionEn: { [Op.iLike]: `%${q}%` } },
          { descriptionJp: { [Op.iLike]: `%${q}%` } },
          { descriptionZh: { [Op.iLike]: `%${q}%` } }
        ],
        [Op.or]: [
          { isCustom: false },
          { createdBy: userId }
        ]
      },
      order: [
        ['isCustom', 'ASC'],
        ['category', 'ASC']
      ],
      limit: 20
    });

    res.json(terms);
  } catch (error) {
    console.error('Error searching terms:', error);
    res.status(500).json({ error: 'Failed to search terms' });
  }
});

export default router;
