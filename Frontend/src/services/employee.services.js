import http from "../http-common";

class EmployeeService {
  getAll() {
    return http.get("/employees");
  }

  create(employeeData) {
    // employeeData doit contenir: { name, surname, email, password, role, department }
    return http.post("/employees", employeeData);
  }

  update(id, employeeData) {
    return http.put(`/employees/${id}`, employeeData);
  }

  delete(id) {
    return http.delete(`/employees/${id}`);
  }
}

export default new EmployeeService();
