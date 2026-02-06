const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');

const sclassCreate = async (req, res) => {
    try {
        const sclass = new Sclass({
            sclassName: req.body.sclassName,
            school: req.body.adminID
        });

        const existingSclassByName = await Sclass.findOne({
            sclassName: req.body.sclassName,
            school: req.body.adminID
        });

        if (existingSclassByName) {
            res.send({ message: 'Tên lớp đã tồn tại' });
        }
        else {
            const result = await sclass.save();
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const sclassList = async (req, res) => {
    try {
        let sclasses = await Sclass.find({ school: req.params.id })
        if (sclasses.length > 0) {
            res.send(sclasses)
        } else {
            res.send({ message: "Không tìm thấy lớp" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getSclassDetail = async (req, res) => {
    try {
        let sclass = await Sclass.findById(req.params.id);
        if (sclass) {
            sclass = await sclass.populate("school", "schoolName")
            res.send(sclass);
        }
        else {
            res.send({ message: "Không tìm thấy lớp" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const getSclassStudents = async (req, res) => {
    try {
        let students = await Student.find({ $or: [{ sclassName: req.params.id }, { sclassNames: req.params.id }] })
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.send(modifiedStudents);
        } else {
            res.send({ message: "Không tìm thấy học sinh" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateSclass = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).send({ message: 'Unauthenticated' });
        const classId = req.params.id;

        // Only Admin or Teacher of this class can update name
        if (user.role === 'Teacher') {
            if (!user.teachSclass || user.teachSclass.toString() !== classId.toString()) return res.status(403).send({ message: 'Forbidden' });
        } else if (user.role !== 'Admin') {
            return res.status(403).send({ message: 'Forbidden' });
        }

        const { sclassName } = req.body;
        if (!sclassName) return res.status(400).send({ message: 'sclassName required' });

        // uniqueness within school
        const existing = await Sclass.findOne({ sclassName, school: user.schoolId, _id: { $ne: classId } });
        if (existing) return res.status(400).send({ message: 'Tên lớp đã tồn tại' });

        const update = { sclassName, updatedBy: user.id, updatedByModel: user.role === 'Admin' ? 'admin' : 'teacher' };

        const result = await Sclass.findByIdAndUpdate(classId, { $set: update }, { new: true });
        if (!result) return res.status(404).send({ message: 'Không tìm thấy lớp' });

        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteSclass = async (req, res) => {
    try {
        const deletedClass = await Sclass.findByIdAndDelete(req.params.id);
        if (!deletedClass) {
            return res.send({ message: "Class not found" });
        }

        const classId = req.params.id;
        const students = await Student.find({
            $or: [
                { sclassName: classId },
                { sclassNames: classId }
            ]
        });

        for (const student of students) {
            const current = Array.isArray(student.sclassNames) ? student.sclassNames : [];
            const filtered = current.filter((id) => id.toString() !== classId.toString());
            if (filtered.length === 0) {
                await Student.deleteOne({ _id: student._id });
                continue;
            }
            student.sclassNames = filtered;
            if (student.sclassName && student.sclassName.toString() === classId.toString()) {
                student.sclassName = filtered[0];
            }
            await student.save();
        }

        const deletedSubjects = await Subject.deleteMany({ sclassName: req.params.id });
        const deletedTeachers = await Teacher.deleteMany({ teachSclass: req.params.id });
        res.send(deletedClass);
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteSclasses = async (req, res) => {
    try {
        const deletedClasses = await Sclass.deleteMany({ school: req.params.id });
        if (deletedClasses.deletedCount === 0) {
            return res.send({ message: "Không có lớp để xóa" });
        }
        const deletedStudents = await Student.deleteMany({ school: req.params.id });
        const deletedSubjects = await Subject.deleteMany({ school: req.params.id });
        const deletedTeachers = await Teacher.deleteMany({ school: req.params.id });
        res.send(deletedClasses);
    } catch (error) {
        res.status(500).json(error);
    }
}


module.exports = { sclassCreate, sclassList, updateSclass, deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents };
