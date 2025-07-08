import express from 'express'
import { handleDeleteMachineData, HandleGetInitialData, handleGetMachineData,handleWriteMachineData } from '../controllers/influxController.js'

const router = express.Router();

router.get('/:machine', handleGetMachineData);
router.get('/initData/:machine',HandleGetInitialData);
router.post('/writeMachineData/:machine',handleWriteMachineData);
router.put('/deleteMachineData/:machine',handleDeleteMachineData);

export default router;
