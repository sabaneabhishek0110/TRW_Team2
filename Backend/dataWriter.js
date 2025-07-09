import { writeApi } from "./influxClient.js";
import { getInitialData, writeMachineData } from "./services/influxService.js"

async function addData(measurement){ 

    const response = await getInitialData("machine1");
    const countArray = response.data?.data?.map(item => item.count);
    console.log(countArray);
    
    let count = 0;
    let i = 0 ;
    let sec = 0;
    if(!response || !countArray){
        i = 0 ;
        sec= 0 ;
    }
    else{
        console.log("error here");
        console.log(response);
        
        count = countArray[countArray.length - 1]
        i = response.data?.data[0]?.shift ; 
        sec = countArray?.length
    } 



    setInterval(() => {
        sec += 1 ;
        if(count < 140){
            count +=  (4 + Math.floor(Math.random()*5)) 
        }
        else {
            count += Math.floor(Math.random()*5)
        }
        if(sec%60==0){
            count = 0 ; 
            i+=1;
        }
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
