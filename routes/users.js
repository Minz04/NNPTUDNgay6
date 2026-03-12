const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /users (Chỉ lấy user chưa xoá mềm)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).populate('role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /users
router.post('/', async (req, res) => {
  try {
    // Dùng trực tiếp req.body để lấy được cả username, password thay vì chỉ name, email
    const user = new User(req.body); 
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /users/:id
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true });
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /users/:id (Xoá mềm)
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, message: "Đã xoá mềm User thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /users/enable (Yêu cầu 2: Chuyển status về true)
router.post('/enable', async (req, res) => {
  try {
    const { email, username } = req.body;
    const user = await User.findOneAndUpdate(
        { email: email, username: username, isDeleted: false }, 
        { status: true }, 
        { new: true }
    );
    if (!user) return res.status(404).json({ error: "Thông tin không khớp hoặc user không tồn tại" });
    res.json({ success: true, message: "Đã bật Status = TRUE", user: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /users/disable (Yêu cầu 3: Chuyển status về false)
router.post('/disable', async (req, res) => {
  try {
    const { email, username } = req.body;
    const user = await User.findOneAndUpdate(
        { email: email, username: username, isDeleted: false }, 
        { status: false }, 
        { new: true }
    );
    if (!user) return res.status(404).json({ error: "Thông tin không khớp hoặc user không tồn tại" });
    res.json({ success: true, message: "Đã tắt Status = FALSE", user: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;