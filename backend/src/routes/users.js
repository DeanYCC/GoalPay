import express from 'express';
import { User, Company } from '../models/index.js';

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['googleId'] },
      include: [
        {
          model: Company,
          as: 'companies',
          attributes: ['id', 'name', 'industry', 'location', 'startDate', 'endDate', 'position']
        }
      ]
    });

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { preferredLanguage, preferredCurrency, theme } = req.body;
    
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({
      preferredLanguage,
      preferredCurrency,
      theme
    });

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Get user companies
router.get('/companies', async (req, res) => {
  try {
    const companies = await Company.findAll({
      where: { userId: req.user.id },
      order: [['startDate', 'DESC']]
    });

    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Create company
router.post('/companies', async (req, res) => {
  try {
    const { name, industry, location, startDate, endDate, position, description } = req.body;
    
    const company = await Company.create({
      userId: req.user.id,
      name,
      industry,
      location,
      startDate,
      endDate,
      position,
      description
    });

    res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// Update company
router.put('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findOne({
      where: { id, userId: req.user.id }
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    await company.update(req.body);
    res.json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
});

// Delete company
router.delete('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findOne({
      where: { id, userId: req.user.id }
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    await company.destroy();
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

export default router;
