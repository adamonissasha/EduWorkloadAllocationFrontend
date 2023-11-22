import Header from '../../components/Header';
import s from './course.module.scss';
import Menu from '../../components/Menu';
import React, { useState } from 'react';
import CourseService from '../../services/CourseService';
import DepartmentService from '../../services/DepartmentService';
import AgreeWindow from '../../modalWindow/AgreeModalWindow';
import Notification from '../../modalWindow/Notification';

function CoursePage() {
    const [courses, setCourses] = useState([]);
    const [name, setName] = useState('');
    const [abbreviation, setAbbreviation] = useState('');
    const [department, setDepartment] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isAgreeWindowActive, setAgreeWindowActive] = useState(false);
    const [notificationActive, setNotificationActive] = useState(false);
    const [notificationText, setNotificationText] = useState("");

    React.useEffect(() => {
        new CourseService().getAllCourses()
            .then(({ data }) => setCourses(data));
        new DepartmentService().getAllDepartments()
            .then(({ data }) => {
                setDepartments(data)
                if (data.length > 0) {
                    setDepartment(data[0]);
                }
            });
    }, []);

    const handleCourseClick = (course) => {
        setSelectedRow(course);
    };

    const handleAddButtonClick = () => {
        setName("");
        setAbbreviation("");
        setDepartment(departments[0]);
        setIsEdit(false);
    };

    const handleEditButtonClick = () => {
        if (selectedRow === null) {
            setNotificationActive(true);
            setNotificationText("ВЫБЕРИТЕ ДИСЦИПЛИНУ ДЛЯ РЕДАКТИРОВАНИЯ");
        } else {
            setIsEdit(true);
            setName(selectedRow.name);
            setAbbreviation(selectedRow.abbreviation);
            setDepartment(selectedRow.department);
        }
    };

    const handleDeleteButtonClick = () => {
        if (selectedRow === null) {
            setNotificationActive(true);
            setNotificationText("ВЫБЕРИТЕ ДИСЦИПЛИНУ ДЛЯ УДАЛЕНИЯ");
        } else {
            setIsEdit(false);
            setAgreeWindowActive(true);
        }
    };

    const handleSaveButtonClick = (e) => {
        e.preventDefault();
        if (isEdit) {
            const updatedCourse = {
                "name": name,
                "abbreviation": abbreviation,
                "departmentId": department.id
            }
            new CourseService().editCourse(selectedRow.id, updatedCourse)
                .then(response => {
                    const updatedCourses = courses.map(course => {
                        if (course.id === selectedRow.id) {
                            return { ...course, ...{ name, abbreviation, department } };
                        }
                        return course;
                    });
                    setCourses(updatedCourses);
                })
        } else {
            const course = {
                "name": name,
                "abbreviation": abbreviation,
                "departmentId": department.id
            }
            new CourseService().addCourse(course)
                .then(({ data: newCourse }) => {
                    setCourses(prevCourses => [...prevCourses, newCourse]);
                })
        }
        setName('')
        setAbbreviation('')
        setDepartment(departments[0])
    };

    const deleteCourse = () => {
        setAgreeWindowActive(false);
        setSelectedRow(null)
        new CourseService().deleteCourse(selectedRow.id)
            .then(() => {
                setCourses(prevCourses =>
                    prevCourses.filter(course => course.id !== selectedRow.id)
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
                                <th>Кафедра</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr
                                    key={course.id}
                                    onClick={() => handleCourseClick(course)}
                                    style={{
                                        backgroundColor: (selectedRow === null || selectedRow.id !== course.id) ? '' : '#cfcfcf'
                                    }}>
                                    <td>{course.id}</td>
                                    <td>{course.name}</td>
                                    <td>{course.abbreviation}</td>
                                    <td>{course.department.abbreviation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <form className={s.edit_area} onSubmit={(e) => handleSaveButtonClick(e)}>
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
                    <p>Кафедра</p>
                    <select
                        value={department ? department.id : ''} // Предположим, что в department хранится объект с полем id
                        onChange={(e) => {
                            const selectedDepartment = departments.find(dep => dep.id === parseInt(e.target.value));
                            setDepartment(selectedDepartment);
                        }}>
                        {departments.map((dep) => (
                            <option key={dep.id} value={dep.id}>
                                {dep.abbreviation}
                            </option>
                        ))}
                    </select>
                    <button>Сохранить</button>
                </form>
            </div>
            {isAgreeWindowActive &&
                <AgreeWindow
                    setActive={setAgreeWindowActive}
                    fun={deleteCourse}
                    text={`Вы уверены, что хотите удалить кафедру \"${selectedRow.name}\"?`} />
            }
            {notificationActive && <Notification setActive={setNotificationActive} title="Ошибка" text={notificationText} />}
        </div >
    )
}

export default CoursePage;