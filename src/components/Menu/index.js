import s from './menu.module.scss';
import { useState } from 'react';

function Menu() {
    const [idx, setIdx] = useState(0)

    return (
        <div className={s.buttons}>
            <button onClick={() => setIdx(0)} className={idx === 0 ? s.choosen : s.unchoosen}>Сотрудники</button>
            <button onClick={() => setIdx(1)} className={idx === 1 ? s.choosen : s.unchoosen}>Кафедры</button>
            <button onClick={() => setIdx(2)} className={idx === 2 ? s.choosen : s.unchoosen}>Факультеты</button>
            <button onClick={() => setIdx(3)} className={idx === 3 ? s.choosen : s.unchoosen}>Специальности</button>
            <button onClick={() => setIdx(4)} className={idx === 4 ? s.choosen : s.unchoosen}>Дисциплины</button>
        </div>
    );
}

export default Menu;