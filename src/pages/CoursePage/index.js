import Header from '../../components/Header';
import s from './course.module.scss';
import Menu from '../../components/Menu';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseService from '../../services/CourseService';
import DepartmentService from '../../services/DepartmentService';
import AgreeWindow from '../../modalWindow/AgreeModalWindow';
import CenterNotification from '../../modalWindow/CenterNotification';

function CoursePage() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [formName, setFormName] = useState("Добавление дисиплины")
    const [name, setName] = useState('');
    const [abbreviation, setAbbreviation] = useState('');
    const [department, setDepartment] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isAgreeWindowActive, setAgreeWindowActive] = useState(false);
    const [notificationActive, setNotificationActive] = useState(false);
    const [notificationText, setNotificationText] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [editAreaActive, setEditAreaActive] = useState(false)

    const sortTable = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedData = [...courses].sort((a, b) => {
            const valueA = (key === 'department') ? a.department.name : a[key];
            const valueB = (key === 'department') ? b.department.name : b[key];

            if (valueA < valueB) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (valueA > valueB) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        setCourses(sortedData);
    };

    const filterData = () => {
        if (searchTerm || departmentFilter) {
            let filteredData = [...courses];

            if (departmentFilter) {
                filteredData = filteredData.filter((sp) => sp.department.id === parseInt(departmentFilter));
            }

            if (searchTerm) {
                const term = searchTerm.toLowerCase();

                filteredData = filteredData.filter(
                    (sp) => {
                        const name = sp.name ? sp.name.toLowerCase() : '';
                        const abbreviation = sp.abbreviation ? sp.abbreviation.toLowerCase() : '';

                        return (
                            name.includes(term) ||
                            abbreviation.includes(term)
                        );
                    }
                );
            }

            setFilteredCourses(filteredData);
        } else {
            setFilteredCourses(courses);
        }
    };

    useEffect(() => {
        filterData();
    }, [courses, departmentFilter, searchTerm]);

    const cleanSSF = () => {
        setDepartmentFilter("")
        setSearchTerm("")
    }

    useEffect(() => {
        new CourseService().getAllCourses()
            .then(({ data }) => setCourses(data))
            .catch(error => {
                if (error.isAxiosError && error.code === 'ERR_NETWORK') {
                    navigate("../server/error");
                } else if (!error.response || (error.response.status >= 400 && error.response.status < 500)) {
                    navigate("../server/error");
                }
            })
        new DepartmentService().getAllDepartments()
            .then(({ data }) => {
                setDepartments(data)
                if (data.length > 0) {
                    setDepartment(data[0]);
                }
            })
            .catch(error => {
                if (error.isAxiosError && error.code === 'ERR_NETWORK') {
                    navigate("../server/error");
                } else if (!error.response || (error.response.status >= 400 && error.response.status < 500)) {
                    navigate("../server/error");
                }
            })
    }, []);

    const handleCourseClick = (course) => {
        setSelectedRow(course);
    };

    const handleAddButtonClick = () => {
        setEditAreaActive(!editAreaActive)
        setName("");
        setAbbreviation("");
        setDepartment(departments[0]);
        setIsEdit(false);
        setFormName("Добавление дисциплины")
    };

    const handleEditButtonClick = () => {
        if (selectedRow === null) {
            setNotificationActive(true);
            setNotificationText("Выберите дисциплинцу для редактирвоания");
            if (editAreaActive) {
                setEditAreaActive(false)
            }
        } else {
            setIsEdit(true);
            setFormName("Редактирование дисциплины")
            setName(selectedRow.name);
            setAbbreviation(selectedRow.abbreviation);
            setDepartment(selectedRow.department);
            setEditAreaActive(!editAreaActive)
        }
    };

    const handleDeleteButtonClick = () => {
        if (selectedRow === null) {
            setNotificationActive(true);
            setNotificationText("Выберите дисциплину для удаления");
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
                    setName('')
                    setAbbreviation('')
                    setDepartment(departments[0])
                    setEditAreaActive(!editAreaActive)
                })
                .catch(error => {
                    if (error.response) {

                    } else {

                    }
                    setNotificationActive(true)
                    setNotificationText(error.response.data.message)
                });
        } else {
            const course = {
                "name": name,
                "abbreviation": abbreviation,
                "departmentId": department.id
            }
            new CourseService().addCourse(course)
                .then(({ data: newCourse }) => {
                    setCourses(prevCourses => [...prevCourses, newCourse]);
                    setName('')
                    setAbbreviation('')
                    setDepartment(departments[0])
                    setEditAreaActive(!editAreaActive)
                })
                .catch(error => {
                    setNotificationActive(true)
                    setNotificationText(error.response.data.message)
                });
        }
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
            <Menu page="course" />
            <div className={s.content}>
                <div className={s.work_panel}>
                    <div className={s.buttons}>
                        <button onClick={handleAddButtonClick}><img src='../../img/plus.png' alt="add" /></button>
                        <button onClick={handleEditButtonClick}><img src='../../img/edit.png' alt="edit" /></button>
                        <button onClick={handleDeleteButtonClick}><img src='../../img/delete.png' alt="delete" /></button>
                    </div>
                    <div className={s.ssf}>
                        <div className={s.block}><p>Поиск</p>
                            <input
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    filterData();
                                }}
                            />
                        </div>
                        <div className={s.block}><p>Кафедра</p>
                            <select
                                value={departmentFilter}
                                onChange={(e) => {
                                    setDepartmentFilter(e.target.value);
                                }}>
                                <option value="">Выберите кафедру</option>
                                {departments.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.abbreviation}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button onClick={() => cleanSSF()}>Сбросить</button>
                    </div>
                </div>
                {editAreaActive ?
                    <form className={s.edit_area} onSubmit={(e) => handleSaveButtonClick(e)}>
                        <h2>{formName}</h2>
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
                            value={department ? department.id : ''}
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
                    </form> : <></>
                }
                <div className={s.table}>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => sortTable('id')}>№</th>
                                <th onClick={() => sortTable('name')}>Название</th>
                                <th onClick={() => sortTable('abbreviation')}>Аббревиатура</th>
                                <th onClick={() => sortTable('department')}>Кафедра</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.map((course) => (
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
            </div>
            {isAgreeWindowActive &&
                <AgreeWindow
                    setActive={setAgreeWindowActive}
                    fun={deleteCourse}
                    text={`Вы уверены, что хотите удалить дисциплину \"${selectedRow.name}\"?`} />
            }
            {notificationActive && <CenterNotification setActive={setNotificationActive} title="Ошибка" text={notificationText} />}
        </div >
    )
}

export default CoursePage;