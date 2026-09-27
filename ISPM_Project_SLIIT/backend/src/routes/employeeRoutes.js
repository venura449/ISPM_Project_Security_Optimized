const express = require('express');
const EmployeeController = require('../controllers/employee/EmployeeController');
const { authMiddleware, requireAdminUser } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

// Create a new employee (admin only)
router.post('/', requireAdminUser, EmployeeController.createEmployee);

// Get all employees (authenticated; role-based field filtering applied in controller)
router.get('/', EmployeeController.getAllEmployees);

// Get next available employee ID (admin only)
router.get('/next-id', requireAdminUser, EmployeeController.getNextEmployeeId);

// Get employees by status
router.get('/status/:status', EmployeeController.getByStatus);

// Get employees by department
router.get('/department/:department', EmployeeController.getByDepartment);

// Get employee by ID with full profile
router.get('/:id', EmployeeController.getEmployeeById);

// Update employee information (admin only)
router.put('/:id', requireAdminUser, EmployeeController.updateEmployee);

// Update employee status (admin only)
router.patch('/:id/status', requireAdminUser, EmployeeController.updateEmployeeStatus);

// Upload employee document (admin only)
router.post('/:id/documents', requireAdminUser, EmployeeController.uploadDocument);

// Get employee documents (admin only)
router.get('/:id/documents', requireAdminUser, EmployeeController.getDocuments);

// Delete employee document (admin only)
router.delete('/:employeeId/documents/:docId', requireAdminUser, EmployeeController.deleteDocument);

// Delete employee (admin only)
router.delete('/:id', requireAdminUser, EmployeeController.deleteEmployee);

module.exports = router;
