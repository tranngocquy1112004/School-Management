const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');

const teacherRegister = async (req, res) => {
    const { name, email, password, role, school, teachSubject, teachSclass } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const teachSubjects = Array.isArray(teachSubject)
            ? teachSubject.filter(Boolean)
            : (teachSubject ? [teachSubject] : []);

        const teacher = new Teacher({ name, email, password: hashedPass, role, school, teachSubject: teachSubjects, teachSclass });

        const existingTeacherByEmail = await Teacher.findOne({ email });

        if (existingTeacherByEmail) {
            res.send({ message: 'Email đã tồn tại' });
        }
        else {
            let result = await teacher.save();
            if (teachSubjects.length > 0) {
                await Subject.updateMany(
                    { _id: { $in: teachSubjects } },
                    { teacher: teacher._id }
                );
            }
            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const teacherLogIn = async (req, res) => {
    try {
        let teacher = await Teacher.findOne({ email: req.body.email });
        if (teacher) {
            const validated = await bcrypt.compare(req.body.password, teacher.password);
            if (validated) {
                teacher = await teacher.populate("teachSubject", "subName sessions")
                teacher = await teacher.populate("school", "schoolName")
                teacher = await teacher.populate("teachSclass", "sclassName")
                teacher.password = undefined;
                const jwt = require('jsonwebtoken');
                const secret = process.env.SECRET_KEY || 'secret_key_default';
                const token = jwt.sign({ id: teacher._id, role: teacher.role, schoolId: teacher.school, teachSclass: teacher.teachSclass }, secret, { expiresIn: '8h' });
                res.cookie('token', token, {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 8 * 60 * 60 * 1000
                });
                res.send({ teacher, token });
            } else {
                res.status(400).send({ message: "Mật khẩu không đúng" });
            }
        } else {
            res.status(404).send({ message: "Không tìm thấy giáo viên" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeachers = async (req, res) => {
    try {
        let teachers = await Teacher.find({ school: req.params.id })
            .populate("teachSubject", "subName")
            .populate("teachSclass", "sclassName");
        if (teachers.length > 0) {
            let modifiedTeachers = teachers.map((teacher) => {
                return { ...teacher._doc, password: undefined };
            });
            res.send(modifiedTeachers);
        } else {
            res.send({ message: "Không tìm thấy giáo viên" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeacherDetail = async (req, res) => {
    try {
        let teacher = await Teacher.findById(req.params.id)
            .populate("teachSubject", "subName sessions")
            .populate("school", "schoolName")
            .populate("teachSclass", "sclassName")
        if (teacher) {
            teacher.password = undefined;
            res.send(teacher);
        }
        else {
            res.send({ message: "Không tìm thấy giáo viên" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateTeacherSubject = async (req, res) => {
    const { teacherId, teachSubject } = req.body;
    try {
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) return res.status(404).send({ message: 'KhÃ´ng tÃ¬m tháº¥y giÃ¡o viÃªn' });

        const currentSubjects = Array.isArray(teacher.teachSubject)
            ? teacher.teachSubject
            : (teacher.teachSubject ? [teacher.teachSubject] : []);

        const exists = currentSubjects.some((id) => id.toString() === teachSubject.toString());
        if (!exists) {
            currentSubjects.push(teachSubject);
            teacher.teachSubject = currentSubjects;
            await teacher.save();
        }

        await Subject.findByIdAndUpdate(teachSubject, { teacher: teacher._id });

        const updatedTeacher = await Teacher.findById(teacherId).populate("teachSubject", "subName sessions");
        res.send(updatedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateTeacher = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).send({ message: 'Unauthenticated' });
        const teacherId = req.params.id;

        // Admin can update name, email, teachSclass; Teacher can update own name
        let allowedFields = Array.isArray(req.allowedFields) && req.allowedFields.length > 0 ? req.allowedFields : [];
        if (allowedFields.length === 0) {
            if (user.role === 'Admin') {
                allowedFields = ['name', 'email', 'teachSclass'];
            } else if (user.role === 'Teacher') {
                if (user.id !== teacherId) return res.status(403).send({ message: 'Forbidden' });
                allowedFields = ['name'];
            } else {
                return res.status(403).send({ message: 'Forbidden' });
            }
        } else {
            if (user.role === 'Teacher' && user.id !== teacherId) return res.status(403).send({ message: 'Forbidden' });
            if (user.role !== 'Admin' && user.role !== 'Teacher') return res.status(403).send({ message: 'Forbidden' });
        }

        const update = {};
        for (let key of Object.keys(req.body)) {
            if (allowedFields.includes(key)) update[key] = req.body[key];
        }

        if (Object.keys(update).length === 0) return res.status(400).send({ message: 'No valid fields to update' });

        // audit
        update.updatedBy = user.id;
        update.updatedByModel = user.role === 'Admin' ? 'admin' : 'teacher';

        // if updating email check uniqueness
        if (update.email) {
            const existing = await Teacher.findOne({ email: update.email, _id: { $ne: teacherId } });
            if (existing) return res.status(400).send({ message: 'Email đã tồn tại' });
        }

        const result = await Teacher.findByIdAndUpdate(teacherId, { $set: update }, { new: true });
        if (!result) return res.status(404).send({ message: 'Không tìm thấy giáo viên' });
        result.password = undefined;
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};



const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

        if (!deletedTeacher) {
            return res.send({ message: "Không tìm thấy giáo viên" });
        }

        await Subject.updateMany(
            { teacher: deletedTeacher._id },
            { $unset: { teacher: 1 } }
        );

        res.send(deletedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find({ school: req.params.id }, "_id");
        const teacherIds = teachers.map((teacher) => teacher._id);

        const deletionResult = await Teacher.deleteMany({ school: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "Không có giáo viên để xóa" });
            return;
        }

        if (teacherIds.length > 0) {
            await Subject.updateMany(
                { teacher: { $in: teacherIds } },
                { $unset: { teacher: 1 } }
            );
        }

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachersByClass = async (req, res) => {
    try {
        const teachers = await Teacher.find({ teachSclass: req.params.id }, "_id");
        const teacherIds = teachers.map((teacher) => teacher._id);

        const deletionResult = await Teacher.deleteMany({ teachSclass: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "Không có giáo viên để xóa" });
            return;
        }

        if (teacherIds.length > 0) {
            await Subject.updateMany(
                { teacher: { $in: teacherIds } },
                { $unset: { teacher: 1 } }
            );
        }

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const teacherAttendance = async (req, res) => {
    const { status, date } = req.body;

    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.send({ message: 'Không tìm thấy giáo viên' });
        }

        const existingAttendance = teacher.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString()
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            teacher.attendance.push({ date, status });
        }

        const result = await teacher.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error)
    }
};

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherSubject,
    updateTeacher,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass,
    teacherAttendance
};
