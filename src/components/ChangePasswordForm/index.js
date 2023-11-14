import s from './changePasswordForm.module.scss';
import { useState } from 'react';
import Notification from '../../modalWindow/Notification';
import AuthService from '../../services/AuthService';

function ChangePasswordForm() {
    const [oldPassword, addOldPassword] = useState('');
    const [newPassword, addNewPassword] = useState('');
    const [repeatNewPassword, addRepeatNewPassword] = useState('');
    const [notificationActive, setNotificationActive] = useState(false);
    const [notificationText, setNotificationText] = useState("");

    const changePassword = (e) => {
        e.preventDefault();
        if (newPassword !== repeatNewPassword) {
            setNotificationActive(true);
            setNotificationText("Пароли не совпадают!")
        } else {
            const changedPassword = {
                password: oldPassword,
                newPassword: newPassword
            };
            new AuthService().changePassword(changedPassword)
                .then(() => {
                    setNotificationActive(true);
                    setNotificationText("Пароль успешно сменен!")
                })
                .catch(function (error) {
                    if (error.response.status === 401) {
                        setNotificationActive(true);
                        setNotificationText(error.response.data)
                    }
                });
        };
    }

    return (
        <div className={s.content}>
            <form className={s.change_area} onSubmit={(e) => changePassword(e)}>
                <h1 className={s.label}>СМЕНА ПАРОЛЯ</h1>
                <div>
                    <p>Старый пароль</p>
                    <input
                        required
                        type='password'
                        value={oldPassword}
                        onChange={(e) => addOldPassword(e.target.value)} />
                    <p>Новый пароль</p>
                    <input
                        required
                        type='password'
                        value={newPassword}
                        onChange={(e) => addNewPassword(e.target.value)} />
                    <p>Повторите новый пароль</p>
                    <input
                        required
                        type='password'
                        value={repeatNewPassword}
                        onChange={(e) => addRepeatNewPassword(e.target.value)} />
                </div>
                <button>СОХРАНИТЬ</button>
            </form>
            {notificationActive && <Notification setActive={setNotificationActive} text={notificationText} />}
        </div>
    );
}

export default ChangePasswordForm;