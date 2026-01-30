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

const TeacherViewStudent = () => {

    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch();
    const { currentUser, userDetails, response, loading, error } = useSelector((state) => state.user);

    const address = "Student"
    const studentID = params.id
    const teachSubject = currentUser.teachSubject?.subName
    const teachSubjectID = currentUser.teachSubject?._id

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [subjectMarks, setSubjectMarks] = useState('');
    const [subjectAttendance, setSubjectAttendance] = useState([]);

    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    useEffect(() => {
        if (userDetails) {
            setSclassName(userDetails.sclassName || '');
            setStudentSchool(userDetails.school || '');
            setSubjectMarks(userDetails.examResult || '');
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
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
                    Lớp: {sclassName.sclassName}
                    <br />
                    Trường: {studentSchool.schoolName}
                    <br /><br />

                    <h3>Chuyên cần:</h3>
                    {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0
                        &&
                        <>
                            {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                                if (subName === teachSubject) {
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
                        onClick={() =>
                            navigate(
                                `/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`
                            )
                        }
                    >
                        Thêm điểm danh
                    </Button>
                    <br /><br /><br />
                    <h3>Điểm môn học:</h3>

                    {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 &&
                        <>
                            {subjectMarks.map((result, index) => {
                                if (result.subName.subName === teachSubject) {
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
                        onClick={() =>
                            navigate(
                                `/Teacher/class/student/marks/${studentID}/${teachSubjectID}`
                            )}>
                        Thêm điểm
                    </PurpleButton>
                    <br /><br /><br />
                </div>
            }
        </>
    )
}

export default TeacherViewStudent
