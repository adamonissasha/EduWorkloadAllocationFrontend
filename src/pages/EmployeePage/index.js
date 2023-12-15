import Header from '../../components/Header';
import s from './employee.module.scss';
import Menu from '../../components/Menu';
import { useEffect, useState } from 'react';
import EmployeeService from '../../services/EmployeeService';
import DepartmentService from '../../services/DepartmentService';
import CourseService from '../../services/CourseService';
import AgreeWindow from '../../modalWindow/AgreeModalWindow';
import CenterNotification from '../../modalWindow/CenterNotification';

function EmployeePage() {
    const [formName, setFormName] = useState("Добавление сотрудника")
    const [employees, setEmployees] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfEmployment, setDateOfEmployment] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [academicDegree, setAcademicDegree] = useState('');
    const [jobTitles, setJobTitles] = useState('');
    const [academicDegrees, setAcademicDegrees] = useState('');
    const [department, setDepartment] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [departments, setDepartments] = useState([]);
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
    const [isAgreeWindowActive, setAgreeWindowActive] = useState(false);
    const [notificationActive, setNotificationActive] = useState(false);
    const [notificationText, setNotificationText] = useState("");
    const [editAreaActive, setEditAreaActive] = useState(false)
    const [courses, setCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([])

    const sortTable = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedData = [...employees].sort((a, b) => {
            const valueA = a[key];
            const valueB = b[key];

            if (valueA < valueB) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (valueA > valueB) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        setEmployees(sortedData);
    };

    const filterData = () => {
        if (searchTerm || departmentFilter) {
            let filteredData = [...employees];

            if (departmentFilter) {
                filteredData = filteredData.filter((sp) => sp.departmentAbbreviation === departmentFilter);
            }

            if (searchTerm) {
                const term = searchTerm.toLowerCase();

                filteredData = filteredData.filter(
                    (empl) => {
                        const firstName = empl.firstName ? empl.firstName.toLowerCase() : '';
                        const lastName = empl.lastName ? empl.lastName.toLowerCase() : '';
                        const secondName = empl.secondName ? empl.secondName.toLowerCase() : '';
                        const phone = empl.phone ? empl.phone.toLowerCase() : '';
                        const email = empl.email ? empl.email.toLowerCase() : '';
                        const dateOfEmployment = empl.dateOfEmployment ? empl.dateOfEmployment.toLowerCase() : '';

                        return (
                            firstName.includes(term) ||
                            lastName.includes(term) ||
                            secondName.includes(term) ||
                            phone.includes(term) ||
                            email.includes(term) ||
                            dateOfEmployment.includes(term)
                        );
                    }
                );
            }

            setFilteredEmployees(filteredData);
        } else {
            setFilteredEmployees(employees);
        }
    };

    useEffect(() => {
        filterData();
    }, [employees, departmentFilter, searchTerm]);

    const cleanSSF = () => {
        setSearchTerm("")
    }

    useEffect(() => {
        new EmployeeService().getAllEmployees()
            .then(({ data }) => {
                setEmployees(data)
            });
        new EmployeeService().getJobTitles()
            .then(({ data }) => {
                setJobTitles(data)
            });
        new EmployeeService().getAcademicDegrees()
            .then(({ data }) => {
                setAcademicDegrees(data)
            });
        new DepartmentService().getAllDepartments()
            .then(({ data }) => {
                setDepartments(data)
                if (data.length > 0) {
                    setDepartment(data[0]);
                }
            });
    }, []);

    const handleEmployeeClick = (employee) => {
        setSelectedRow(employee);
    };

    const handleAddButtonClick = () => {
        new CourseService().getAllCourses()
            .then(({ data }) => {
                setAllCourses(data)
            });
        setDepartment(departments[0])
        setEditAreaActive(!editAreaActive)
    };

    const handleEditButtonClick = () => {
        if (selectedRow === null) {

        } else {

        }
    };

    const handleDeleteButtonClick = () => {
        if (showEmployeeDetails) {
            setShowEmployeeDetails(false)
        }
        if (selectedRow === null) {
            setNotificationActive(true);
            setNotificationText("Выберите сотрудника для удаления");
        } else {
            setAgreeWindowActive(true);
        }
    };

    const handleShowDetailsClick = () => {
        if (selectedRow === null) {
            setNotificationActive(true);
            setNotificationText("Выберите сотрудника для предоставления подробной информации");
        } else {
            setShowEmployeeDetails(!showEmployeeDetails);
        }
    };

    const deleteEmployee = () => {
        setAgreeWindowActive(false);
        setSelectedRow(null)
        new EmployeeService().deleteEmployee(selectedRow.id)
            .then(() => {
                setEmployees(prevEmployees =>
                    prevEmployees.filter(empl => empl.id !== selectedRow.id)
                );
            })
    };

    const handleAddCourse = () => {
        setCourses(prevCourses => [
            ...prevCourses,
            {
                courseId: '',
                courseType: ''
            }
        ]);
    };

    const handleCourseChange = (index, field, value) => {
        const updatedCourses = [...courses];
        updatedCourses[index][field] = value;
        setCourses(updatedCourses);
        console.log(courses)
    };

    const renderCourseInputs = () => {
        return courses.map((course, index) => (
            <div className={s.course} key={index}>
                <select
                    value={course.courseId}
                    onChange={(e) => handleCourseChange(index, 'courseId', e.target.value)}>
                    <option value="">Выберите дисциплину</option>
                    {allCourses.map(course => (
                        <option key={course.id} value={course.id}>
                            {course.name}
                        </option>
                    ))}
                </select>
                <select
                    onChange={(e) => handleCourseChange(index, 'courseType', e.target.value)}>
                    <option value="">Выберите тип дисциплины</option>
                    <option value="LK">Лекция</option>
                    <option value="PZ">Практическое занятие</option>
                    <option value="LR">Лабораторное занятие</option>
                </select>
            </div>
        ));
    };

    const handleSaveButtonClick = (e) => {
        const cleanCoursesList = courses.filter(course => course.courseId !== '' && course.courseType !== '');
        setCourses(cleanCoursesList);
        e.preventDefault();
        const employee = {
            "firstName": firstName,
            "secondName": secondName,
            "lastName": lastName,
            "email": email,
            "phone": phone,
            "jobTitle": jobTitle,
            "academicDegree": academicDegree,
            "dateOfEmployment": dateOfEmployment,
            "departmentId": department.id,
            "employeeCourses": courses
        }
        console.log(employee)
        new EmployeeService().addEmployee(employee)
            .then(({ data: newCourse }) => {
                setEmployees(prevEmployees => [...prevEmployees, newCourse]);
                setEditAreaActive(!editAreaActive)
                setFirstName('')
                setLastName('')
                setSecondName('')
                setEmail('')
                setPhone('')
                setJobTitle('')
                setAcademicDegree('')
                setDateOfEmployment('')
                setDepartment("")
                setCourses([])
            })
            .catch(error => {
                setNotificationActive(true)
                setNotificationText(error.response.data.message)
            });
    };

    return (
        <div>
            <Header />
            <Menu page="employee" />
            <div className={s.content}>
                <div className={s.work_panel}>
                    <div className={s.buttons}>
                        <button onClick={handleAddButtonClick}><img src='../../img/plus.png' alt="set" /></button>
                        <button onClick={handleEditButtonClick}><img src='../../img/edit.png' alt="edit" /></button>
                        <button onClick={handleDeleteButtonClick}><img src='../../img/delete.png' alt="delete" /></button>
                        <button onClick={handleShowDetailsClick}><h3>...</h3></button>
                    </div>
                    <div className={s.ssf}>
                        <div className={s.block}>
                            <p>Поиск</p>
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
                        <div className={s.block}><p>Должность</p>
                            <select
                                onChange={(e) => { }}>
                                <option value="">Выберите должность</option>
                            </select>
                        </div>
                        <div className={s.block}><p>Ученая степень</p>
                            <select
                                onChange={(e) => { }}>
                                <option value="">Выберите ученю степень</option>
                            </select>
                        </div>
                        <button onClick={() => cleanSSF()}>Сбросить</button>
                    </div>
                </div>
                {editAreaActive ?
                    <form onSubmit={handleSaveButtonClick} className={s.edit_area}>
                        <h2>{formName}</h2>
                        <div className={s.inputs}>
                            <div className={s.inputs_col}>
                                <p>Имя</p>
                                <input
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)} />
                                <p>Фамилия</p>
                                <input
                                    required
                                    value={secondName}
                                    onChange={(e) => setSecondName(e.target.value)} />
                                <p>Отчество</p>
                                <input
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)} />
                                <p>Номер телефона</p>
                                <input
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)} />
                                <p>Почта</p>
                                <input
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className={s.inputs_col}>
                                <p>Дата устройства</p>
                                <input
                                    required
                                    type='date'
                                    value={dateOfEmployment}
                                    onChange={(e) => setDateOfEmployment(e.target.value)} />
                                <p>Должность</p>
                                <select
                                    value={jobTitle}
                                    onChange={(e) => {
                                        setJobTitle(e.target.value);
                                    }}>
                                    {jobTitles.map((jobT) => (
                                        <option key={jobT} value={jobT}>
                                            {jobT}
                                        </option>
                                    ))}
                                </select>
                                <p>Ученая степень</p>
                                <select
                                    value={academicDegree}
                                    onChange={(e) => {
                                        setAcademicDegree(e.target.value);
                                    }}>
                                    {academicDegrees.map((ad) => (
                                        <option key={ad} value={ad}>
                                            {ad}
                                        </option>
                                    ))}
                                </select>
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
                            </div>
                        </div>
                        <button type="button" onClick={handleAddCourse}>Добавить дисциплину</button>
                        {renderCourseInputs()}
                        <button>Сохранить</button>
                    </form>
                    : <></>}
                {showEmployeeDetails ?
                    <div className={s.details}>
                        <div className={s.inf}>
                            <div className={s.col}>
                                <div className={s.row}>
                                    <h3 style={{ width: "100px" }}>ФИО</h3>
                                    <h4>{selectedRow.lastName + " " + selectedRow.firstName + " " + selectedRow.secondName}</h4>
                                </div>
                                <div className={s.row}>
                                    <h3 style={{ width: "100px" }}>Телефон</h3>
                                    <h4>{selectedRow.phone}</h4>
                                </div>
                                <div className={s.row}>
                                    <h3 style={{ width: "100px" }}>Email</h3>
                                    <h4>{selectedRow.email}</h4>
                                </div>
                            </div>
                            <div className={s.col}>
                                <div className={s.row}>
                                    <h3>Дата устройства</h3>
                                    <h4>{selectedRow.dateOfEmployment}</h4>
                                </div>
                                <div className={s.row}>
                                    <h3>Должность</h3>
                                    <h4>{selectedRow.jobTitle}</h4>
                                </div>
                                <div className={s.row}>
                                    <h3>Ученая степень</h3>
                                    <h4>{selectedRow.academicDegree}</h4>
                                </div>
                            </div>
                        </div>
                        {selectedRow.employeeCourses.length === 0 ?
                            <></> :
                            <div className={s.courses}>
                                <h3>Преподаваемые дисциплины:</h3>
                                {selectedRow.employeeCourses.map((employeeCourse) => (
                                    <h4>{employeeCourse.course.name + ", " + employeeCourse.courseType}</h4>
                                ))}
                            </div>
                        }
                    </div>
                    : <></>
                }
                <div className={s.table}>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => sortTable('id')}>№</th>
                                <th onClick={() => sortTable('lastName')}>Фамилия</th>
                                <th onClick={() => sortTable('firstName')}>Имя</th>
                                <th onClick={() => sortTable('secondName')}>Отчество</th>
                                <th onClick={() => sortTable('phone')}> Номер телефона</th>
                                <th onClick={() => sortTable('email')}>Почта</th>
                                <th onClick={() => sortTable('dateOfEmployment')}>Дата устройства</th>
                                <th onClick={() => sortTable('jobTitle')}>Должность</th>
                                <th onClick={() => sortTable('academicDegree')}>Ученая степень</th>
                                <th onClick={() => sortTable('departmentAbbreviation')}>Кафедра</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((employee) => (
                                <tr
                                    key={employee.id}
                                    onClick={() => handleEmployeeClick(employee)}
                                    style={{
                                        backgroundColor: (selectedRow === null || selectedRow.id !== employee.id) ? '' : '#cfcfcf'
                                    }}>
                                    <td>{employee.id}</td>
                                    <td>{employee.lastName}</td>
                                    <td>{employee.firstName}</td>
                                    <td>{employee.secondName}</td>
                                    <td>{employee.phone}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.dateOfEmployment}</td>
                                    <td>{employee.jobTitle}</td>
                                    <td>{employee.academicDegree}</td>
                                    <td>{employee.departmentAbbreviation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isAgreeWindowActive &&
                <AgreeWindow
                    setActive={setAgreeWindowActive}
                    fun={deleteEmployee}
                    text={`Вы уверены, что хотите удалить сотрудника ${selectedRow.lastName + " " + selectedRow.firstName
                        + " " + selectedRow.secondName}?`} />
            }
            {notificationActive && <CenterNotification setActive={setNotificationActive} title="Ошибка" text={notificationText} />}
        </div>
    )
}

export default EmployeePage;