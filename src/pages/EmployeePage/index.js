import AdminHeader from '../../components/AdminHeader';
import s from './employee.module.scss';
import Menu from '../../components/Menu';
import React, { useState } from 'react';
import EmployeeService from '../../services/EmployeeService';

function EmployeePage() {
    const [employees, setEmployees] = useState([]);
    const [firstName, addFirstName] = useState('');
    const [secondName, addSecondName] = useState('');
    const [lastName, addLastName] = useState('');
    const [phone, addPhone] = useState('');
    const [email, addEmail] = useState('');
    const [dateOfEmployment, addDateOfEmployment] = useState('');
    const [jobTitle, addJobTitle] = useState('');
    const [academicDegree, addAcademicDegree] = useState('');
    const [department, addDepartment] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);

    React.useEffect(() => {
        new EmployeeService().getAllEmployees()
            .then(({ data }) => setEmployees(data));
    }, []);

    const handleEmployeeClick = (employee) => {
        setSelectedRow(employee.id === selectedRow ? null : employee.id);
        // addFirstName(employee.firstName);
        // addSecondName(employee.secondName);
        // addLastName(employee.lastName);
        // addPhone(employee.phone);
        // addEmail(employee.email);
        // addDateOfEmployment(employee.dateOfEmployment);
        // addJobTitle(employee.jobTitle);
        // addAcademicDegree(employee.academicDegree);
        // addDepartment(employee.departmentAbbreviation);
    };

    return (
        <div>
            <AdminHeader />
            <Menu />
            <div className={s.content}>
                {/* <div>
                    <div className={s.buttons}>

                    </div> */}
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
                                <th>Дата устройства</th>
                                <th>Должность</th>
                                <th>Ученая степень</th>
                                <th>Кафедра</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr
                                    key={employee.id}
                                    onClick={() => handleEmployeeClick(employee)}
                                    style={{
                                        backgroundColor: selectedRow === employee.id ? '#cfcfcf' : ''
                                    }}
                                >
                                    <td>{employee.id}</td>
                                    <td>{employee.firstName}</td>
                                    <td>{employee.secondName}</td>
                                    <td>{employee.lastName}</td>
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
                {/* </div> */}
                <form className={s.edit_area}>
                    <p>Имя</p>
                    <input
                        required
                        value={firstName}
                        onChange={(e) => addFirstName(e.target.value)} />
                    <p>Фамилия</p>
                    <input
                        required
                        value={secondName}
                        onChange={(e) => addSecondName(e.target.value)} />
                    <p>Отчество</p>
                    <input
                        required
                        value={lastName}
                        onChange={(e) => addLastName(e.target.value)} />
                    <p>Номер телефона</p>
                    <input
                        required
                        value={phone}
                        onChange={(e) => addPhone(e.target.value)} />
                    <p>Почта</p>
                    <input
                        required
                        value={email}
                        onChange={(e) => addEmail(e.target.value)} />
                    <p>Дата устройства</p>
                    <input
                        required
                        value={dateOfEmployment}
                        onChange={(e) => addDateOfEmployment(e.target.value)} />
                    <p>Должность</p>
                    <input
                        required
                        value={jobTitle}
                        onChange={(e) => addJobTitle(e.target.value)} />
                    <p>Ученая степень</p>
                    <input
                        required
                        value={academicDegree}
                        onChange={(e) => addAcademicDegree(e.target.value)} />
                    <p>Кафедра</p>
                    <input
                        required
                        value={department}
                        onChange={(e) => addDepartment(e.target.value)} />
                    <button>Сохранить</button>
                </form>
            </div>
        </div>
    )
}

export default EmployeePage;