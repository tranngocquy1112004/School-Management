import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { BottomNavigation, BottomNavigationAction, Container, Paper, Table, TableBody, TableHead, Typography } from '@mui/material';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import CustomBarChart from '../../components/CustomBarChart'

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const StudentSubjects = () => {

    const dispatch = useDispatch();
    const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id])

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [subjectMarks, setSubjectMarks] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    const studentClasses = Array.isArray(userDetails?.sclassNames)
        ? userDetails.sclassNames
        : (userDetails?.sclassName ? [userDetails.sclassName] : (currentUser.sclassName ? [currentUser.sclassName] : []));
    const [selectedClassId, setSelectedClassId] = useState(currentUser.sclassName?._id || studentClasses[0]?._id || "");
    const selectedClass = studentClasses.find((c) => c._id === selectedClassId) || studentClasses[0];
    useEffect(() => {
        if (userDetails) {
            setSubjectMarks(userDetails.examResult || []);
            const classes = Array.isArray(userDetails.sclassNames)
                ? userDetails.sclassNames
                : (userDetails.sclassName ? [userDetails.sclassName] : []);
            if (classes.length > 0) {
                setSelectedClassId((prev) => prev || classes[0]._id);
            }
        }
    }, [userDetails])

    useEffect(() => {
        if (selectedClassId) {
            dispatch(getSubjectList(selectedClassId, "ClassSubjects"));
        }
    }, [dispatch, selectedClassId]);

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const allowedSubjectIds = Array.isArray(subjectsList)
        ? new Set(subjectsList.map((s) => s._id))
        : new Set();
    const filteredMarks = Array.isArray(subjectMarks)
        ? (allowedSubjectIds.size > 0
            ? subjectMarks.filter((m) => m.subName && allowedSubjectIds.has(m.subName._id))
            : subjectMarks)
        : [];

    const renderTableSection = () => {
        return (
            <>
                <Typography variant="h4" align="center" gutterBottom>
                    Điểm môn học
                </Typography>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                        <StyledTableCell>Môn học</StyledTableCell>
                        <StyledTableCell>Điểm</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMarks.map((result, index) => {
                            if (!result.subName || !result.marksObtained) {
                                return null;
                            }
                            return (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{result.subName.subName}</StyledTableCell>
                                    <StyledTableCell>{result.marksObtained}</StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </>
        );
    };

    const renderChartSection = () => {
        return <CustomBarChart chartData={filteredMarks} dataKey="marksObtained" />;
    };

    const renderClassDetailsSection = () => {
        return (
            <Container>
                {studentClasses.length > 1 && (
                    <select
                        className="registerInput"
                        value={selectedClassId}
                        onChange={(event) => setSelectedClassId(event.target.value)}
                    >
                        {studentClasses.map((c) => (
                            <option key={c._id} value={c._id}>{c.sclassName}</option>
                        ))}
                    </select>
                )}
                <Typography variant="h4" align="center" gutterBottom>
                    Thông tin lớp
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Class: {selectedClass ? selectedClass.sclassName : ''}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Danh sách môn học:
                </Typography>
                {subjectsList &&
                    subjectsList.map((subject, index) => (
                        <div key={index}>
                            <Typography variant="subtitle1">
                                {subject.subName} ({subject.subCode})
                            </Typography>
                        </div>
                    ))}
            </Container>
        );
    };

    return (
        <>
            {loading ? (
                <div>Đang tải...</div>
            ) : (
                <div>
                    {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0
                        ?
                        (<>
                            {selectedSection === 'table' && renderTableSection()}
                            {selectedSection === 'chart' && renderChartSection()}

                            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                                <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                <BottomNavigationAction
                                    label="Bảng"
                                    value="table"
                                    icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                />
                                <BottomNavigationAction
                                    label="Biểu đồ"
                                    value="chart"
                                    icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                />
                                </BottomNavigation>
                            </Paper>
                        </>)
                        :
                        (<>
                            {renderClassDetailsSection()}
                        </>)
                    }
                </div>
            )}
        </>
    );
};

export default StudentSubjects;