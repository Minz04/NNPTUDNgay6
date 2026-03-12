const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const User = require('../models/User');

// Create role
router.post('/', async (req, res) => {
    try {
        const role = await Role.create(req.body);
        res.status(201).json(role);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// Get all roles (exclude deleted)
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find({ isDeleted: false });
        res.json(roles);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get role by id
router.get('/:id', async (req, res) => {
    try {
        const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) return res.status(404).json({ error: 'Not found' });
        res.json(role);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update role
router.put('/:id', async (req, res) => {
    try {
        const role = await Role.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true });
        if (!role) return res.status(404).json({ error: 'Not found' });
        res.json(role);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// Soft delete role
router.delete('/:id', async (req, res) => {
    try {
        const role = await Role.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });
        if (!role) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true, message: "Đã xoá mềm Role thành công" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get users by role id (Yêu cầu 4)
router.get('/:id/users', async (req, res) => {
    try {
        const users = await User.find({ role: req.params.id, isDeleted: false });
        res.json(users);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;