require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// MONGO_URI read from .env if set
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/NNPTUDNgay6';
mongoose.connect(MONGO_URI)
	.then(()=> console.log('MongoDB connected'))
	.catch(err=> console.error('MongoDB error', err));

app.use('/users', require('./routes/users'));
app.use('/roles', require('./routes/roles'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
