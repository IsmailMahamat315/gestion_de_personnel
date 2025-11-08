import { useSelector } from 'react-redux';
import { Container, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import EmployeeListItem from '../../components/EmployeeListItem';

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

const StyledButton = styled(Button)`
  min-width: 160px;
  font-weight: 600;
  transition: 0.3s;
  &:hover {
    transform: scale(1.05);
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
`;

function EmployeeList() {
  const employees = useSelector(selectEmployees);

  return (
    <Container fluid className="mt-4">
      <PageTitle>Employees</PageTitle>

      <div className="d-flex justify-content-end mb-3">
        <StyledButton variant="success" size="lg">
          <Link
            to="/employees/create"
            className="text-light"
            style={{ textDecoration: 'none' }}
          >
            Créer un employée
          </Link>
        </StyledButton>
      </div>

      <TableWrapper>
        <Table striped bordered hover variant="dark" responsive className="mb-0">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prenom</th>
              <th>Departément</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <EmployeeListItem key={employee._id} employee={employee} />
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
}

export default EmployeeList;
