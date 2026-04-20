const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const department = require('../middleware/department');
const {
  getUnassigned,
  getEmployees,
  createEmployee,
  getEmployeeDetails,
  getEmployeeStats,
  getEmployeeActivity,
  getEmployeeReports,
  deleteEmployee
} = require('../controllers/employeesController');

/**
 * @route   GET /api/employees/unassigned
 * @desc    Get list of unassigned employees for the current department
 * @access  Private (Admin/Department Head)
 */
// List employees
router.get('/', auth, department, getEmployees);

// Add new employee
router.post('/', auth, department, createEmployee);

// Unassigned employees for assignment dropdown
router.get('/unassigned', auth, department, getUnassigned);

// Employee details routes
router.get('/:id([0-9a-fA-F]{24})', auth, department, getEmployeeDetails);
router.get('/:id([0-9a-fA-F]{24})/stats', auth, department, getEmployeeStats);
router.get('/:id([0-9a-fA-F]{24})/activity', auth, department, getEmployeeActivity);
router.get('/:id([0-9a-fA-F]{24})/reports', auth, department, getEmployeeReports);

// Delete employee by id
router.delete('/:id([0-9a-fA-F]{24})', auth, department, deleteEmployee);



module.exports = router;
