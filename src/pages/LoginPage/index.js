import React, { useState } from 'react';
import s from './login.module.scss';

function Login() {
    const [username, addUsername] = useState('');
    const [password, addPassword] = useState('');

    return (
        <form className={s.content}>
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
            </div>
        </form>
    )
}

export default Login;