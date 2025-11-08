import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createDepartment } from "../../actions/departments";

/* 🎨 Couleurs et styles */
const COLORS = {
  background: "#0f172a",
  card: "#1e293b",
  accent: "#10b981",
  text: "#f8fafc",
  error: "#ef4444",
};

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: ${COLORS.background};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Card = styled.div`
  background: ${COLORS.card};
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h2`
  text-align: center;
  color: ${COLORS.accent};
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  color: ${COLORS.text};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
  border-radius: 8px;
  border: 1px solid #334155;
  background: ${COLORS.background};
  color: ${COLORS.text};
  font-size: 16px;
  transition: border 0.3s, box-shadow 0.3s;

  &:focus {
    border-color: ${COLORS.accent};
    box-shadow: 0 0 8px ${COLORS.accent};
    outline: none;
  }
`;

const Button = styled.button`
  background: ${COLORS.accent};
  color: #fff;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:enabled {
    background: #059669;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: ${COLORS.error};
  margin-top: 0.5rem;
  font-size: 14px;
`;

function CreateNewDepartment() {
  const navigate = useNavigate();
  const departments = useSelector((state) => state.departments);
  const dispatch = useDispatch();

  const nameRef = useRef("");
  const [error, setError] = useState("");
  const [existsError, setExistsError] = useState("");

  const regex = /^[a-zA-Z\s]+$/;

  const validateName = (value) => {
    if (!value) return "The name cannot be empty";
    if (value.length < 2) return "The name must be at least 2 characters";
    if (value.length > 255) return "The name must be less than 255 characters";
    if (!regex.test(value)) return "The name must contain only letters";
    return "";
  };

  const checkExists = (value) => {
    return departments.some(
      (dept) => dept.name.toLowerCase() === value.toLowerCase()
    );
  };

  const handleChange = () => {
    const value = nameRef.current.value;
    setError(validateName(value));
    if (checkExists(value)) setExistsError("This department already exists");
    else setExistsError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = nameRef.current.value;
    const validationError = validateName(value);

    if (validationError) {
      setError(validationError);
      return;
    }
    if (checkExists(value)) {
      setExistsError("This department already exists");
      return;
    }

    dispatch(createDepartment(value));
    navigate(-1); // Retour à la page précédente
  };

  return (
    <Container>
      <Card>
        <Title>Create New Department</Title>
        <form onSubmit={handleSubmit}>
          <Label htmlFor="deptName">Department Name</Label>
          <Input
            id="deptName"
            type="text"
            placeholder="Enter department name"
            ref={nameRef}
            onChange={handleChange}
          />
          {error && <ErrorText>{error}</ErrorText>}
          {existsError && <ErrorText>{existsError}</ErrorText>}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
            <Button type="submit" disabled={!!error}>
              Create
            </Button>
          </div>
        </form>
      </Card>
    </Container>
  );
}

export default CreateNewDepartment;
