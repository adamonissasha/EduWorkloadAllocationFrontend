import api_with_header from "../http/WithHeader";

export default class EmployeeService {
    getAllDepartments() {
        return (
            api_with_header.get('department')
        );
    }

    addDepartment(department) {
        return (
            api_with_header.post("department", department)
        );
    }

    editDepartment(id, department) {
        return (
            api_with_header.put("department/" + id, department)
        );
    }

    deleteDepartment(id) {
        return (
            api_with_header.delete("department/" + id)
        );
    }
}