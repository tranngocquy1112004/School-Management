const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');

const studentRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const sclassNames = Array.isArray(req.body.sclassNames)
            ? req.body.sclassNames.filter(Boolean)
            : (req.body.sclassName ? [req.body.sclassName] : []);

        if (!req.body.sclassName && sclassNames.length === 0) {
            return res.status(400).send({ message: 'sclassName required' });
        }

        const primarySclass = req.body.sclassName || sclassNames[0];

        const existingStudent = await Student.findOne({
            rollNum: req.body.rollNum,
            school: req.body.adminID,
            sclassName: primarySclass,
        });

        if (existingStudent) {
            res.send({ message: 'Số báo danh đã tồn tại' });
        }
        else {
            const student = new Student({
                ...req.body,
                sclassName: primarySclass,
                sclassNames: sclassNames.length > 0 ? sclassNames : [primarySclass],
                school: req.body.adminID,
                password: hashedPass
            });

            let result = await student.save();

            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const studentLogIn = async (req, res) => {
    try {
        let student = await Student.findOne({ rollNum: req.body.rollNum, name: req.body.studentName });
        if (student) {
            const validated = await bcrypt.compare(req.body.password, student.password);
            if (validated) {
                student = await student.populate("school", "schoolName")
                student = await student.populate("sclassName", "sclassName")
                student = await student.populate("sclassNames", "sclassName")
                student.password = undefined;
                student.examResult = undefined;
                student.attendance = undefined;
                const jwt = require('jsonwebtoken');
                const secret = process.env.SECRET_KEY || 'secret_key_default';
                const token = jwt.sign({ id: student._id, role: student.role, schoolId: student.school, sclassId: student.sclassName }, secret, { expiresIn: '8h' });
                res.cookie('token', token, {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 8 * 60 * 60 * 1000
                });
                res.send({ student, token });
            } else {
                res.status(400).send({ message: "Mật khẩu không đúng" });
            }
        } else {
            res.status(404).send({ message: "Không tìm thấy học sinh" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudents = async (req, res) => {
    try {
        let students = await Student.find({ school: req.params.id })
            .populate("sclassName", "sclassName")
            .populate("sclassNames", "sclassName");
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
};

const getStudentDetail = async (req, res) => {
    try {
        let student = await Student.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName")
            .populate("sclassNames", "sclassName")
            .populate("examResult.subName", "subName")
            .populate("attendance.subName", "subName sessions");
        if (student) {
            student.password = undefined;
            res.send(student);
        }
        else {
            res.send({ message: "Không tìm thấy học sinh" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteStudent = async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudents = async (req, res) => {
    try {
        const result = await Student.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "Không có học sinh để xóa" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudentsByClass = async (req, res) => {
    try {
        const classId = req.params.id;
        const students = await Student.find({
            $or: [
                { sclassName: classId },
                { sclassNames: classId }
            ]
        });

        if (students.length === 0) {
            return res.send({ message: "Kh??ng c?? h???c sinh ????? x??a" });
        }

        let deletedCount = 0;
        let updatedCount = 0;

        for (const student of students) {
            const current = Array.isArray(student.sclassNames) ? student.sclassNames : [];
            const filtered = current.filter((id) => id.toString() !== classId.toString());

            if (filtered.length === 0) {
                await Student.deleteOne({ _id: student._id });
                deletedCount += 1;
                continue;
            }

            student.sclassNames = filtered;
            if (student.sclassName && student.sclassName.toString() === classId.toString()) {
                student.sclassName = filtered[0];
            }
            await student.save();
            updatedCount += 1;
        }

        res.send({ deletedCount, updatedCount });
    } catch (error) {
        res.status(500).json(error);
    }
}

const { isTeacherOfStudent } = require('../middleware/authorize');

const updateStudent = async (req, res) => {
    try {
        // Authorization: Admin can update any; Teacher can update only own students (and only allowed fields)
        const user = req.user;
        if (!user) return res.status(401).send({ message: 'Unauthenticated' });

        const studentId = req.params.id;

        // Determine allowed fields (permission-driven when available)
        let allowedFields = Array.isArray(req.allowedFields) && req.allowedFields.length > 0 ? req.allowedFields : [];
        if (allowedFields.length === 0) {
            if (user.role === 'Admin') {
                // Admin can update name, rollNum, sclassName, password (but password must be hashed)
                allowedFields = ['name', 'rollNum', 'sclassName', 'sclassNames', 'password'];
            } else if (user.role === 'Teacher') {
                // Teacher can only update name for their own students
                const ok = await isTeacherOfStudent(user, studentId);
                if (!ok) return res.status(403).send({ message: 'Forbidden' });
                allowedFields = ['name'];
            } else if (user.role === 'Student') {
                // Student can update own name and password only
                if (user.id !== studentId) return res.status(403).send({ message: 'Forbidden' });
                allowedFields = ['name', 'password'];
            } else {
                return res.status(403).send({ message: 'Forbidden' });
            }
        } else {
            if (user.role === 'Teacher') {
                const ok = await isTeacherOfStudent(user, studentId);
                if (!ok) return res.status(403).send({ message: 'Forbidden' });
            } else if (user.role === 'Student') {
                if (user.id !== studentId) return res.status(403).send({ message: 'Forbidden' });
            } else if (user.role !== 'Admin') {
                return res.status(403).send({ message: 'Forbidden' });
            }
        }

        // Filter req.body to allowed fields
        const update = {};
        for (let key of Object.keys(req.body)) {
            if (allowedFields.includes(key)) {
                update[key] = req.body[key];
            }
        }

        if (Object.keys(update).length === 0) {
            return res.status(400).send({ message: 'No valid fields to update' });
        }

        // keep sclassName and sclassNames in sync
        if (update.sclassNames) {
            const list = Array.isArray(update.sclassNames) ? update.sclassNames.filter(Boolean) : [update.sclassNames];
            if (list.length === 0) return res.status(400).send({ message: 'sclassNames required' });
            if (update.sclassName && !list.some((id) => id.toString() === update.sclassName.toString())) {
                list.push(update.sclassName);
            }
            update.sclassNames = list;
            update.sclassName = update.sclassName || list[0];
        } else if (update.sclassName) {
            update.sclassNames = [update.sclassName];
        }

        // If updating password, hash it
        if (update.password) {
            const salt = await bcrypt.genSalt(10)
            update.password = await bcrypt.hash(update.password, salt)
        }

        // If updating rollNum, ensure uniqueness within the same school
        if (update.rollNum) {
            const existing = await Student.findOne({ rollNum: update.rollNum, school: req.user.schoolId, _id: { $ne: studentId } });
            if (existing) return res.status(400).send({ message: 'Số báo danh đã tồn tại' });
        }

        // set audit
        update.updatedBy = user.id;
        if (user.role === 'Admin') update.updatedByModel = 'admin';
        else if (user.role === 'Teacher') update.updatedByModel = 'teacher';
        else if (user.role === 'Student') update.updatedByModel = 'student';

        let result = await Student.findByIdAndUpdate(studentId, { $set: update }, { new: true });
        if (!result) return res.status(404).send({ message: 'Không tìm thấy học sinh' });
        result.password = undefined;
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateExamResult = async (req, res) => {
    const { subName, marksObtained } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: 'Không tìm thấy học sinh' });
        }

        const existingResult = student.examResult.find(
            (result) => result.subName.toString() === subName
        );

        if (existingResult) {
            existingResult.marksObtained = marksObtained;
        } else {
            student.examResult.push({ subName, marksObtained });
        }

        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const studentAttendance = async (req, res) => {
    const { subName, status, date } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: 'Không tìm thấy học sinh' });
        }

        const subject = await Subject.findById(subName);

        const existingAttendance = student.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString() &&
                a.subName.toString() === subName
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            // Check if the student has already attended the maximum number of sessions
            const attendedSessions = student.attendance.filter(
                (a) => a.subName.toString() === subName
            ).length;

            if (attendedSessions >= subject.sessions) {
                return res.send({ message: 'Đã đạt giới hạn điểm danh' });
            }

            student.attendance.push({ date, status, subName });
        }

        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendanceBySubject = async (req, res) => {
    const subName = req.params.id;

    try {
        const result = await Student.updateMany(
            { 'attendance.subName': subName },
            { $pull: { attendance: { subName } } }
        );
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendance = async (req, res) => {
    const schoolId = req.params.id

    try {
        const result = await Student.updateMany(
            { school: schoolId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeStudentAttendanceBySubject = async (req, res) => {
    const studentId = req.params.id;
    const subName = req.body.subId

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $pull: { attendance: { subName: subName } } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


const removeStudentAttendance = async (req, res) => {
    const studentId = req.params.id;

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,

    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance,
};
