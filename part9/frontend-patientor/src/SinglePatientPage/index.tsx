import React from "react";
import axios from "axios";
import { Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useStateValue } from "../state";
import { Patient } from "../types";
import { apiBaseUrl } from "../constants";


const SinglePatientPage = () => {
  const { id } = useParams<{ id: string }>();
  if (!id || typeof id !== "string") {
    return <h1>Patient id must be provided in URL</h1>;
  }
  const [{ patients }, dispatch ] = useStateValue();
  const patient = patients[id];

  if (!patient) {
    return <h1>Unknown patient</h1>;
  }

  React.useEffect(() => {
    if (Object.prototype.hasOwnProperty.call(patient, "ssn") && Object.prototype.hasOwnProperty.call(patient,"entries")) {
      return;
    }

    const fetchPatientDetail = async (id: string) => {
      try {
        const { data: patientDetail } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        dispatch({ type: "SET_PATIENT_DETAIL", payload: patientDetail});
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          console.error(e?.response?.data || "Unrecognized axios error");
        } else {
          console.error("Unknown error", e);
        }
      }
    };
    void fetchPatientDetail(id);
  
  }, [dispatch, id]);
  

  return (
    <>
      <Typography variant="h6">
        {patient.name}
      </Typography>
      <ul>
        <li>occupation: {patient.occupation}</li>
        <li>gender: {patient.gender}</li>
        <li>ssn: {patient.ssn}</li>
        <li>date of birth: {patient.dateOfBirth}</li>
      </ul>
      <Typography variant="h6">
        patient&apos;s entries:
      </Typography>
      <ul>
      </ul>

    </>
  ); 
};

export default SinglePatientPage;