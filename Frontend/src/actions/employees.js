import {
    CREATE_EMPLOYEE,
    RETRIEVE_EMPLOYEES,
    UPDATE_EMPLOYEE,
    DELETE_EMPLOYEE,
  } from "./types";
  
  import { isLoading, apiError, retrieveDepartments } from "./departments";
  import EmployeeService from "../services/employee.services";
  
  /**
   * =========================
   * 🔹 ACTIONS PRINCIPALES
   * =========================
   */
  
  // 🔸 Créer un employé
  export const createEmployee = (name, surname, departmentId) => async (dispatch) => {
    dispatch(isLoading(true));
    console.info("🔸 [Employee Action] Création d’un employé...");
  
    try {
      const response = await EmployeeService.create(name, surname, departmentId);
      console.info("✅ [Employee Action] Création réussie :", response);
  
      dispatch(createEmployeeResponse(response.data.returnEmployee));
    } catch (error) {
      console.error("❌ [Employee Action] Échec de la création :", error);
      dispatch(apiError());
    } finally {
      dispatch(isLoading(false));
    }
  };
  
  // 🔸 Récupérer tous les employés
  export const retrieveEmployees = () => async (dispatch) => {
    dispatch(isLoading(true));
    console.info("🔹 [Employee Action] Récupération de tous les employés...");
  
    try {
      const response = await EmployeeService.getAll();
      console.info("✅ [Employee Action] Récupération réussie :", response);
  
      dispatch(retrieveEmployeesResponse(response.data));
    } catch (error) {
      console.error("❌ [Employee Action] Échec de la récupération :", error);
      dispatch(apiError());
    } finally {
      dispatch(isLoading(false));
    }
  };
  
  // 🔸 Mettre à jour un employé
  export const updateEmployee = (id, name, surname, departmentId) => async (dispatch) => {
    dispatch(isLoading(true));
    console.info(`🟡 [Employee Action] Mise à jour de l’employé ${id}...`);
  
    try {
      const response = await EmployeeService.update(id, name, surname, departmentId);
      console.info("✅ [Employee Action] Mise à jour réussie :", response);
  
      dispatch(updateEmployeeResponse(response.data.updatedEmployee));
      dispatch(retrieveDepartments()); // Met à jour la liste des départements liés
    } catch (error) {
      console.error("❌ [Employee Action] Échec de la mise à jour :", error);
      dispatch(apiError());
    } finally {
      dispatch(isLoading(false));
    }
  };
  
  // 🔸 Supprimer un employé
  export const deleteEmployee = (id) => async (dispatch) => {
    dispatch(isLoading(true));
    console.info(`🗑️ [Employee Action] Suppression de l’employé ${id}...`);
  
    try {
      const response = await EmployeeService.delete(id);
      console.info("✅ [Employee Action] Suppression réussie :", response);
  
      dispatch(deleteEmployeeResponse(id));
      dispatch(retrieveDepartments()); // Mise à jour des départements après suppression
    } catch (error) {
      console.error("❌ [Employee Action] Échec de la suppression :", error);
      dispatch(apiError());
    } finally {
      dispatch(isLoading(false));
    }
  };
  
  /**
   * =========================
   * 🔹 ACTIONS INTERNES (Reducers)
   * =========================
   */
  
  const createEmployeeResponse = (data) => ({
    type: CREATE_EMPLOYEE,
    payload: data,
  });
  
  const retrieveEmployeesResponse = (data) => ({
    type: RETRIEVE_EMPLOYEES,
    payload: data,
  });
  
  const updateEmployeeResponse = (data) => ({
    type: UPDATE_EMPLOYEE,
    payload: data,
  });
  
  const deleteEmployeeResponse = (id) => ({
    type: DELETE_EMPLOYEE,
    payload: id,
  });
  