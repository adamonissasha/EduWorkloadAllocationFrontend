import api_with_header from "../http/WithHeader";

export default class EmployeeService {
    getAllCourses() {
        return (
            api_with_header.get('course')
        );
    }

    addCourse(course) {
        return (
            api_with_header.post("course", course)
        );
    }

    editCourse(id, course) {
        return (
            api_with_header.put("course/" + id, course)
        );
    }

    deleteCourse(id) {
        return (
            api_with_header.delete("course/" + id)
        );
    }
}