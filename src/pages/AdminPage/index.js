import s from './admin.module.scss';
import AdminHeader from '../../components/AdminHeader';
import { useState, useEffect } from 'react';
import EmployeeService from '../../services/EmployeeService';
import DepartmentService from '../../services/DepartmentService';

function Main() {
    const [employees, setEmployees] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [isAgreeWindowActive, setAgreeWindowActive] = useState(false);
    const [notificationActive, setNotificationActive] = useState(false);
    const [notificationText, setNotificationText] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);

    useEffect(() => {
        new EmployeeService().getAllEmployees()
            .then(({ data }) => {
                setEmployees(data)
                console.log(data)
            });
    }, []);

    const handleEmployeeClick = (employee) => {
        setSelectedRow(employee.id === selectedRow ? null : employee.id);
    };

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
        // setDepartmentFilter("")
        // setSearchTerm("")
    }

    useEffect(() => {
        new DepartmentService().getAllDepartments()
            .then(({ data }) => {
                setDepartments(data)
                // if (data.length > 0) {
                //     setDepartment(data[0]);
                // }
            });
    }, []);


    const handleAddButtonClick = () => {
        // setDepartment(departments[0]);
        // setIsEdit(false);
    };

    const handleEditButtonClick = () => {
        // if (selectedRow === null) {
        //     setNotificationActive(true);
        //     setNotificationText("Выберите дисциплинцу для редактирвоания");
        // }
    };

    const handleDeleteButtonClick = () => {
        // if (selectedRow === null) {
        //     setNotificationActive(true);
        //     setNotificationText("Выберите дисциплину для удаления");
        // } else {
        //     setIsEdit(false);
        //     setAgreeWindowActive(true);
        // }
    };

    return (
        <div>
            <AdminHeader />
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
                <div className={s.table}>
                    <table>
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Фамилия</th>
                                <th>Имя</th>
                                <th>Отчество</th>
                                <th>Номер телефона</th>
                                <th>Почта</th>
                                <th>Кафедра</th>
                                <th>Логин учетной записи</th>
                                <th>Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr
                                    key={employee.id}
                                    onClick={() => handleEmployeeClick(employee)}
                                    style={{
                                        backgroundColor: selectedRow === employee.id ? '#cfcfcf' : ''
                                    }}>
                                    <td>{employee.id}</td>
                                    <td>{employee.firstName}</td>
                                    <td>{employee.secondName}</td>
                                    <td>{employee.lastName}</td>
                                    <td>{employee.phone}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.departmentAbbreviation}</td>
                                    <td>{employee.username === null ? "Нет аккаунта" : employee.username}</td>
                                    <td>{employee.active === true ? "Активен" : "Не активен"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Main;