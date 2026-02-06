const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Student = require('../models/studentSchema.js');

const subjectCreate = async (req, res) => {
    try {
        const subjects = req.body.subjects.map((subject) => ({
            subName: subject.subName,
            subCode: subject.subCode,
            sessions: subject.sessions,
        }));

        const existingSubjectBySubCode = await Subject.findOne({
            'subjects.subCode': subjects[0].subCode,
            school: req.body.adminID,
        });

        if (existingSubjectBySubCode) {
            res.send({ message: 'Mã môn đã tồn tại, vui lòng chọn mã khác' });
        } else {
            const newSubjects = subjects.map((subject) => ({
                ...subject,
                sclassName: req.body.sclassName,
                school: req.body.adminID,
            }));

            const result = await Subject.insertMany(newSubjects);
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const allSubjects = async (req, res) => {
    try {
        let subjects = await Subject.find({ school: req.params.id })
            .populate("sclassName", "sclassName")
        if (subjects.length > 0) {
            res.send(subjects)
        } else {
            res.send({ message: "Không tìm thấy môn học" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const classSubjects = async (req, res) => {
    try {
        let subjects = await Subject.find({ sclassName: req.params.id })
        if (subjects.length > 0) {
            res.send(subjects)
        } else {
            res.send({ message: "Không tìm thấy môn học" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const freeSubjectList = async (req, res) => {
    try {
        let subjects = await Subject.find({ sclassName: req.params.id, teacher: { $exists: false } });
        if (subjects.length > 0) {
            res.send(subjects);
        } else {
            res.send({ message: "Không tìm thấy môn học" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getSubjectDetail = async (req, res) => {
    try {
        let subject = await Subject.findById(req.params.id);
        if (subject) {
            subject = await subject.populate("sclassName", "sclassName")
            subject = await subject.populate("teacher", "name")
            res.send(subject);
        }
        else {
            res.send({ message: "Không tìm thấy môn học" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateSubject = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).send({ message: 'Unauthenticated' });
        if (user.role !== 'Admin') return res.status(403).send({ message: 'Forbidden' });

        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).send({ message: 'Subject not found' });

        if (subject.school && user.schoolId && subject.school.toString() !== user.schoolId.toString()) {
            return res.status(403).send({ message: 'Forbidden' });
        }

        const allowedFields = Array.isArray(req.allowedFields) && req.allowedFields.length > 0
            ? req.allowedFields
            : ['subName', 'subCode', 'sessions'];
        const update = {};
        for (const key of Object.keys(req.body)) {
            if (allowedFields.includes(key)) update[key] = req.body[key];
        }
        if (Object.keys(update).length === 0) {
            return res.status(400).send({ message: 'No valid fields to update' });
        }

        if (update.subName) {
            const existingByName = await Subject.findOne({
                subName: update.subName,
                school: subject.school,
                _id: { $ne: subject._id }
            });
            if (existingByName) return res.status(400).send({ message: 'Subject name already exists' });
        }

        if (update.subCode) {
            const existingByCode = await Subject.findOne({
                subCode: update.subCode,
                school: subject.school,
                _id: { $ne: subject._id }
            });
            if (existingByCode) return res.status(400).send({ message: 'Subject code already exists' });
        }

        Object.assign(subject, update);
        const updated = await subject.save();
        res.send(updated);
    } catch (error) {
        res.status(500).json(error);
    }
};
const deleteSubject = async (req, res) => {
    try {
        const deletedSubject = await Subject.findByIdAndDelete(req.params.id);

        if (!deletedSubject) {
            return res.send({ message: "Không tìm thấy môn học" });
        }

        // Unassign this subject from teachers
        await Teacher.updateMany(
            { teachSubject: deletedSubject._id },
            { $pull: { teachSubject: deletedSubject._id } }
        );

        // Remove the objects containing the deleted subject from students' examResult array
        await Student.updateMany(
            {},
            { $pull: { examResult: { subName: deletedSubject._id } } }
        );

        // Remove the objects containing the deleted subject from students' attendance array
        await Student.updateMany(
            {},
            { $pull: { attendance: { subName: deletedSubject._id } } }
        );

        res.send(deletedSubject);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ school: req.params.id }, "_id");
        const subjectIds = subjects.map((subject) => subject._id);

        const deletedSubjects = await Subject.deleteMany({ school: req.params.id });

        if (subjectIds.length > 0) {
            // Unassign subjects from teachers
            await Teacher.updateMany(
                { teachSubject: { $in: subjectIds } },
                { $pull: { teachSubject: { $in: subjectIds } } }
            );

            // Clear examResult and attendance for students in this school
            await Student.updateMany(
                { school: req.params.id },
                { $set: { examResult: [], attendance: [] } }
            );
        }

        res.send(deletedSubjects);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteSubjectsByClass = async (req, res) => {
    try {
        const subjects = await Subject.find({ sclassName: req.params.id }, "_id");
        const subjectIds = subjects.map((subject) => subject._id);

        const deletedSubjects = await Subject.deleteMany({ sclassName: req.params.id });

        if (subjectIds.length > 0) {
            // Unassign subjects from teachers
            await Teacher.updateMany(
                { teachSubject: { $in: subjectIds } },
                { $pull: { teachSubject: { $in: subjectIds } } }
            );

            // Clear examResult and attendance for students in this class
            await Student.updateMany(
                { sclassName: req.params.id },
                { $set: { examResult: [], attendance: [] } }
            );
        }

        res.send(deletedSubjects);
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateTeacher = async (req, res) => {
    const { id } = req.params;
    const requester = req.user;
    try {
        const teacher = await Teacher.findById(id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        const update = {};

        if (requester.role === 'Admin') {
            if (req.body.name) update.name = req.body.name;
        } else if (requester.role === 'Teacher') {
            if (String(requester.id) !== String(id)) return res.status(403).json({ message: 'Forbidden' });
            if (req.body.name) update.name = req.body.name;
        } else {
            return res.status(403).json({ message: 'Forbidden' });
        }

        if (Object.keys(update).length === 0) return res.status(400).json({ message: 'No updatable fields provided' });

        update.updatedBy = requester.id;
        update.updatedByModel = requester.role.toLowerCase();

        const updated = await Teacher.findByIdAndUpdate(id, update, { new: true });
        if (updated) updated.password = undefined;
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { subjectCreate, freeSubjectList, classSubjects, getSubjectDetail, updateSubject, deleteSubjectsByClass, deleteSubjects, deleteSubject, allSubjects, updateTeacher };
