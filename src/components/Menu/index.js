import s from './menu.module.scss';
import { useState } from 'react';

function Menu({ page }) {
    return (
        <div className={s.buttons}>
            <a href='/department'><button className={page === "department" ? s.choosen : s.unchoosen}>Кафедры</button></a>
            <a href='/speciality'><button className={page === "speciality" ? s.choosen : s.unchoosen}>Специальности</button></a>
            <a href='/course'><button className={page === "course" ? s.choosen : s.unchoosen}>Дисциплины</button></a>
            <a href='/employee'><button className={page === "employee" ? s.choosen : s.unchoosen}>Сотрудники</button></a>
        </div>
    );
}

export default Menu;