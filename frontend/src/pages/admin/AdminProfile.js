import { useEffect, useState } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, updateUser } from '../../redux/userRelated/userHandle';
import { useNavigate } from 'react-router-dom';
import { authLogout } from '../../redux/userRelated/userSlice';
import { Button, Collapse } from '@mui/material';

const AdminProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentUser, response, error } = useSelector((state) => state.user);
    const address = "Admin";

    const [showTab, setShowTab] = useState(false);

    const [name, setName] = useState(currentUser?.name || "");
    const [email, setEmail] = useState(currentUser?.email || "");
    const [password, setPassword] = useState("");
    const [schoolName, setSchoolName] = useState(currentUser?.schoolName || "");

    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name || "");
            setEmail(currentUser.email || "");
            setSchoolName(currentUser.schoolName || "");
        }
    }, [currentUser]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const fields = password === "" ? { name, email, schoolName } : { name, email, password, schoolName };

    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(updateUser(fields, currentUser._id, address));
    };

    const deleteHandler = async () => {
        try {
            await dispatch(deleteUser(currentUser._id, address));
            dispatch(authLogout());
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            Họ tên: {currentUser?.name}
            <br />
            Email: {currentUser?.email}
            <br />
            Trường: {currentUser?.schoolName}
            <br />
            <Button variant="contained" color="error" onClick={deleteHandler}>Xóa</Button>
            <Button variant="contained" sx={styles.showButton}
                onClick={() => setShowTab(!showTab)}>
                {showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />} Chỉnh sửa hồ sơ
            </Button>
            <Collapse in={showTab} timeout="auto" unmountOnExit>
                <div className="register">
                    <form className="registerForm" onSubmit={submitHandler}>
                        <span className="registerTitle">Cập nhật thông tin</span>
                        <label>Họ tên</label>
                        <input className="registerInput" type="text" placeholder="Nhập họ tên..."
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoComplete="name" required />

                        <label>Trường</label>
                        <input className="registerInput" type="text" placeholder="Nhập tên trường..."
                            value={schoolName}
                            onChange={(event) => setSchoolName(event.target.value)}
                            autoComplete="name" required />

                        <label>Email</label>
                        <input className="registerInput" type="email" placeholder="Nhập email..."
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete="email" required />

                        <label>Mật khẩu</label>
                        <input className="registerInput" type="password" placeholder="Nhập mật khẩu..."
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="new-password" />

                        <button className="registerButton" type="submit">Cập nhật</button>
                    </form>
                </div>
            </Collapse>
        </div>
    )
}

export default AdminProfile

const styles = {
    showButton: {
        marginLeft: "16px",
        backgroundColor: "#270843",
        "&:hover": {
            backgroundColor: "#3f1068",
        }
    }
}
