const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const department = require('../middleware/department');
const { getComplaints } = require('../controllers/complaintsController');
const { getReport, updateReport, deleteReport, markAsCompleted } = require('../controllers/reportActionsController');
const Report = require('../models/Report');

// GET /api/complaints
router.get('/', auth, department, getComplaints);

// GET single complaint
router.get('/:id', auth, department, getReport);

const { assignEmployee } = require('../controllers/employeesController');

// Get assigned employee details
router.get('/:id/assigned-employee', auth, department, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate({ path: 'assignedTo', model: 'Employee', select: 'employeeId name email phone department' })
      .lean();

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (!report.assignedTo) {
      return res.status(204).json({ success: false, message: 'No employee assigned' });
    }

    res.status(200).json({
      success: true,
      data: report.assignedTo
    });
  } catch (error) {
    console.error('Error fetching assigned employee:', error);
    res.status(500).json({
      error: 'Failed to fetch assigned employee details',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Assign employee
router.post('/:id/assign', auth, department, assignEmployee);

// PATCH /api/complaints/:id
router.patch('/:id', auth, department, updateReport);

// DELETE /api/complaints/:id
router.delete('/:id', auth, department, deleteReport);

// POST /api/complaints/:id/complete - Mark a report as completed with optional image and comment
router.post('/:id/complete', auth, department, markAsCompleted);

module.exports = router;
