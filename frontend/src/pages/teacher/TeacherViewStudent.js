import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Collapse, Table, TableBody, TableHead, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart'
import { PurpleButton } from '../../components/buttonStyles';
import { StyledTableCell, StyledTableRow } from '../../components/styles';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';

const TeacherViewStudent = () => {

    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch();
    const { currentUser, userDetails, response, loading, error } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);

    const address = "Student"
    const studentID = params.id
    const teachSubjects = Array.isArray(currentUser.teachSubject)
        ? currentUser.teachSubject
        : (currentUser.teachSubject ? [currentUser.teachSubject] : []);
    const [selectedSubjectId, setSelectedSubjectId] = useState(teachSubjects[0]?._id || "");
    const selectedSubject = teachSubjects.find((s) => s._id === selectedSubjectId) || teachSubjects[0];
    const teachSubject = selectedSubject?.subName
    const teachSubjectID = selectedSubject?._id

    useEffect(() => {
        if (!selectedSubjectId && teachSubjects.length > 0) {
            setSelectedSubjectId(teachSubjects[0]._id);
        }
    }, [teachSubjects, selectedSubjectId]);

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [subjectMarks, setSubjectMarks] = useState([]);
    const [subjectAttendance, setSubjectAttendance] = useState([]);

    const [selectedClassId, setSelectedClassId] = useState('');
    const studentClasses = Array.isArray(userDetails?.sclassNames)
        ? userDetails.sclassNames
        : (userDetails?.sclassName ? [userDetails.sclassName] : []);
    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    useEffect(() => {
        if (userDetails) {
            const classes = Array.isArray(userDetails.sclassNames)
                ? userDetails.sclassNames
                : (userDetails.sclassName ? [userDetails.sclassName] : []);
            if (classes.length > 0) {
                setSelectedClassId((prev) => prev || classes[0]._id);
            }
        }
    }, [userDetails]);

    useEffect(() => {
        if (selectedClassId) {
            dispatch(getSubjectList(selectedClassId, "ClassSubjects"));
        }
    }, [dispatch, selectedClassId]);
    useEffect(() => {
        if (userDetails) {
            setSclassName(userDetails.sclassName || '');
            setStudentSchool(userDetails.school || '');
            setSubjectMarks(userDetails.examResult || '');
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const allowedSubjectIds = Array.isArray(subjectsList)
        ? new Set(subjectsList.map((s) => s._id))
        : new Set();
    const filteredAttendanceByClass = allowedSubjectIds.size > 0
        ? subjectAttendance.filter((a) => a.subName && allowedSubjectIds.has(a.subName._id))
        : subjectAttendance;
    const filteredMarksByClass = Array.isArray(subjectMarks)
        ? (allowedSubjectIds.size > 0
            ? subjectMarks.filter((m) => m.subName && allowedSubjectIds.has(m.subName._id))
            : subjectMarks)
        : []; 

    const filteredAttendance = selectedSubjectId
        ? filteredAttendanceByClass.filter((a) => a.subName && a.subName._id === selectedSubjectId)
        : filteredAttendanceByClass;
    const overallAttendancePercentage = calculateOverallAttendancePercentage(filteredAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Có mặt', value: overallAttendancePercentage },
        { name: 'Vắng', value: overallAbsentPercentage }
    ];

    return (
        <>
            {loading
                ?
                <>
                <div>Đang tải...</div>
                </>
                :
                <div>
                    Họ tên: {userDetails.name}
                    <br />
                    Số báo danh: {userDetails.rollNum}
                    <br />
                    Classes: {studentClasses.map((c) => c.sclassName).join(', ')}
                    {studentClasses.length > 1 && (
                        <Box sx={{ marginBottom: 2 }}>
                            <select
                                className="registerInput"
                                value={selectedClassId}
                                onChange={(event) => setSelectedClassId(event.target.value)}
                            >
                                {studentClasses.map((c) => (
                                    <option key={c._id} value={c._id}>{c.sclassName}</option>
                                ))}
                            </select>
                        </Box>
                    )}
                    <br />
                    Trường: {studentSchool.schoolName}
                    <br /><br />

                    {teachSubjects.length > 0 && (
                        <Box sx={{ marginBottom: 2 }}>
                            <select
                                className="registerInput"
                                value={selectedSubjectId}
                                onChange={(event) => setSelectedSubjectId(event.target.value)}
                            >
                                {teachSubjects.map((subject) => (
                                    <option key={subject._id} value={subject._id}>
                                        {subject.subName}
                                    </option>
                                ))}
                            </select>
                        </Box>
                    )}


                    <h3>Chuyên cần:</h3>
                    {filteredAttendance && Array.isArray(filteredAttendance) && filteredAttendance.length > 0
                        &&
                        <>
                            {Object.entries(groupAttendanceBySubject(filteredAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                                if (!teachSubjectID || subId === teachSubjectID) {
                                    const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);

                                    return (
                                        <Table key={index}>
                                            <TableHead>
                                                <StyledTableRow>
                                                <StyledTableCell>Môn học</StyledTableCell>
                                                <StyledTableCell>Có mặt</StyledTableCell>
                                                <StyledTableCell>Tổng buổi</StyledTableCell>
                                                <StyledTableCell>Tỉ lệ chuyên cần</StyledTableCell>
                                                <StyledTableCell align="center">Thao tác</StyledTableCell>
                                                </StyledTableRow>
                                            </TableHead>

                                            <TableBody>
                                                <StyledTableRow>
                                                    <StyledTableCell>{subName}</StyledTableCell>
                                                    <StyledTableCell>{present}</StyledTableCell>
                                                    <StyledTableCell>{sessions}</StyledTableCell>
                                                    <StyledTableCell>{subjectAttendancePercentage}%</StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Button variant="contained" onClick={() => handleOpen(subId)}>
                                                            {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}Chi tiết
                                                        </Button>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                                <StyledTableRow>
                                                    <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                        <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                            <Box sx={{ margin: 1 }}>
                                                                <Typography variant="h6" gutterBottom component="div">
                                                                    Chi tiết điểm danh
                                                                </Typography>
                                                                <Table size="small" aria-label="purchases">
                                                                    <TableHead>
                                                                        <StyledTableRow>
                                                                        <StyledTableCell>Ngày</StyledTableCell>
                                                                        <StyledTableCell align="right">Trạng thái</StyledTableCell>
                                                                        </StyledTableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {allData.map((data, index) => {
                                                                            const date = new Date(data.date);
                                                                            const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Ngày không hợp lệ";
                                                                            return (
                                                                            <StyledTableRow key={index}>
                                                                                <StyledTableCell component="th" scope="row">
                                                                                    {dateString}
                                                                                </StyledTableCell>
                                                                                <StyledTableCell align="right">
                                                                                    {data.status === "Present" ? "Có mặt" : "Vắng"}
                                                                                </StyledTableCell>
                                                                            </StyledTableRow>
                                                                            );
                                                                        })}
                                                                    </TableBody>
                                                                </Table>
                                                            </Box>
                                                        </Collapse>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            </TableBody>
                                        </Table>
                                    )
                                }
                                else {
                                    return null
                                }
                            })}
                            <div>
                                Tỉ lệ chuyên cần tổng: {overallAttendancePercentage.toFixed(2)}%
                            </div>

                            <CustomPieChart data={chartData} />
                        </>
                    }
                    <br /><br />
                    <Button
                        variant="contained"
                        disabled={!selectedSubjectId}
                        onClick={() => {
                            if (!selectedSubjectId) return;
                            navigate(
                                `/Teacher/class/student/attendance/${studentID}/${selectedSubjectId}`
                            )
                        }}
                    >
                        Thêm điểm danh
                    </Button>
                    <br /><br /><br />
                    <h3>Điểm môn học:</h3>

                    {filteredMarksByClass && Array.isArray(filteredMarksByClass) && filteredMarksByClass.length > 0 &&
                        <>
                            {filteredMarksByClass.map((result, index) => {
                                if (!teachSubjectID || result.subName._id === teachSubjectID) {
                                    return (
                                        <Table key={index}>
                                            <TableHead>
                                                <StyledTableRow>
                                                <StyledTableCell>Môn học</StyledTableCell>
                                                <StyledTableCell>Điểm</StyledTableCell>
                                                </StyledTableRow>
                                            </TableHead>
                                            <TableBody>
                                                <StyledTableRow>
                                                    <StyledTableCell>{result.subName.subName}</StyledTableCell>
                                                    <StyledTableCell>{result.marksObtained}</StyledTableCell>
                                                </StyledTableRow>
                                            </TableBody>
                                        </Table>
                                    )
                                }
                                else if (!result.subName || !result.marksObtained) {
                                    return null;
                                }
                                return null
                            })}
                        </>
                    }
                    <PurpleButton variant="contained"
                        disabled={!selectedSubjectId}
                        onClick={() => {
                            if (!selectedSubjectId) return;
                            navigate(
                                `/Teacher/class/student/marks/${studentID}/${selectedSubjectId}`
                            )
                        }}>
                        Thêm điểm
                    </PurpleButton>
                    <br /><br /><br />
                </div>
            }
        </>
    )
}

export default TeacherViewStudent
