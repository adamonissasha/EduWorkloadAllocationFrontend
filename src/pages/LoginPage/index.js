import React, { useState } from 'react';
import AuthService from '../../services/AuthService';
import s from './login.module.scss';
import Notification from '../../modalWindow/Notification';

function Login() {
    const [username, addUsername] = useState('');
    const [password, addPassword] = useState('');

    const [isAuth, setAuth] = useState(false);

    const [notificationActive, setNotificationActive] = useState(false);
    const [notificationText, setNotificationText] = useState("");

    const auth = (e) => {
        e.preventDefault();
        const userData = {
            username: username,
            password: password,
        };

        new AuthService().auth(userData)
            .then(response => {
                setAuth(true);
                localStorage.setItem('token', response.data.token);
            })
            .catch(function (error) {
                if (error.response.status === 401) {
                    setNotificationActive(true);
                    setNotificationText("НЕВЕРНЫЙ ЛОГИН ИЛИ ПАРОЛЬ");
                    setAuth(false);
                }
            });
    }

    return (
        <form className={s.content} onSubmit={(e) => auth(e)}>
            {isAuth ?
                <div>
                    {window.location.replace("/admin")}
                </div>
                :
                <div className={s.green_block}>
                    <div className={s.login_area}>
                        <h1 className={s.label}>УЧЕБНАЯ НАГРУЗКА</h1>
                        <div>
                            <p>Логин</p>
                            <input
                                required
                                value={username}
                                onChange={(e) => addUsername(e.target.value)} />
                        </div>
                        <div>
                            <p>Пароль</p>
                            <input
                                required
                                type='password'
                                value={password}
                                onChange={(e) => addPassword(e.target.value)} />
                        </div>
                        <a href="/"><h3>Забыли пароль?</h3></a>
                        <button>Войти</button>
                    </div>
                    {notificationActive && <Notification setActive={setNotificationActive} title="Ошибка" text={notificationText} />}
                </div>
            }
        </form>
    )
}

export default Login;