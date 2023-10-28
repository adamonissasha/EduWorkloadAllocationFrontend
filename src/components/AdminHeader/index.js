import s from './adminHeader.module.scss';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AgreeWindow from '../../modalWindow/AgreeModalWindow';

function AdminHeader() {
    const [isAgreeWindowActive, setAgreeWindowActive] = useState(false);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("user")
        setAgreeWindowActive(false)
        navigate("/login")
    }

    return (
        <div className={s.header}>
            <div className={s.label}>
                <img className={s.logo} src='../img/logo.png' alt='logo'></img>
                <h1>УЧЕБНАЯ НАГРУЗКА</h1>
            </div>

            <div className={s.buttons}>
                <div class={s.users_container}>
                    <img src='../img/work-with-users.png' alt="users"></img>
                    <div className={s.text}>ПОЛЬЗОВАТЕЛИ</div>
                </div>

                <div class={s.account_container}>
                    <img src='../img/account.png' alt='account'></img>
                    <div className={s.text}>ЛИЧНЫЙ КАБИНЕТ</div>
                </div>

                <div class={s.logout_container} onClick={() => setAgreeWindowActive(true)}>
                    <img src="../img/logout.png" alt="exit" />
                    <div className={s.text}>ВЫЙТИ</div>
                </div>
            </div>
            {
                isAgreeWindowActive &&
                <AgreeWindow
                    setActive={setAgreeWindowActive}
                    fun={logout}
                    text="ВЫ УВЕРЕНЫ, ЧТО ХОТИТЕ ВЫЙТИ ИЗ АККАУНТА?" />
            }
        </div >
    );
}

export default AdminHeader;