import { getMachineData, writeMachineData,getInitialData } from '../services/influxService.js'
import { deleteMachineData } from '../services/influxService.js';

export async function handleGetMachineData(req, res) {
  const { machine } = req.params

  try {
    const data = await getMachineData(machine,true);
    res.json(data)
  } catch (err) {
    console.error('Error fetching data:', err)
    res.status(500).json({ error: 'Failed to fetch machine data' })
  }
}

export async function handleWriteMachineData(req, res) {
  const { machine } = req.params
  console.log(machine);
  
  const data1 = req.body;
  console.log(data1);
  try {
    const data = await writeMachineData(machine,data1);
    res.json({message:"Data get added successfully",data})
  } catch (err) {
    console.error('Error while writing data:', err)
    res.status(500).json({ error: 'Failed to write machine data' })
  }
}

export async function handleDeleteMachineData(req, res) {
  const { machine } = req.params;

  try {
    await deleteMachineData(machine);
    res.status(200).json({ message: `All data for ${machine} deleted.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete data.' });
  }
}

export async function HandleGetInitialData(req, res) {
  const { machine } = req.params;

  try {
    const data = await getInitialData(machine);
    res.status(200).json({ message: `Initial data of ${machine} get fetched successfully`, data});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch initial data' });
  }
}