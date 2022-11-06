import express from 'express';
import cors from "cors";

import diagnosesApiRouter from "./routes/diagnoses";
import patientsApiRouter from "./routes/patients";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

app.use("/api/diagnoses", diagnosesApiRouter);
app.use("/api/patients", patientsApiRouter);

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});