import api_with_header from "../http/WithHeader";
import axios from "axios";

export default class EmployeeService {
    getAllFaculties() {
        return (
            api_with_header.get('speciality/faculty')
        );
    }

    getAllSpecialities() {
        return (
            api_with_header.get('speciality')
        );
    }

    addSpeciality(data) {
        return (
            axios.post("http://localhost:8765/common/speciality", data, {
                withCredentials: true,
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                    "Content-Type": "multipart/form-data"
                },
            })
        );
    }

    editSpeciality(id, data) {
        return (
            axios.put("http://localhost:8765/common/speciality/" + id, data, {
                withCredentials: true,
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                    "Content-Type": "multipart/form-data"
                },
            })
        );
    }

    deleteSpeciality(id) {
        return (
            api_with_header.delete("speciality/" + id)
        );
    }

    downloadFile(id) {
        return (
            api_with_header.get("speciality/downloadPlan/" + id, {
                responseType: 'blob'
            }));
    }
}