import s from './changePasswordForm.module.scss';
import { useState } from 'react';

function ChangePasswordForm() {
    const [oldPassword, addOldPassword] = useState('');
    const [newPassword, addNewPassword] = useState('');
    const [repeatNewPassword, addRepeatNewPassword] = useState('');

    const changePassword = (e) => {
        e.preventDefault();
        const userData = {
            oldPassword: oldPassword,
            newPassword: newPassword,
        };
    }

    return (
        <form className={s.content} onSubmit={(e) => changePassword(e)}>
            <div className={s.change_area}>
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
            </div>
        </form>
    );
}

export default ChangePasswordForm;