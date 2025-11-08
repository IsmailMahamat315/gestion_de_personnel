import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

import { updateEmployee, deleteEmployee } from '../actions/employees';
import { changeEditRegister } from '../actions/editingRegister';

// Selectors
const selectEmployees = (state) => state.employees;
const selectDepartments = (state) => state.departments;
const selectEditingRegister = (state) => state.editingRegister;

function EmployeeListItem({ employee }) {
  const employees = useSelector(selectEmployees);
  const departments = useSelector(selectDepartments);
  const editingRegister = useSelector(selectEditingRegister);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    department: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    department: '',
  });

  const isEditing =
    editingRegister.isEditing &&
    editingRegister.type === 'employee' &&
    editingRegister.id === employee._id;

  // Pré-remplir le formulaire si on édite
  useMemo(() => {
    if (isEditing) {
      setFormData({
        name: employee.name,
        surname: employee.surname,
        department: employee.department?._id || '',
      });
      setErrors({ name: '', surname: '', department: '' });
    }
  }, [isEditing, employee]);

  /** Validation des champs */
  const validate = (name, surname, department) => {
    const newErrors = { name: '', surname: '', department: '' };
    const regex = /^[a-zA-ZÀ-ÿ\s'-]+$/;

    const checkField = (value, field) => {
      if (!value.trim()) return `Le ${field} ne peut pas être vide.`;
      if (value.length < 2) return `Le ${field} doit contenir au moins 2 caractères.`;
      if (value.length > 255) return `Le ${field} doit contenir moins de 255 caractères.`;
      if (!regex.test(value)) return `Le ${field} doit contenir uniquement des lettres.`;
      return '';
    };

    newErrors.name = checkField(name, 'nom');
    newErrors.surname = checkField(surname, 'prénom');
    newErrors.department = department ? '' : 'Veuillez sélectionner un département.';

    // Vérifie les doublons
    const duplicate = employees.some(
      (e) =>
        e._id !== editingRegister.id &&
        e.name.toLowerCase() === name.toLowerCase() &&
        e.surname.toLowerCase() === surname.toLowerCase()
    );

    if (duplicate) {
      newErrors.name = 'Cet employé existe déjà.';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === '');
  };

  /** Handlers */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    validate(updatedData.name, updatedData.surname, updatedData.department);
  };

  const handleClickEdit = () => {
    dispatch(changeEditRegister('employee', employee._id, true));
  };

  const handleCancelEdit = () => {
    dispatch(changeEditRegister('', '', false));
    setFormData({ name: '', surname: '', department: '' });
    setErrors({ name: '', surname: '', department: '' });
  };

  const handleSubmitEdit = () => {
    if (!validate(formData.name, formData.surname, formData.department)) return;

    dispatch(updateEmployee(employee._id, formData.name, formData.surname, formData.department));
    handleCancelEdit();
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment supprimer cet employé ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) dispatch(deleteEmployee(employee._id));
    });
  };

  return (
    <tr>
      {isEditing ? (
        <>
          <td>
            <Form.Group className="m-2">
              <Form.Control
                type="text"
                name="name"
                placeholder="Nom"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && <p className="text-danger small">{errors.name}</p>}
            </Form.Group>
          </td>
          <td>
            <Form.Group className="m-2">
              <Form.Control
                type="text"
                name="surname"
                placeholder="Prénom"
                value={formData.surname}
                onChange={handleInputChange}
              />
              {errors.surname && <p className="text-danger small">{errors.surname}</p>}
            </Form.Group>
          </td>
          <td>
            <Form.Group className="m-2">
              <Form.Select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              >
                <option value="">Sélectionner un département</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </Form.Select>
              {errors.department && <p className="text-danger small">{errors.department}</p>}
            </Form.Group>
          </td>
        </>
      ) : (
        <>
          <td>{employee.name}</td>
          <td>{employee.surname}</td>
          <td>{employee.department ? employee.department.name : 'Aucun département'}</td>
        </>
      )}

      <td>
        {isEditing ? (
          <>
            <Button
              variant="success"
              className="me-2"
              onClick={handleSubmitEdit}
              disabled={!validate(formData.name, formData.surname, formData.department)}
            >
              Confirmer
            </Button>
            <Button variant="secondary" className="me-2" onClick={handleCancelEdit}>
              Annuler
            </Button>
          </>
        ) : (
          <Button
            variant="warning"
            className="me-2"
            disabled={editingRegister.isEditing}
            onClick={handleClickEdit}
          >
            Modifier
          </Button>
        )}
        <Button
          variant="danger"
          disabled={editingRegister.isEditing}
          onClick={handleDelete}
        >
          Supprimer
        </Button>
      </td>
    </tr>
  );
}

export default EmployeeListItem;
