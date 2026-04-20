const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const department = require('../middleware/department');
const {
  getReports,
  getAssignedReports,
  getEmployeePerformance
} = require('../controllers/reportsController');

// GET /api/reports
router.get('/', auth, department, getReports);

// GET /api/reports/assigned/:employeeId
router.get('/assigned/:employeeId', auth, department, getAssignedReports);

// GET /api/reports/performance/:employeeId
router.get('/performance/:employeeId', auth, department, getEmployeePerformance);

module.exports = router;
