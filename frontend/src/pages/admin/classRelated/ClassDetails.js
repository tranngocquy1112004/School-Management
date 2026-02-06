import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getClassDetails, getClassStudents, getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser, updateUser } from '../../../redux/userRelated/userHandle';
import {
    Box, Container, Typography, Tab, IconButton, Button, Collapse
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice";
import { BlueButton, GreenButton, PurpleButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from '@mui/icons-material/PostAdd';

const ClassDetailsSection = ({
    sclassDetails,
    sclassName,
    setSclassName,
    showEdit,
    setShowEdit,
    updateClassName,
    numberOfSubjects,
    numberOfStudents,
    getresponse,
    response,
    navigate,
    classID
}) => {
    return (
        <>
            <Typography variant="h4" align="center" gutterBottom>
                Chi tiết lớp học
            </Typography>
            <Typography variant="h5" gutterBottom>
                Lớp {sclassDetails && sclassDetails.sclassName}
            </Typography>
            <Button variant="contained" onClick={() => setShowEdit(!showEdit)}>
                {showEdit ? 'Hide edit' : 'Edit class name'}
            </Button>
            <Collapse in={showEdit} timeout="auto" unmountOnExit>
                <div className="register">
                    <form className="registerForm" onSubmit={updateClassName}>
                        <span className="registerTitle">Update class name</span>
                        <label>Class name</label>
                        <input
                            className="registerInput"
                            type="text"
                            placeholder="Enter class name..."
                            value={sclassName}
                            onChange={(event) => setSclassName(event.target.value)}
                            required
                        />
                        <button className="registerButton" type="submit">Update</button>
                    </form>
                </div>
            </Collapse>
            <Typography variant="h6" gutterBottom>
                Số môn học: {numberOfSubjects}
            </Typography>
            <Typography variant="h6" gutterBottom>
                Số học sinh: {numberOfStudents}
            </Typography>
            {getresponse &&
                <GreenButton
                    variant="contained"
                    onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                >
                    Thêm học sinh
                </GreenButton>
            }
            {response &&
                <GreenButton
                    variant="contained"
                    onClick={() => navigate("/Admin/addsubject/" + classID)}
                >
                    Thêm môn học
                </GreenButton>
            }
        </>
    );
};

const ClassDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, sclassStudents, sclassDetails, loading, error, response, getresponse } = useSelector((state) => state.sclass);

    const classID = params.id

    useEffect(() => {
        dispatch(getClassDetails(classID, "Sclass"));
        dispatch(getSubjectList(classID, "ClassSubjects"))
        dispatch(getClassStudents(classID));
    }, [dispatch, classID])

    if (error) {
        console.log(error)
    }

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [showEdit, setShowEdit] = useState(false);
    const [sclassName, setSclassName] = useState("");

    useEffect(() => {
        if (!showEdit && sclassDetails && sclassDetails.sclassName) {
            setSclassName(sclassDetails.sclassName);
        }
    }, [sclassDetails, showEdit]);

    const updateClassName = (event) => {
        event.preventDefault();
        dispatch(updateUser({ sclassName }, classID, "Sclass"))
            .then(() => {
                dispatch(getClassDetails(classID, "Sclass"));
                setShowEdit(false);
            });
    };

    const deleteHandler = (deleteID, address) => {
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getClassStudents(classID));
                dispatch(resetSubjects())
                dispatch(getSubjectList(classID, "ClassSubjects"))
            })
    }

    const subjectColumns = [
        { id: 'name', label: 'Tên môn học', minWidth: 170 },
        { id: 'code', label: 'Mã môn học', minWidth: 100 },
    ]

    const subjectRows = subjectsList && subjectsList.length > 0 && subjectsList.map((subject) => {
        return {
            name: subject.subName,
            code: subject.subCode,
            id: subject._id,
        };
    })

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => {
                        navigate(`/Admin/class/subject/${classID}/${row.id}`)
                    }}
                >
                    Xem
                </BlueButton >
            </>
        );
    };

    const subjectActions = [
        {
            icon: <PostAddIcon color="primary" />, name: 'Thêm môn học',
            action: () => navigate("/Admin/addsubject/" + classID)
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Xóa tất cả môn học',
            action: () => deleteHandler(classID, "SubjectsClass")
        }
    ];

    const ClassSubjectsSection = () => {
        return (
            <>
                {response ?
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <GreenButton
                            variant="contained"
                            onClick={() => navigate("/Admin/addsubject/" + classID)}
                        >
                            Thêm môn học
                        </GreenButton>
                    </Box>
                    :
                    <>
                        <Typography variant="h5" gutterBottom>
                            Danh sách môn học:
                        </Typography>

                        <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
                        <SpeedDialTemplate actions={subjectActions} />
                    </>
                }
            </>
        )
    }

    const studentColumns = [
        { id: 'name', label: 'Họ tên', minWidth: 170 },
        { id: 'rollNum', label: 'Số báo danh', minWidth: 100 },
    ]

    const studentRows = sclassStudents.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            id: student._id,
        };
    })

    const StudentsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Student")}>
                    <PersonRemoveIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate("/Admin/students/student/" + row.id)}
                >
                    Xem
                </BlueButton>
                <PurpleButton
                    variant="contained"
                    onClick={() =>
                        navigate("/Admin/students/student/attendance/" + row.id)
                    }
                >
                    Điểm danh
                </PurpleButton>
            </>
        );
    };

    const studentActions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Thêm học sinh',
            action: () => navigate("/Admin/class/addstudents/" + classID)
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Xóa tất cả học sinh',
            action: () => deleteHandler(classID, "StudentsClass")
        },
    ];

    const ClassStudentsSection = () => {
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

                        <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                        <SpeedDialTemplate actions={studentActions} />
                    </>
                )}
            </>
        )
    }

    const ClassTeachersSection = () => {
        return (
            <>
                Giáo viên phụ trách sẽ được hiển thị trong phần Môn học.
            </>
        )
    }

    const numberOfSubjects = subjectsList.length;
    const numberOfStudents = sclassStudents.length;

    return (
        <>
            {loading ? (
                <div>Chi tiết lớp học...</div>
            ) : (
                <>
                    <Box sx={{ width: '100%', typography: 'body1', }} >
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} sx={{ position: 'fixed', width: '100%', bgcolor: 'background.paper', zIndex: 1 }}>
                                    <Tab label="Chi tiết" value="1" />
                                    <Tab label="Môn học" value="2" />
                                    <Tab label="Học sinh" value="3" />
                                    <Tab label="Giáo viên" value="4" />
                                </TabList>
                            </Box>
                            <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                                <TabPanel value="1">
                                    <ClassDetailsSection
                                        sclassDetails={sclassDetails}
                                        sclassName={sclassName}
                                        setSclassName={setSclassName}
                                        showEdit={showEdit}
                                        setShowEdit={setShowEdit}
                                        updateClassName={updateClassName}
                                        numberOfSubjects={numberOfSubjects}
                                        numberOfStudents={numberOfStudents}
                                        getresponse={getresponse}
                                        response={response}
                                        navigate={navigate}
                                        classID={classID}
                                    />
                                </TabPanel>
                                <TabPanel value="2">
                                    <ClassSubjectsSection />
                                </TabPanel>
                                <TabPanel value="3">
                                    <ClassStudentsSection />
                                </TabPanel>
                                <TabPanel value="4">
                                    <ClassTeachersSection />
                                </TabPanel>
                            </Container>
                        </TabContext>
                    </Box>
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default ClassDetails;
