
import React, { useEffect, useState } from 'react';
import LineChart from '../components/LineChart';
import { motion } from 'framer-motion';
import { Leaf, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/dataStore.js';
import socket from '../socket.js';

const Machine2 = () => {
  const nav = useNavigate();
  const { getData, arr, Tarr, Parr } = useDataStore();

  const [array1, setArr] = useState([]);
  const [Temparray1, setTempArr] = useState([]);
  const [Pressurearray1, setPressureArr] = useState([]);


  const [newVal, setNewVal] = useState(0);
  const [newTemp, setNewTemp] = useState(0);
  const [newPressure, setNewPressure] = useState(0);


  const [isHovered, setIsHovered] = useState(false);
  const [shouldReload, setShouldReload] = useState(0);

  useEffect(() => {
    if (shouldReload) {
      window.location.reload();
      console.log("Page reloaded");
      
      setShouldReload(0);
    }
  }, [shouldReload]);

  useEffect(() => {
    getData(1, (obj) => {
      setArr(obj.countArray);
      setTempArr(obj.tempArray);
      setPressureArr(obj.pressureArray);
      console.log(obj, "this is obj");
      
    });
  }, []);

  useEffect(() => {
    const handleData = (data) => {
      const count = data[0]?.count;
      const temprature = data[0]?.temp;
      const pressure = data[0]?.pressure;
      if (typeof count === "number") {
        setNewVal(count);
        setArr(prev => {
          const updated = [...prev, count];
          if (updated.length > 60) { setShouldReload(1) ; return updated; }
          return updated;
        });
        setNewTemp(temprature);
        setTempArr(prev => {
          const updated = [...prev, temprature];
          return updated;
        });
        setNewPressure(pressure);
        setPressureArr(prev => {
          const updated = [...prev, pressure]; 
          return updated;
        });
      }
    };

    socket.emit("machine1-stream", { measurement: "Machine1" });
    socket.on("machine1-data", handleData);

    return () => {
      socket.emit("stop-stream", { measurement: "Machine1" });
      socket.off("machine1-data", handleData);
    };
  }, []);

  const stopSocketStream = () => {
    socket.emit("stop-stream", { measurement: "Machine1" });
    socket.off("machine1-data");
  };
  const goTo = (path) => {
    stopSocketStream();
    nav(path);
  };

  return (
    <div className='bg-white w-full h-screen flex flex-col justify-center items-center'>
      <div className='w-full py-4 px-1 font-semibold text-sm md:text-2xl pl-4 font-heading flex items-center justify-start'>
        <img src="./TRW IMAGE.jpg" alt="logo" className='size-10 mr-5'/>
        <span className='bg-gradient-to-r from-red-600 via-pink-600 to-orange-400 bg-clip-text text-transparent'>
          TRW SUN STEERING PRODUCTION DASHBOARD
        </span>
      </div>

      <div className='bg-white w-full flex flex-col md:flex-row'>
        <div className='bg-white md:w-3/4 w-full flex justify-center items-center md:pl-8'>
          <LineChart Chartname="Machine 1 Production" arr={array1} newval={newVal} newTemp={newTemp} newPressure={newPressure} />
        </div>

        <div className='bg-white md:w-1/4 w-full flex flex-col justify-center items-center p-4'>
          <div className='flex flex-col w-full items-center'>
            <div className='font-semibold text-lg mb-2'>Machine 1 Analysis</div>
            <div className='w-full flex'>
              <div className='w-5/6 flex flex-col items-end'>
                <div className='flex'>
                  <div className='p-1'>Target Production:</div>
                  <div className='border border-gray-900 p-1 rounded-md'>300 units</div>
                </div>
                <div className='flex mt-1'>
                  <div className='p-1'>Actual Production:</div>
                  <div className='border border-gray-900 p-1 rounded-md'>{newVal || 0} units</div>
                </div>
              </div>
              
              {
                newVal > array1.length*5 ?
                
                <>
                <motion.div
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className='w-1/6 flex items-center justify-center'>
                <Play className='-rotate-90 text-green-600'/>
                </motion.div> 
                </>
                
                : <>
                {
                  newVal > (array1.length*5 - 3)? 
                  
                  <>
                    <motion.div
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    className='w-1/6 flex items-center justify-center'>
                    <Leaf className=' text-orange-600'/>
                    </motion.div>
                  </> 
                  
                  : 
                  
                  <> 
                    <motion.div
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    className='w-1/6 flex items-center justify-center'>
                    <Play className='rotate-90 text-red-600'/>
                    </motion.div>
                  </>
                  
                }
              </>
              }
            </div>

             {isHovered && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className='fixed right-10 backdrop-blur-md rounded-lg p-4 text-red-700 font-medium border-b-2 border-red-600'>
                  The Production has dropped by {newVal / (array1.length)*0.05 || 0} %
                </motion.div>
              )}
          </div>

          <motion.div className='flex'>
            <div className='font-medium md:text-lg p-2'>
              Temprature
            </div>
            {
              newTemp > 120 ?

              <div className='p-2 font-medium md:text-lg text-red-600'>
                {newTemp}
              </div>
            :
              <>
              {
                newTemp > 100 ? 
              <div className='p-2 font-medium md:text-lg text-orange-400'>
                {newTemp}
              </div>
                :
              <div className='p-2 font-medium md:text-lg text-green-400'>
                {newTemp}
              </div>

            }
              </>

            }
          </motion.div>
          <motion.div className='flex'>
            <div className='font-medium md:text-lg p-2'>
              Pressure
            </div>
            {
              newPressure > 100 ?

              <div className='p-2 font-medium md:text-lg text-red-600'>
                {newPressure}
              </div>
            :
              <div className='p-2 font-medium md:text-lg text-green-400'>
                {newPressure}
              </div>

            }
          </motion.div>
        </div>
      </div>

      {/* View History */}
      <div className='bg-white w-full flex items-center justify-center'>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => goTo("/dash")}
          className='bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-md p-2'>
          DashBoard
        </motion.button>
      </div>
    </div>
  );
};

export default Machine2;
