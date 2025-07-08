import { writeMachineData } from "./services/influxService.js"

async function addData(measurement){
    let count = 0

    setInterval(() => {
    count += 1
    const temp = (40 + Math.random() * 10).toFixed(2)       // e.g., 40 - 50 °C
    const pressure = (1.0 + Math.random() * 0.5).toFixed(2)  // e.g., 1.0 - 1.5 bar

    writeMachineData(measurement,{count:count,station:measurement,temp:temp,pressure:pressure});
    console.log(`Data written: count=${count}, temp=${temp}, pressure=${pressure}`)
    }, 1000) 

    process.on('SIGINT', async () => {
        console.log('Gracefully exiting...')
        await writeApi.close()
        process.exit(0)
    })
}
addData('machine1');