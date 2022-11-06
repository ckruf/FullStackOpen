import diagnosesData from "../../data/diagnoses";
import { Diagnose } from "../types";

const getAllDiagnoses = (): Array<Diagnose>  => diagnosesData;

export default { getAllDiagnoses };