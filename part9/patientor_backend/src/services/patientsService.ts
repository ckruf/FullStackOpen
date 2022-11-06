import patientsData from "../../data/patients";
import { PublicPatient, NewPatient, Patient } from "../types";
import { v1 as uuid } from "uuid";

const getAllPatientsPublic = (): Array<PublicPatient> => 
patientsData
.map(({id, name, dateOfBirth, gender, occupation}) => {
  return {
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  };
});

const addPatient = (newPatientData: NewPatient): Patient => {
  const id = uuid();
  const newPatient = {
    id,
    ...newPatientData
  };
  patientsData.push(newPatient);
  return newPatient;
};

export default {
  getAllPatientsPublic,
  addPatient
};