require('dotenv').config();
const mongoose = require('mongoose');

const Admin = require('../models/adminSchema');
const Student = require('../models/studentSchema');
const Teacher = require('../models/teacherSchema');
const Subject = require('../models/subjectSchema');
const Sclass = require('../models/sclassSchema');
const Notice = require('../models/noticeSchema');
const Complain = require('../models/complainSchema');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/school_db';

async function run() {
  try {
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to', MONGO_URL);

    const collections = [
      { name: 'admins', model: Admin },
      { name: 'students', model: Student },
      { name: 'teachers', model: Teacher },
      { name: 'subjects', model: Subject },
      { name: 'sclasses', model: Sclass },
      { name: 'notices', model: Notice },
      { name: 'complains', model: Complain },
    ];

    for (const c of collections) {
      try {
        const count = await c.model.countDocuments();
        console.log(`\nCollection: ${c.name} — count: ${count}`);
        if (count > 0) {
          const docs = await c.model.find().limit(3).lean();
          console.log('Samples:', JSON.stringify(docs, null, 2));
        }
      } catch (err) {
        console.error(`Error reading ${c.name}:`, err.message);
      }
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
}

run();
