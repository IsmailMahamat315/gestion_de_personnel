import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { createEmployee } from '../../actions/employees';

const selectDepartments = state => state.departments;
const selectEmployees = state => state.employees;

/* 🎨 Styled Components */
const PageTitle = styled.h2`
  text-align: center;
  color: #10b981;
  font-weight: 600;
  margin-bottom: 2rem;
  font-size: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const StyledForm = styled(Form)`
  background: #1e293b;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
`;

const StyledButton = styled(Button)`
  min-width: 150px;
  font-weight: 600;
  transition: 0.3s;
  &:hover {
    transform: scale(1.05);
  }
`;

const ErrorText = styled.p`
  color: #f87171;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

function CreateNewEmployee() {
  const departments = useSelector(selectDepartments);
  const employees = useSelector(selectEmployees);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [departmentId, setDepartmentId] = useState('');

  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    department: '',
    exists: '',
  });

  const regex = /^[a-zA-Z]{2,255}$/;

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
      case 'surname':
        if (!value) return `The ${field} cannot be empty`;
        if (value.length < 2) return `The ${field} length must be at least 2`;
        if (value.length > 255) return `The ${field} length must be less than 255`;
        if (!regex.test(value)) return `The ${field} must contain only letters`;
        return '';
      case 'department':
        if (!value) return 'Please select a valid department';
        return '';
      default:
        return '';
    }
  };

  const checkEmployeeExists = () =>
    employees.some(
      emp =>
        emp.name.toLowerCase() === name.toLowerCase() &&
        emp.surname.toLowerCase() === surname.toLowerCase()
    );

  const handleSubmit = e => {
    e.preventDefault();

    const nameErr = validateField('name', name);
    const surnameErr = validateField('surname', surname);
    const departmentErr = validateField('department', departmentId);

    if (checkEmployeeExists()) {
      setErrors({ ...errors, exists: 'This employee already exists' });
      return;
    }

    setErrors({ name: nameErr, surname: surnameErr, department: departmentErr, exists: '' });

    if (!nameErr && !surnameErr && !departmentErr) {
      dispatch(createEmployee(name, surname, departmentId));
      navigate(-1);
    }
  };

  return (
    <Container fluid className="mt-4 d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: '600px' }}>
        <PageTitle>Créer un nouveau Employee</PageTitle>
        <StyledForm onSubmit={handleSubmit}>
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrer le nom de l'employée "
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onBlur={() => setErrors({ ...errors, name: validateField('name', name) })}
                />
                {errors.name && <ErrorText>{errors.name}</ErrorText>}
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Surname</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrer le prenom de l'employée"
                  value={surname}
                  onChange={e => setSurname(e.target.value)}
                  onBlur={() => setErrors({ ...errors, surname: validateField('surname', surname) })}
                />
                {errors.surname && <ErrorText>{errors.surname}</ErrorText>}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Select
              value={departmentId}
              onChange={e => setDepartmentId(e.target.value)}
              onBlur={() =>
                setErrors({ ...errors, department: validateField('department', departmentId) })
              }
            >
              <option value="">Selectionner un departement</option>
              {departments.map(dep => (
                <option key={dep._id} value={dep._id}>
                  {dep.name}
                </option>
              ))}
            </Form.Select>
            {errors.department && <ErrorText>{errors.department}</ErrorText>}
          </Form.Group>

          {errors.exists && <ErrorText>{errors.exists}</ErrorText>}

          <div className="d-flex justify-content-end mt-3">
            <StyledButton
              type="submit"
              variant="success"
              disabled={errors.name || errors.surname || errors.department || !name || !surname || !departmentId}
            >
              Create
            </StyledButton>
          </div>
        </StyledForm>
      </div>
    </Container>
  );
}

export default CreateNewEmployee;
