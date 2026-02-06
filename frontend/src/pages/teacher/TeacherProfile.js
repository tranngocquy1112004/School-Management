import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { Card, CardContent, Typography, Button, Collapse, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { updateUser } from '../../redux/userRelated/userHandle';

const TeacherProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  if (response) { console.log(response) }
  else if (error) { console.log(error) }

  const teachSclass = currentUser.teachSclass
  const teachSubjects = Array.isArray(currentUser.teachSubject)
    ? currentUser.teachSubject
    : (currentUser.teachSubject ? [currentUser.teachSubject] : []);
  const teachSchool = currentUser.school

  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
    }
  }, [currentUser]);

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(updateUser({ name }, currentUser._id, "Teacher"));
  };

  return (
    <>
      <ProfileCard>
        <ProfileCardContent>
          <ProfileText>Họ tên: {currentUser.name}</ProfileText>
          <ProfileText>Email: {currentUser.email}</ProfileText>
          <ProfileText>Lớp: {teachSclass.sclassName}</ProfileText>
          <ProfileText>Môn học: {teachSubjects.length > 0 ? teachSubjects.map((s) => s.subName).join(', ') : 'Chưa có'}</ProfileText>
          <ProfileText>Trường: {teachSchool.schoolName}</ProfileText>
        </ProfileCardContent>
      </ProfileCard>
      <Box sx={{ marginLeft: 2 }}>
        <Button variant="contained" onClick={() => setShowEdit(!showEdit)}>
          {showEdit ? <KeyboardArrowUp /> : <KeyboardArrowDown />} Chá»‰nh sá»­a há»“ sÆ¡
        </Button>
        <Collapse in={showEdit} timeout="auto" unmountOnExit>
          <div className="register">
            <form className="registerForm" onSubmit={submitHandler}>
              <span className="registerTitle">Cáº­p nháº­t thÃ´ng tin</span>
              <label>Há» tÃªn</label>
              <input
                className="registerInput"
                type="text"
                placeholder="Nháº­p há» tÃªn..."
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
              <button className="registerButton" type="submit">Cáº­p nháº­t</button>
            </form>
          </div>
        </Collapse>
      </Box>
    </>
  )
}

export default TeacherProfile

const ProfileCard = styled(Card)`
  margin: 20px;
  width: 400px;
  border-radius: 10px;
`;

const ProfileCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileText = styled(Typography)`
  margin: 10px;
`;
