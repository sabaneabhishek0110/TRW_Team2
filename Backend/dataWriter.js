import { sendEmailInternal, sendSMS, sendSMSInternal } from "./controllers/UserController.js";
import { writeApi } from "./influxClient.js";
import { getInitialData, writeMachineData } from "./services/influxService.js"

async function addData(measurement){ 

    const response = await getInitialData("machine1");
    const countArray = response.map(item => item.count);
    console.log(response, "shift array");
    
    let count = 0;
    let i = 0 ;
    let sec = 0;
    let notsend1 = true ;
    let notsend2 = true ;
    let notsend3 = true ;

    let notsend4 = true ;
    let notsend5 = true ;
    let notsend6 = true ;
    if(!response || !countArray){
        i = 0 ;
        sec= 0 ;
    }
    else{
        console.log("error here");
        console.log(response);
        
        count = countArray[countArray.length - 1]
        i = response[0].shift ; 
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
        const temp = Math.floor(60 + Math.random() * 100)       
        const pressure = Math.floor(40 + Math.random() * 80)

        if(temp < 130 && temp > 120 && notsend1){ sendSMSInternal({phone : "9579061042", alertType : "highTemp", value : temp}); notsend1 = false; }
        else if(temp < 140 && temp > 130 && notsend2){ sendSMSInternal({phone : "8788330498", alertType : "highTemp", value : temp}); notsend2 = false;}
        else if(temp > 140 && notsend3){ sendSMSInternal({phone : "8390378000", alertType : "highTemp", value : temp}); notsend3 = false;}
        
        if(pressure < 90 && pressure > 80 && notsend4){ sendEmailInternal({email:"sabaneabhishek0110@gmail.com", alertType : "highPressure", value :pressure}); notsend4 = false; }
        else if(pressure < 100 && pressure > 90 && notsend5){ sendEmailInternal({email:"omkar.sankpal2004.5@gmail.com", alertType : "highPressure", value : pressure}); notsend5 = false;}
        else if(pressure > 100 && notsend6){ sendEmailInternal({email:"mayurpimp3986@gmail.com", alertType : "highPressure", value : pressure}); notsend6 = false;}
        


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
