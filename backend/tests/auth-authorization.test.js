const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

let app;
let mongoServer;

const Admin = require('../models/adminSchema');
const Teacher = require('../models/teacherSchema');
const Student = require('../models/studentSchema');
const Sclass = require('../models/sclassSchema');

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    app = require('../index');
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await Admin.deleteMany({});
    await Teacher.deleteMany({});
    await Student.deleteMany({});
    await Sclass.deleteMany({});
});

const secret = process.env.SECRET_KEY || 'secret_key_default';

describe('Auth & Authorization for updating student', () => {
    test('Admin can update student name', async () => {
        const admin = await Admin.create({ name: 'A', email: 'a@x.com', password: 'pass', schoolName: 'SchoolA' });
        const sclass = await Sclass.create({ sclassName: '10A', school: admin._id });
        const student = await Student.create({ name: 'OldName', rollNum: 1, password: 'p', sclassName: sclass._id, school: admin._id });

        const token = jwt.sign({ id: admin._id, role: admin.role, schoolId: admin._id }, secret);

        const res = await request(app).put(`/Student/${student._id}`).set('Authorization', `Bearer ${token}`).send({ name: 'NewName' });
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('NewName');
    });

    test('Teacher (owner) can update student name', async () => {
        const admin = await Admin.create({ name: 'A', email: 'a@x.com', password: 'pass', schoolName: 'SchoolA' });
        const sclass = await Sclass.create({ sclassName: '10A', school: admin._id });
        const teacher = await Teacher.create({ name: 'T', email: 't@x.com', password: 'p', school: admin._id, teachSclass: sclass._id });
        const student = await Student.create({ name: 'OldName', rollNum: 1, password: 'p', sclassName: sclass._id, school: admin._id });

        const token = jwt.sign({ id: teacher._id, role: teacher.role, schoolId: admin._id, teachSclass: sclass._id }, secret);

        const res = await request(app).put(`/Student/${student._id}`).set('Authorization', `Bearer ${token}`).send({ name: 'NewNameByTeacher' });
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('NewNameByTeacher');
    });

    test('Teacher (not owner) cannot update student', async () => {
        const admin = await Admin.create({ name: 'A', email: 'a@x.com', password: 'pass', schoolName: 'SchoolA' });
        const sclass1 = await Sclass.create({ sclassName: '10A', school: admin._id });
        const sclass2 = await Sclass.create({ sclassName: '10B', school: admin._id });
        const teacher = await Teacher.create({ name: 'T', email: 't@x.com', password: 'p', school: admin._id, teachSclass: sclass2._id });
        const student = await Student.create({ name: 'OldName', rollNum: 1, password: 'p', sclassName: sclass1._id, school: admin._id });

        const token = jwt.sign({ id: teacher._id, role: teacher.role, schoolId: admin._id, teachSclass: sclass2._id }, secret);

        const res = await request(app).put(`/Student/${student._id}`).set('Authorization', `Bearer ${token}`).send({ name: 'ShouldNotChange' });
        expect(res.status).toBe(403);
    });

    test('Unauthenticated cannot update student', async () => {
        const admin = await Admin.create({ name: 'A', email: 'a@x.com', password: 'pass', schoolName: 'SchoolA' });
        const sclass = await Sclass.create({ sclassName: '10A', school: admin._id });
        const student = await Student.create({ name: 'OldName', rollNum: 1, password: 'p', sclassName: sclass._id, school: admin._id });

        const res = await request(app).put(`/Student/${student._id}`).send({ name: 'NoAuth' });
        expect(res.status).toBe(401);
    });
});