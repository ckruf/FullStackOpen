import express from "express";
import patientsService from "../services/patientsService";
import utils from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.json(patientsService.getAllPatientsPublic());
});

router.post("/", (req, res) => {
  try {
    const newPatient = utils.toNewPatient(req.body);
    const addedPatient = patientsService.addPatient(newPatient);
    return res.json(addedPatient);
  }
  catch (error: unknown) {
    let errorMessage = "Error when adding new patient";
    if (error instanceof Error) {
      errorMessage += " : " + error.message;
    }
    return res.status(400).json({error: errorMessage});
  }
});

router.get("/:id", (req, res) => {
  const possiblePatient = patientsService.getSinglePatientDetail(req.params.id);
  if (possiblePatient) {
    return res.json(possiblePatient);
  }
  else {
    return res.status(404).json({error: "Patient not found"});
  }
});



export default router;