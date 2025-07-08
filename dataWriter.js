import { writeMachineData } from "./services/influxService.js"

async function addData(measurement){
    let count = 0;
    let i = 1;

    setInterval(() => {
        count += 1
        if(count%60==0){i+=1;}
        const temp = (40 + Math.random() * 10).toFixed(2)       
        const pressure = (1.0 + Math.random() * 0.5).toFixed(2) 

        writeMachineData(measurement,{count:count,station:measurement,temp:temp,pressure:pressure,shift:i});
        console.log(`Data written: count=${count}, temp=${temp}, pressure=${pressure}`)
    }, 1000) 

    process.on('SIGINT', async () => {
        console.log('Gracefully exiting...')
        await writeApi.close()
        process.exit(0)
    })
}
addData('machine1');