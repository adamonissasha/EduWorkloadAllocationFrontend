import Header from '../../components/Header';
import s from './department.module.scss';
import Menu from '../../components/Menu';
import { useEffect, useState } from 'react';
import DepartmentService from '../../services/DepartmentService';
import AgreeWindow from '../../modalWindow/AgreeModalWindow';
import CenterNotification from '../../modalWindow/CenterNotification';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [formName, setFormName] = useState("Добавление кафедры")
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [editAreaActive, setEditAreaActive] = useState(false)

    const sortTable = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedData = [...departments].sort((a, b) => {
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
        setDepartments(sortedData);
    };

    const filterData = () => {
        if (searchTerm) {
            let filteredData = [...departments];

            if (searchTerm) {
                const term = searchTerm.toLowerCase();

                filteredData = filteredData.filter(
                    (sp) => {
                        const name = sp.name ? sp.name.toLowerCase() : '';
                        const abbreviation = sp.abbreviation ? sp.abbreviation.toLowerCase() : '';
                        const phone = sp.phone ? sp.phone.toLowerCase() : '';

                        return (
                            name.includes(term) ||
                            abbreviation.includes(term) ||
                            phone.includes(term)
                        );
                    }
                );
            }

            setFilteredDepartments(filteredData);
        } else {
            setFilteredDepartments(departments);
        }
    };

    useEffect(() => {
        filterData();
    }, [departments, searchTerm]);

    const cleanSSF = () => {
        setSearchTerm("")
    }

    useEffect(() => {
        new DepartmentService().getAllDepartments()
            .then(({ data }) => setDepartments(data));
    }, []);

    const handleDepartmentClick = (department) => {
        setSelectedRow(department);
    };

    const handleAddButtonClick = () => {
        setEditAreaActive(!editAreaActive)
        setName("");
        setAbbreviation("");
        setPhone("");
        setIsEdit(false);
        setFormName("Добавление кафедры")
    };

    const handleEditButtonClick = () => {
        if (selectedRow === null) {
            setNotificationActive(true);
            if (editAreaActive) {
                setEditAreaActive(false)
            }
            setNotificationText("Выберите кафедру для редактирования!");
        } else {
            setFormName("Редактирование кафедры")
            setIsEdit(true);
            setEditAreaActive(!editAreaActive)
            setName(selectedRow.name);
            setAbbreviation(selectedRow.abbreviation);
            setPhone(selectedRow.phone);
        }
    };

    const handleDeleteButtonClick = () => {
        if (selectedRow === null) {
            setNotificationActive(true);
            setNotificationText("Выберите кафедру для удаления!");
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
                    setEditAreaActive(!editAreaActive)
                    setName('')
                    setAbbreviation('')
                    setPhone('')
                })
                .catch(error => {
                    setNotificationActive(true)
                    setNotificationText(error.response.data.message)
                });
        } else {
            const department = {
                "name": name,
                "abbreviation": abbreviation,
                "phone": phone
            }
            new DepartmentService().addDepartment(department)
                .then(({ data: newDepartment }) => {
                    setDepartments(prevDepartments => [...prevDepartments, newDepartment]);
                    setEditAreaActive(!editAreaActive)
                    setName('')
                    setAbbreviation('')
                    setPhone('')
                })
                .catch(error => {
                    setNotificationActive(true)
                    setNotificationText(error.response.data.message)
                });
        }
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
            <Menu page="department" />
            <div className={s.content}>
                <div className={s.work_panel}>
                    <div className={s.buttons}>
                        <button onClick={handleAddButtonClick}><img src='../../img/plus.png' alt="add" /></button>
                        <button onClick={handleEditButtonClick}><img src='../../img/edit.png' alt="edit" /></button>
                        <button onClick={handleDeleteButtonClick}><img src='../../img/delete.png' alt="delete" /></button>
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
                        <button onClick={() => cleanSSF()}>Сбросить</button>
                    </div>
                </div>
                {editAreaActive ?
                    <form className={s.edit_area} onSubmit={handleSaveButtonClick}>
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
                        <p>Номер телефона</p>
                        <input
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
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
                                <th onClick={() => sortTable('phone')}>Номер телефона</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDepartments.map((department) => (
                                <tr
                                    key={department.id}
                                    onClick={() => handleDepartmentClick(department)}
                                    style={{
                                        backgroundColor: (selectedRow === null || selectedRow.id !== department.id) ? '' : '#cfcfcf'
                                    }}>
                                    <td>{department.id}</td>
                                    <td>{department.name}</td>
                                    <td>{department.abbreviation}</td>
                                    <td>{department.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {
                isAgreeWindowActive &&
                <AgreeWindow
                    setActive={setAgreeWindowActive}
                    fun={deleteDepartment}
                    text={`Вы уверены, что хотите удалить кафедру \"${selectedRow.name}\"?`} />}
            {notificationActive && <CenterNotification setActive={setNotificationActive} title="Ошибка" text={notificationText} />}
        </div>
    )
}

export default DepartmentPage;