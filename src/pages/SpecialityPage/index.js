import Header from '../../components/Header';
import s from './speciality.module.scss';
import Menu from '../../components/Menu';
import { useState, useEffect } from 'react';
import SpecialityService from '../../services/SpecialityService';
import DepartmentService from '../../services/DepartmentService';
import AgreeWindow from '../../modalWindow/AgreeModalWindow';
import CenterNotification from '../../modalWindow/CenterNotification';

function SpecialityPage() {
    const [formName, setFormName] = useState("Добавление специальности")
    const [specialities, setSpecialities] = useState([]);
    const [name, setName] = useState('');
    const [profiling, setProfiling] = useState('');
    const [abbreviation, setAbbreviation] = useState('');
    const [code, setCode] = useState('');
    const [faculty, setFaculty] = useState('');
    const [department, setDepartment] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isAgreeWindowActive, setAgreeWindowActive] = useState(false);
    const [notificationActive, setNotificationActive] = useState(false);
    const [notificationText, setNotificationText] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [facultyFilter, setFacultyFilter] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [filteredSpecialities, setFilteredSpecialities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editAreaActive, setEditAreaActive] = useState(false)

    const sortTable = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedData = [...specialities].sort((a, b) => {
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
        setSpecialities(sortedData);
    };

    const filterData = () => {
        if (searchTerm || departmentFilter || facultyFilter) {
            let filteredData = [...specialities];

            if (departmentFilter) {
                filteredData = filteredData.filter((sp) => sp.department.id === parseInt(departmentFilter));
            }

            if (facultyFilter) {
                filteredData = filteredData.filter((sp) => sp.faculty === facultyFilter);
            }

            if (searchTerm) {
                const term = searchTerm.toLowerCase();

                filteredData = filteredData.filter(
                    (sp) => {
                        const name = sp.name ? sp.name.toLowerCase() : '';
                        const profiling = sp.profiling ? sp.profiling.toLowerCase() : '';
                        const abbreviation = sp.abbreviation ? sp.abbreviation.toLowerCase() : '';
                        const code = sp.code ? sp.code.toLowerCase() : '';
                        const planFileName = sp.planFileName ? sp.planFileName.toLowerCase() : '';

                        return (
                            name.includes(term) ||
                            profiling.includes(term) ||
                            abbreviation.includes(term) ||
                            code.includes(term) ||
                            planFileName.includes(term)
                        );
                    }
                );
            }

            setFilteredSpecialities(filteredData);
        } else {
            setFilteredSpecialities(specialities);
        }
    };

    useEffect(() => {
        filterData();
    }, [specialities, departmentFilter, facultyFilter, searchTerm]);

    const cleanSSF = () => {
        setDepartmentFilter("")
        setFacultyFilter("")
        setSearchTerm("")
    }

    useEffect(() => {
        new SpecialityService().getAllSpecialities()
            .then(({ data }) => {
                setSpecialities(data)
            });
        new SpecialityService().getAllFaculties()
            .then(({ data }) => {
                setFaculties(data.faculties)
                if (data.faculties.length > 0) {
                    setFaculty(data.faculties[0]);
                }
            });
        new DepartmentService().getAllDepartments()
            .then(({ data }) => {
                setDepartments(data)
                if (data.length > 0) {
                    setDepartment(data[0]);
                }
            });
    }, []);

    const handleSpecialityClick = (speciality) => {
        setSelectedRow(speciality);
    };

    const handleAddButtonClick = () => {
        setEditAreaActive(!editAreaActive)
        setName("");
        setProfiling("")
        setAbbreviation("");
        setCode("")
        setFaculty(faculties[0])
        setDepartment(departments[0]);
        setIsEdit(false);
        setFormName("Добавление специальности")
    };

    const handleEditButtonClick = () => {
        if (selectedRow === null) {
            setNotificationActive(true);
            if (editAreaActive) {
                setEditAreaActive(false)
            }
            setNotificationText("Выберите специальность для редактирования!");
        } else {
            setIsEdit(true);
            setEditAreaActive(!editAreaActive)
            setFormName("Форма редактирования специальности")
            setName(selectedRow.name);
            setProfiling(selectedRow.profiling)
            setAbbreviation(selectedRow.abbreviation);
            setDepartment(selectedRow.department);
            setCode(selectedRow.code);
            setFaculty(selectedRow.faculty)
        }
    };

    const handleDeleteButtonClick = () => {
        if (selectedRow === null) {
            setNotificationActive(true);
            setNotificationText("Выберите специальность для удаления!");
        } else {
            setIsEdit(false);
            setAgreeWindowActive(true);
        }
    };

    const handleSaveButtonClick = (e) => {
        e.preventDefault();
        const speciality = {
            'name': name,
            'profiling': profiling,
            'abbreviation': abbreviation,
            'code': code,
            'faculty': faculty,
            'departmentId': department.id,
        }

        if (isEdit) {
            new SpecialityService().editSpeciality(speciality)
                .then(response => {
                    const updatedSpecialitys = specialities.map(speciality => {
                        if (speciality.id === selectedRow.id) {
                            return { ...speciality, ...{ name, abbreviation, code, faculty, department, planFileName: response.data.planFileName } };
                        }
                        return speciality;
                    });
                    setName("");
                    setProfiling("")
                    setAbbreviation("");
                    setCode("")
                    setFaculty(faculties[0])
                    setDepartment(departments[0]);
                    setEditAreaActive(!editAreaActive)
                    setSpecialities(updatedSpecialitys);
                })
                .catch(error => {
                    setNotificationActive(true)
                    setNotificationText(error.response.data.message)
                });
        } else {
            new SpecialityService().addSpeciality(speciality)
                .then(({ data: newSpeciality }) => {
                    setSpecialities(prevSpecialitys => [...prevSpecialitys, newSpeciality]);
                    setName("");
                    setProfiling("")
                    setAbbreviation("");
                    setCode("")
                    setFaculty(faculties[0])
                    setDepartment(departments[0]);
                    setEditAreaActive(!editAreaActive)
                    setIsEdit(false);
                })
                .catch(error => {
                    setNotificationActive(true)
                    setNotificationText(error.response.data.message)
                });
        }
    };

    const deleteSpeciality = () => {
        setAgreeWindowActive(false);
        setSelectedRow(null)
        new SpecialityService().deleteSpeciality(selectedRow.id)
            .then(() => {
                setSpecialities(prevSpecialitys =>
                    prevSpecialitys.filter(speciality => speciality.id !== selectedRow.id)
                );
            })
    };

    return (
        <div>
            <Header />
            <Menu page="speciality" />
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
                        <div className={s.block}><p>Факультет</p>
                            <select
                                value={facultyFilter}
                                onChange={(e) => {
                                    setFacultyFilter(e.target.value);
                                }}>
                                <option value="">Выберите факультет</option>
                                {faculties.map((f) => (
                                    <option key={f} value={f}>
                                        {f}
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
                        <div className={s.inputs}>
                            <div className={s.inputs_col}>
                                <p>Название</p>
                                <input
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <p>Профилизация</p>
                                <input
                                    required
                                    value={profiling}
                                    onChange={(e) => setProfiling(e.target.value)}
                                />
                                <p>Аббревиатура</p>
                                <input
                                    required
                                    value={abbreviation}
                                    onChange={(e) => setAbbreviation(e.target.value)}
                                />
                            </div>
                            <div className={s.inputs_col}>
                                <p>Код специальности</p>
                                <input
                                    required
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                                <p>Факультет</p>
                                <select
                                    value={faculty}
                                    onChange={(e) => {
                                        setFaculty(e.target.value);
                                    }}>
                                    {faculties.map((f) => (
                                        <option key={f} value={f}>
                                            {f}
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
                        <button>Сохранить</button>
                    </form>
                    : <></>}
                <div className={s.table}>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => sortTable('id')}>№</th>
                                <th onClick={() => sortTable('name')}>Название</th>
                                <th onClick={() => sortTable('profiling')}>Профилизация</th>
                                <th onClick={() => sortTable('abbreviation')}>Аббревиатура</th>
                                <th onClick={() => sortTable('code')}>Код</th>
                                <th onClick={() => sortTable('faculty')}>Факультет</th>
                                <th onClick={() => sortTable('department')}>Кафедра</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredSpecialities.map((sp) => (
                                    <tr
                                        key={sp.id}
                                        onClick={() => handleSpecialityClick(sp)}
                                        style={{
                                            backgroundColor: (selectedRow === null || selectedRow.id !== sp.id) ? '' : '#cfcfcf'
                                        }}>
                                        <td>{sp.id}</td>
                                        <td>{sp.name}</td>
                                        <td>{sp.profiling}</td>
                                        <td>{sp.abbreviation}</td>
                                        <td>{sp.code}</td>
                                        <td>{sp.faculty}</td>
                                        <td>{sp.department.abbreviation}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isAgreeWindowActive &&
                <AgreeWindow
                    setActive={setAgreeWindowActive}
                    fun={deleteSpeciality}
                    text={`Вы уверены, что хотите удалить срециальность \"${selectedRow.name}\"?`} />
            }
            {notificationActive && <CenterNotification setActive={setNotificationActive} text={notificationText} />}
        </div >
    )
}

export default SpecialityPage;