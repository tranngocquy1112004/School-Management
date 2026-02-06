const Student = require('../models/studentSchema');
const Teacher = require('../models/teacherSchema');
const Role = require('../models/roleSchema');

const authorize = (roles = []) => {
    // roles can be string or array
    if (typeof roles === 'string') roles = [roles];

    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });

        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: insufficient role' });
        }

        next();
    };
}

const requirePermission = (resource, action) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });

        try {
            const roleName = req.user.role;
            const roleDoc = await Role.findOne({ name: roleName }).lean();
            if (!roleDoc) {
                return res.status(403).json({ message: 'Forbidden: role not found' });
            }

            const perm = (roleDoc.permissions || []).find(
                (p) => p.resource === resource && p.action === action
            );

            if (!perm) {
                return res.status(403).json({ message: 'Forbidden: insufficient permission' });
            }

            req.permission = perm;
            req.allowedFields = perm.fields || [];
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Permission check failed' });
        }
    };
};

const isAdminOfSchool = (user, schoolId) => {
    return user && user.role === 'Admin' && user.schoolId && user.schoolId.toString() === schoolId.toString();
}

const isTeacherOfStudent = async (user, studentId) => {
    if (!user || user.role !== 'Teacher') return false;
    const student = await Student.findById(studentId).select('sclassName sclassNames school');
    if (!student) return false;
    if (!user.schoolId || !student.school) return false;
    if (!user.teachSclass) return false;
    const classId = user.teachSclass.toString();
    const primary = student.sclassName && student.sclassName.toString() === classId;
    const list = Array.isArray(student.sclassNames) && student.sclassNames.some((id) => id.toString() === classId);
    return user.schoolId.toString() === student.school.toString() && (primary || list);
}

const isTeacherOfClass = (user, classId) => {
    if (!user || user.role !== 'Teacher') return false;
    return user.teachSclass && user.teachSclass.toString() === classId.toString();
}

module.exports = { authorize, requirePermission, isAdminOfSchool, isTeacherOfStudent, isTeacherOfClass };
