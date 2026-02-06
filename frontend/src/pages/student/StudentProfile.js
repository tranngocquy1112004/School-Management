import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { Card, CardContent, Typography, Grid, Box, Avatar, Container, Paper, Button, Collapse } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { updateUser } from '../../redux/userRelated/userHandle';

const StudentProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  if (response) { console.log(response) }
  else if (error) { console.log(error) }

  const sclassNames = Array.isArray(currentUser.sclassNames)
    ? currentUser.sclassNames
    : (currentUser.sclassName ? [currentUser.sclassName] : []);
  const studentSchool = currentUser.school

  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
    }
  }, [currentUser]);

  const submitHandler = (event) => {
    event.preventDefault();
    const fields = password === "" ? { name } : { name, password };
    dispatch(updateUser(fields, currentUser._id, "Student"));
    setPassword("");
  };

  return (
    <>
      <Container maxWidth="md">
        <StyledPaper elevation={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Avatar alt="Ảnh đại diện học sinh" sx={{ width: 150, height: 150 }}>
                  {String(currentUser.name).charAt(0)}
                </Avatar>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Typography variant="h5" component="h2" textAlign="center">
                  {currentUser.name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Typography variant="subtitle1" component="p" textAlign="center">
                  Số báo danh: {currentUser.rollNum}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Typography variant="subtitle1" component="p" textAlign="center">
                  Classes: {sclassNames.map((c) => c.sclassName).join(', ')}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Typography variant="subtitle1" component="p" textAlign="center">
                  Trường: {studentSchool.schoolName}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </StyledPaper>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Thông tin cá nhân
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Ngày sinh:</strong> 01/01/2000
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Giới tính:</strong> Nam
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Email:</strong> john.doe@example.com
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Điện thoại:</strong> (123) 456-7890
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Địa chỉ:</strong> 123 Main Street, City, Country
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Liên hệ khẩn cấp:</strong> (987) 654-3210
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Box sx={{ marginTop: 2 }}>
          <Button variant="contained" onClick={() => setShowEdit(!showEdit)}>
            {showEdit ? <KeyboardArrowUp /> : <KeyboardArrowDown />} Chỉnh sửa hồ sơ
          </Button>
          <Collapse in={showEdit} timeout="auto" unmountOnExit>
            <div className="register">
              <form className="registerForm" onSubmit={submitHandler}>
                <span className="registerTitle">Cập nhật thông tin</span>
                <label>Họ tên</label>
                <input
                  className="registerInput"
                  type="text"
                  placeholder="Nhập họ tên..."
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                />

                <label>Mật khẩu</label>
                <input
                  className="registerInput"
                  type="password"
                  placeholder="Nhập mật khẩu..."
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                />

                <button className="registerButton" type="submit">Cập nhật</button>
              </form>
            </div>
          </Collapse>
        </Box>
      </Container>
    </>
  )
}

export default StudentProfile

const StyledPaper = styled(Paper)`
  padding: 20px;
  margin-bottom: 20px;
`;