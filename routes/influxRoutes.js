import express from 'express'
import { handleDeleteMachineData, handleGetMachineData,handleWriteMachineData } from '../controllers/influxController.js'

const router = express.Router();

router.get('/:machine', handleGetMachineData);
router.post('/writeMachineData/:machine',handleWriteMachineData);
router.put('/deleteMachineData/:machine',handleDeleteMachineData)

export default router;
