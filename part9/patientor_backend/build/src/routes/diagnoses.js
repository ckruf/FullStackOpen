"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const diagnosesService_1 = __importDefault(require("../services/diagnosesService"));
const utils_1 = __importDefault(require("../utils"));
const patientsService_1 = __importDefault(require("../services/patientsService"));
const router = express_1.default.Router();
router.get("/", (_req, res) => {
    return res.json(diagnosesService_1.default.getAllDiagnoses());
});
router.post("/", (req, res) => {
    try {
        const newPatient = utils_1.default.toNewPatient(req.body);
        const addedPatient = patientsService_1.default.addPatient(newPatient);
        return res.json(addedPatient);
    }
    catch (error) {
        let errorMessage = "Error when adding new patient";
        if (error instanceof Error) {
            errorMessage += " : " + error.message;
        }
        return res.status(400).json({ error: errorMessage });
    }
});
exports.default = router;
