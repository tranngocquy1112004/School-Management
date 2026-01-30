import React, { useEffect, useState } from 'react'
import { getClassStudents, getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tab, Container, Typography, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { BlueButton, GreenButton, PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

const ViewSubject = () => {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch();
  const { subloading, subjectDetails, sclassStudents, getresponse, error } = useSelector((state) => state.sclass);

  const { classID, subjectID } = params

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  if (error) {
    console.log(error)
  }

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedSection, setSelectedSection] = useState('attendance');
  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const studentColumns = [
    { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 170 },
  ]

  const studentRows = sclassStudents.map((student) => {
    return {
      rollNum: student.rollNum,
      name: student.name,
      id: student._id,
    };
  })

  const StudentsAttendanceButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          Xem
        </BlueButton>
        <PurpleButton
          variant="contained"
          onClick={() =>
            navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)
          }
        >
          Điểm danh
        </PurpleButton>
      </>
    );
  };

  const StudentsMarksButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          Xem
        </BlueButton>
        <PurpleButton variant="contained"
          onClick={() => navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)}>
          Nhập điểm
        </PurpleButton>
      </>
    );
  };

  const SubjectStudentsSection = () => {
    return (
      <>
        {getresponse ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
              >
                Thêm học sinh
              </GreenButton>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Danh sách học sinh:
            </Typography>

            {selectedSection === 'attendance' &&
              <TableTemplate buttonHaver={StudentsAttendanceButtonHaver} columns={studentColumns} rows={studentRows} />
            }
            {selectedSection === 'marks' &&
              <TableTemplate buttonHaver={StudentsMarksButtonHaver} columns={studentColumns} rows={studentRows} />
            }

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                <BottomNavigationAction
                  label="Điểm danh"
                  value="attendance"
                  icon={selectedSection === 'attendance' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                />
                <BottomNavigationAction
                  label="Điểm"
                  value="marks"
                  icon={selectedSection === 'marks' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                />
              </BottomNavigation>
            </Paper>

          </>
        )}
      </>
    )
  }

  const SubjectDetailsSection = () => {
    const numberOfStudents = sclassStudents.length;

    return (
      <>
        <Typography variant="h4" align="center" gutterBottom>
          Chi tiết môn học
        </Typography>
        <Typography variant="h6" gutterBottom>
          Tên môn học: {subjectDetails && subjectDetails.subName}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Mã môn: {subjectDetails && subjectDetails.subCode}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Số buổi: {subjectDetails && subjectDetails.sessions}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Số học sinh: {numberOfStudents}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Lớp: {subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName.sclassName}
        </Typography>
        {subjectDetails && subjectDetails.teacher ?
          <Typography variant="h6" gutterBottom>
            Giáo viên: {subjectDetails.teacher.name}
          </Typography>
          :
          <GreenButton variant="contained"
            onClick={() => navigate("/Admin/teachers/addteacher/" + subjectDetails._id)}>
            Thêm giáo viên bộ môn
          </GreenButton>
        }
      </>
    );
  }

  return (
    <>
      {subloading ?
        < div > Đang tải...</div >
        :
        <>
          <Box sx={{ width: '100%', typography: 'body1', }} >
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} sx={{ position: 'fixed', width: '100%', bgcolor: 'background.paper', zIndex: 1 }}>
                <Tab label="Chi tiết" value="1" />
                <Tab label="Học sinh" value="2" />
                </TabList>
              </Box>
              <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                <TabPanel value="1">
                  <SubjectDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <SubjectStudentsSection />
                </TabPanel>
              </Container>
            </TabContext>
          </Box>
        </>
      }
    </>
  )
}

export default ViewSubject
