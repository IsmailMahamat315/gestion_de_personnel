import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";

import { updateDepartment, deleteDepartment } from "../../actions/departments";
import { changeEditRegister } from "../../actions/editingRegister";

/* 🎨 Thème de couleur */
const COLORS = {
  background: "#0f172a",
  card: "#1e293b",
  accent: "#10b981",
  text: "#f8fafc",
  error: "#ef4444",
  tableHeader: "#334155",
};

/* 🔹 Conteneur principal */
const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: ${COLORS.background};
`;

/* 🔹 Carte/Table wrapper */
const Card = styled.div`
  background: ${COLORS.card};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
`;

/* 🔹 Titre */
const Title = styled.h2`
  color: ${COLORS.accent};
  text-align: center;
  margin-bottom: 1.5rem;
`;

/* 🔹 Bouton principal */
const Button = styled.button`
  background: ${({ variant }) =>
    variant === "danger"
      ? "#ef4444"
      : variant === "warning"
      ? "#facc15"
      : COLORS.accent};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover:enabled {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  a {
    color: #fff;
    text-decoration: none;
  }
`;

/* 🔹 Input inline pour édition */
const Input = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #334155;
  background: ${COLORS.background};
  color: ${COLORS.text};
  font-size: 16px;
  transition: border 0.3s, box-shadow 0.3s;

  &:focus {
    border-color: ${COLORS.accent};
    box-shadow: 0 0 6px ${COLORS.accent};
    outline: none;
  }
`;

/* 🔹 Texte d’erreur */
const ErrorText = styled.p`
  color: ${COLORS.error};
  margin-top: 0.25rem;
  font-size: 14px;
`;

/* 🔹 Table stylisée */
const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 1.5rem;

  th,
  td {
    padding: 0.75rem 1rem;
    text-align: left;
  }

  thead {
    background: ${COLORS.tableHeader};
    color: #fff;
  }

  tbody tr {
    border-bottom: 1px solid #334155;
    transition: background 0.3s;
  }

  tbody tr:hover {
    background: #334155;
  }
`;

const selectDepartments = (state) => state.departments;
const selectEditingRegister = (state) => state.editingRegister;

function DepartmentList() {
  const departments = useSelector(selectDepartments);
  const editingRegister = useSelector(selectEditingRegister);
  const dispatch = useDispatch();

  const [editName, setEditName] = useState(
    editingRegister.isEditing && editingRegister.type === "department"
      ? departments.find((dept) => dept._id === editingRegister.id).name
      : ""
  );
  const [error, setError] = useState(" ");

  const regex = /[a-zA-Z\s]/g;

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteDepartment(id));
      }
    });
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setEditName(newValue);
    validateName(newValue);
  };

  const validateName = (value) => {
    if (value === "") setError("The name cannot be empty");
    else if (value.length < 2) setError("The name must be at least 2 characters");
    else if (value.length > 255) setError("The name must be less than 255 characters");
    else if (!regex.test(value)) setError("The name must contain only letters");
    else if (checkNameExists(value)) setError("The name already exists");
    else setError("");
  };

  const checkNameExists = (nameCheck) => {
    return departments.some(
      (department) =>
        department._id !== editingRegister.id &&
        department.name.toUpperCase() === nameCheck.toUpperCase()
    );
  };

  const handleClickEdit = (id) => {
    dispatch(changeEditRegister("department", id, true));
    setEditName(departments.find((dept) => dept._id === id).name);
  };

  const handleSubmitEdit = (id) => {
    dispatch(changeEditRegister("", "", false));
    dispatch(updateDepartment(id, editName));
    setEditName("");
    setError(" ");
  };

  const handleCancelEdit = (id) => {
    dispatch(changeEditRegister("", "", false));
    setEditName("");
    setError(" ");
  };

  return (
    <Container>
      <Title>Departments</Title>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <Button variant="success" size="lg">
          <Link to={"/departments/create"}>Create new Department</Link>
        </Button>
      </div>

      <Card>
        <Table>
          <colgroup>
            <col style={{ width: "60%" }} />
            <col style={{ width: "40%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department._id}>
                <td>
                  {editingRegister.isEditing &&
                  editingRegister.type === "department" &&
                  editingRegister.id === department._id ? (
                    <div>
                      <Input
                        type="text"
                        value={editName}
                        onChange={handleInputChange}
                        placeholder="Enter department name"
                      />
                      {error && <ErrorText>{error}</ErrorText>}
                    </div>
                  ) : (
                    <Link
                      to={`/departments/${department.name}`}
                      style={{ textDecoration: "none", color: COLORS.text }}
                    >
                      {department.name}
                    </Link>
                  )}
                </td>
                <td>
                  {editingRegister.isEditing &&
                  editingRegister.type === "department" &&
                  editingRegister.id === department._id ? (
                    <>
                      <Button
                        variant="success"
                        disabled={!!error}
                        onClick={() => handleSubmitEdit(department._id)}
                      >
                        Confirm
                      </Button>
                      <Button variant="warning" onClick={() => handleCancelEdit(department._id)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="warning"
                        disabled={editingRegister.isEditing}
                        onClick={() => handleClickEdit(department._id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        disabled={editingRegister.isEditing}
                        onClick={() => handleDelete(department._id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}

export default DepartmentList;
