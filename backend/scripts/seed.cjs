require('dotenv').config();
const mongoose = require('mongoose');

const Admin = require('../models/adminSchema');
const Student = require('../models/studentSchema');
const Teacher = require('../models/teacherSchema');
const Subject = require('../models/subjectSchema');
const Sclass = require('../models/sclassSchema');
const Notice = require('../models/noticeSchema');
const Complain = require('../models/complainSchema');
const Role = require('../models/roleSchema');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/school_db';

async function seed() {
  try {
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to', MONGO_URL);

    const roleSeed = [
      {
        name: 'Admin',
        permissions: [
          { resource: 'Teacher', action: 'update', fields: ['name', 'email', 'teachSclass'] },
          { resource: 'Teacher', action: 'updateSubject', fields: ['teachSubject'] },
          { resource: 'Student', action: 'update', fields: ['name', 'rollNum', 'sclassName', 'sclassNames', 'password'] },
          { resource: 'Sclass', action: 'update', fields: ['sclassName'] },
          { resource: 'Subject', action: 'update', fields: ['subName', 'subCode', 'sessions'] }
        ]
      },
      {
        name: 'Teacher',
        permissions: [
          { resource: 'Teacher', action: 'update', fields: ['name'] },
          { resource: 'Student', action: 'update', fields: ['name'] },
          { resource: 'Sclass', action: 'update', fields: ['sclassName'] }
        ]
      },
      {
        name: 'Student',
        permissions: [
          { resource: 'Student', action: 'update', fields: ['name', 'password'] }
        ]
      }
    ];

    // If database already has an admin and SEED_FORCE is not set, only upsert roles
    const existingAdmins = await Admin.countDocuments();
    if (existingAdmins > 0 && process.env.SEED_FORCE !== 'true') {
      for (const role of roleSeed) {
        await Role.updateOne({ name: role.name }, { $set: role }, { upsert: true });
      }
      console.log(`DB already populated (admins=${existingAdmins}). Updated roles only. Set SEED_FORCE=true to force reseed.`);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Clear existing data (will run when force-seed or DB is empty)
    await Promise.all([
      Admin.deleteMany({}),
      Student.deleteMany({}),
      Teacher.deleteMany({}),
      Subject.deleteMany({}),
      Sclass.deleteMany({}),
      Notice.deleteMany({}),
      Complain.deleteMany({}),
      Role.deleteMany({}),
    ]);
    console.log('Cleared existing collections');

    // Seed roles and permissions
    await Role.insertMany(roleSeed);

    // Create an admin (school)
    const admin = await Admin.create({
      name: 'Demo Admin',
      email: 'admin@demo.school',
      password: 'admin123',
      schoolName: 'Demo School'
    });

    // Create classes
    const class1 = await Sclass.create({ sclassName: 'Grade 1', school: admin._id });
    const class2 = await Sclass.create({ sclassName: 'Grade 2', school: admin._id });

    // Create subjects
    const math = await Subject.create({ subName: 'Mathematics', subCode: 'MATH101', sessions: '2025-2026', sclassName: class1._id, school: admin._id });
    const eng = await Subject.create({ subName: 'English', subCode: 'ENG101', sessions: '2025-2026', sclassName: class1._id, school: admin._id });
    const sci = await Subject.create({ subName: 'Science', subCode: 'SCI101', sessions: '2025-2026', sclassName: class2._id, school: admin._id });

    // Create teachers (assign to classes)
    const teacher1 = await Teacher.create({ name: 'Alice Johnson', email: 'alice@demo.school', password: 'teacher123', school: admin._id, teachSclass: class1._id });
    const teacher2 = await Teacher.create({ name: 'Bob Smith', email: 'bob@demo.school', password: 'teacher123', school: admin._id, teachSclass: class2._id });

    // Assign teacher to a subject
    math.teacher = teacher1._id;
    await math.save();
    teacher1.teachSubject = [math._id];
    await teacher1.save();

    sci.teacher = teacher2._id;
    await sci.save();
    teacher2.teachSubject = [sci._id];
    await teacher2.save();

    // Create students
    const student1 = await Student.create({ name: 'John Doe', rollNum: 1, password: 'student123', sclassName: class1._id, sclassNames: [class1._id], school: admin._id });
    const student2 = await Student.create({ name: 'Jane Roe', rollNum: 2, password: 'student123', sclassName: class1._id, sclassNames: [class1._id], school: admin._id });
    const student3 = await Student.create({ name: 'Sam Green', rollNum: 1, password: 'student123', sclassName: class2._id, sclassNames: [class2._id], school: admin._id });

    // Add a sample notice
    await Notice.create({ title: 'Welcome Back', details: 'School reopens on Monday. Please be punctual.', date: new Date(), school: admin._id });

    // Add a sample complain (from student1)
    await Complain.create({ user: student1._id, date: new Date(), complaint: 'Canteen food quality needs improvement.', school: admin._id });

    // Add a bit of attendance and exam result sample to students
    student1.attendance.push({ date: new Date(), status: 'Present', subName: math._id });
    student1.examResult.push({ subName: math._id, marksObtained: 85 });
    await student1.save();

    student2.attendance.push({ date: new Date(), status: 'Absent', subName: eng._id });
    student2.examResult.push({ subName: eng._id, marksObtained: 78 });
    await student2.save();

    console.log('Seeding completed successfully');

    // Print counts
    const counts = await Promise.all([
      Admin.countDocuments(),
      Sclass.countDocuments(),
      Subject.countDocuments(),
      Teacher.countDocuments(),
      Student.countDocuments(),
      Notice.countDocuments(),
      Complain.countDocuments(),
      Role.countDocuments()
    ]);

    console.log(`Counts: admins=${counts[0]}, sclasses=${counts[1]}, subjects=${counts[2]}, teachers=${counts[3]}, students=${counts[4]}, notices=${counts[5]}, complains=${counts[6]}, roles=${counts[7]}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
