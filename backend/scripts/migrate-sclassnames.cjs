require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/studentSchema');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/school_db';

async function migrate() {
  try {
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to', MONGO_URL);

    const students = await Student.find({});
    let updated = 0;

    for (const student of students) {
      const current = Array.isArray(student.sclassNames) ? student.sclassNames : [];
      if (current.length === 0 && student.sclassName) {
        student.sclassNames = [student.sclassName];
        await student.save();
        updated += 1;
      }
    }

    console.log(`Updated students: ${updated}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

migrate();
