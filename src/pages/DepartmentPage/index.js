import Header from '../../components/Header';
import s from './department.module.scss';
import Menu from '../../components/Menu';
import React, { useState } from 'react';
import DepartmentService from '../../services/DepartmentService';
import AgreeWindow from '../../modalWindow/AgreeModalWindow';
import Notification from '../../modalWindow/Notification';

function DepartmentPage() {
    const [departments, setDepartments] = useState([]);
    const [name, setName] = useState('');
    const [abbreviation, setAbbreviation] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isAgreeWindowActive, setAgreeWindowActive] = useState(false);
    const [notificationActive, setNotificationActive] = useState(false);
    const [notificationText, setNotificationText] = useState("");

    React.useEffect(() => {
        new DepartmentService().getAllDepartments()
            .then(({ data }) => setDepartments(data));
    }, []);

    const handleDepartmentClick = (department) => {
        setSelectedRow(department);
    };

    const handleAddButtonClick = () => {
        setName("");
        setAbbreviation("");
        setPhone("");
        setIsEdit(false);
    };

    const handleEditButtonClick = () => {
        if (selectedRow === null) {
            setNotificationActive(true);
            setNotificationText("ВЫБЕРИТЕ КАФЕДРУ ДЛЯ РЕДАКТИРОВАНИЯ");
        } else {
            setIsEdit(true);
            setName(selectedRow.name);
            setAbbreviation(selectedRow.abbreviation);
            setPhone(selectedRow.phone);
        }
    };

    const handleDeleteButtonClick = () => {
        if (selectedRow === null) {
            setNotificationActive(true);
            setNotificationText("ВЫБЕРИТЕ КАФЕДРУ ДЛЯ УДАЛЕНИЯ");
        } else {
            setIsEdit(false);
            setAgreeWindowActive(true);
        }
    };

    const handleSaveButtonClick = (e) => {
        e.preventDefault();
        if (isEdit) {
            const dep = {
                "name": name,
                "abbreviation": abbreviation,
                "phone": phone
            }
            new DepartmentService().editDepartment(selectedRow.id, dep)
                .then(response => {
                    const updatedDepartments = departments.map(department => {
                        if (department.id === selectedRow.id) {
                            return { ...department, ...dep };
                        }
                        return department;
                    });
                    setDepartments(updatedDepartments);
                })
        } else {
            const department = {
                "name": name,
                "abbreviation": abbreviation,
                "phone": phone
            }
            new DepartmentService().addDepartment(department)
                .then(({ data: newDepartment }) => {
                    setDepartments(prevDepartments => [...prevDepartments, newDepartment]);
                })
        }
        setName('')
        setAbbreviation('')
        setPhone('')
    };

    const deleteDepartment = () => {
        setAgreeWindowActive(false);
        new DepartmentService().deleteDepartment(selectedRow.id)
            .then(() => {
                setDepartments(prevDepartments =>
                    prevDepartments.filter(department => department.id !== selectedRow.id)
                );
            })
    };

    return (
        <div>
            <Header />
            <Menu />
            <div className={s.content}>
                <div className={s.table}>
                    <div className={s.buttons}>
                        <button onClick={handleAddButtonClick}><img src='../../img/plus.png' alt="add" /></button>
                        <button onClick={handleEditButtonClick}><img src='../../img/edit.png' alt="edit" /></button>
                        <button onClick={handleDeleteButtonClick}><img src='../../img/delete.png' alt="delete" /></button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Название</th>
                                <th>Аббревиатура</th>
                                <th>Номер телефона</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((department) => (
                                <tr
                                    key={department.id}
                                    onClick={() => handleDepartmentClick(department)}
                                    style={{
                                        backgroundColor: (selectedRow === null || selectedRow.id !== department.id) ? '' : '#cfcfcf'
                                    }}
                                >
                                    <td>{department.id}</td>
                                    <td>{department.name}</td>
                                    <td>{department.abbreviation}</td>
                                    <td>{department.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <form className={s.edit_area}>
                    <p>Название</p>
                    <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <p>Аббревиатура</p>
                    <input
                        required
                        value={abbreviation}
                        onChange={(e) => setAbbreviation(e.target.value)}
                    />
                    <p>Номер телефона</p>
                    <input
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <button onClick={handleSaveButtonClick}>Сохранить</button>
                </form>
            </div>
            {
                isAgreeWindowActive &&
                <AgreeWindow
                    setActive={setAgreeWindowActive}
                    fun={deleteDepartment}
                    text={`Вы уверены, что хотите удалить кафедру \"${selectedRow.name}\"?`} />}
            {notificationActive && <Notification setActive={setNotificationActive} title="Ошибка" text={notificationText} />}
        </div>
    )
}

export default DepartmentPage;