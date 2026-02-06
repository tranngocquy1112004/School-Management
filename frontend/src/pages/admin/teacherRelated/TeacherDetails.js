import React, { useEffect, useState } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Typography, Collapse } from '@mui/material';
import { updateUser } from '../../../redux/userRelated/userHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails, error } = useSelector((state) => state.teacher);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector((state) => state.user);

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
        if (currentUser?._id) {
            dispatch(getAllSclasses(currentUser._id, "Sclass"));
        }
    }, [dispatch, teacherID, currentUser]);

    if (error) {
        console.log(error);
    }

    const teachSubjects = Array.isArray(teacherDetails?.teachSubject)
        ? teacherDetails.teachSubject
        : (teacherDetails?.teachSubject ? [teacherDetails.teachSubject] : []);
    const hasSubjects = teachSubjects.length > 0;

    const [showEdit, setShowEdit] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [teachSclass, setTeachSclass] = useState('');

    useEffect(() => {
        if (teacherDetails) {
            setName(teacherDetails.name || '');
            setEmail(teacherDetails.email || '');
            setTeachSclass(teacherDetails.teachSclass?._id || '');
        }
    }, [teacherDetails]);

    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(updateUser({ name, email, teachSclass }, teacherID, "Teacher"))
            .then(() => dispatch(getTeacherDetails(teacherID)));
    };

    const handleAddSubject = () => {
        navigate(`/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`);
    };

    return (
        <>
            {loading ? (
                <div>Đang tải...</div>
            ) : (
                <Container>
                    <Typography variant="h4" align="center" gutterBottom>
                        Chi tiết giáo viên
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Giáo viên: {teacherDetails?.name}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Lớp: {teacherDetails?.teachSclass?.sclassName}
                    </Typography>
                                        {hasSubjects && (
                        <Typography variant="h6" gutterBottom>
                            Môn học: {teachSubjects.map((s) => s.subName).join(', ')}
                        </Typography>
                    )}
                    <Button variant="contained" onClick={handleAddSubject}>
                        Thêm môn
                    </Button>
                    <Button variant="contained" onClick={() => setShowEdit(!showEdit)} sx={{ marginTop: 2 }}>
                        {showEdit ? <KeyboardArrowUp /> : <KeyboardArrowDown />} Sửa giáo viên
                    </Button>
                    <Collapse in={showEdit} timeout="auto" unmountOnExit>
                        <div className="register">
                            <form className="registerForm" onSubmit={submitHandler}>
                                <span className="registerTitle">Cập nhật giáo viên</span>
                                <label>Tên</label>
                                <input
                                    className="registerInput"
                                    type="text"
                                    placeholder="Enter name..."
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    required
                                />

                                <label>Email</label>
                                <input
                                    className="registerInput"
                                    type="email"
                                    placeholder="Enter email..."
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                />

                                <label>Lớp</label>
                                <select
                                    className="registerInput"
                                    value={teachSclass}
                                    onChange={(event) => setTeachSclass(event.target.value)}
                                    required
                                >
                                    <option value="" disabled>Chọn lớp</option>
                                    {Array.isArray(sclassesList) && sclassesList.map((sclass) => (
                                        <option key={sclass._id} value={sclass._id}>
                                            {sclass.sclassName}
                                        </option>
                                    ))}
                                </select>

                                <button className="registerButton" type="submit">Cập nhật</button>
                            </form>
                        </div>
                    </Collapse>
                </Container>
            )}
        </>
    );
};

export default TeacherDetails;


