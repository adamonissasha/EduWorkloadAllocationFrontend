import api_with_header from "../http/WithHeader";

export default class EmployeeService {
    getAllEmployees() {
        return (
            api_with_header.get('employee')
        );
    }

    deleteEmployee(id) {
        return (
            api_with_header.delete("employee/" + id)
        );
    }

    getJobTitles() {
        return (
            api_with_header.get('employee/job-title')
        );
    }

    getAcademicDegrees() {
        return (
            api_with_header.get('employee/academic-degree')
        );
    }

    addEmployee(employee) {
        return (
            api_with_header.post("employee", employee)
        );
    }
}