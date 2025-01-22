const express = require('express');
const { createRole, getRoles, getRoleById, updateRole, deleteRole } = require('../controllers/role.controller');
const router = express.Router();

router.route('/createRole').post(createRole);
router.route('/getRoles').get(getRoles);

router.route('/getRoleId/:id').get(getRoleById).put(updateRole).delete(deleteRole);

module.exports = router;


