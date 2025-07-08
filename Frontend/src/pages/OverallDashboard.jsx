
import React, { useEffect, useState } from 'react';
import LineChart from '../components/LineChart';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/dataStore.js';
import socket from '../socket.js';

const OverallDashboard = () => {
  const nav = useNavigate();
  const { getData } = useDataStore();

  const [array1, setArr] = useState([]);
  const [newVal, setNewVal] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // 🟢 Step 1: Fetch Initial Data from Backend
  useEffect(() => {
    getData(1, (countArray) => {
      setArr(countArray); // set initial graph data
    });
  }, []);

  // 🟢 Step 2: Start Real-time Data Stream
  useEffect(() => {
    const handleData = (data) => {
      const count = data[0]?.count;
      if (typeof count === "number") {
        setNewVal(count);
        setArr(prev => {
          const updated = [...prev, count];
          if (updated.length > 60) return updated;
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

  // 🛑 Utility to stop socket when navigating
  const stopSocketStream = () => {
    socket.emit("stop-stream", { measurement: "Machine1" });
    socket.off("machine1-data");
  };

  // 🧭 Navigation handlers
  const goTo = (path) => {
    stopSocketStream();
    nav(path);
  };

  return (
    <div className='bg-white w-full h-screen flex flex-col justify-center items-center'>
      {/* Header */}
      <div className='w-full py-4 px-1 font-semibold text-sm md:text-2xl pl-4 font-heading flex items-center justify-start'>
        <img src="./TRW IMAGE.jpg" alt="logo" className='size-10 mr-5'/>
        <span className='bg-gradient-to-r from-red-600 via-pink-600 to-orange-400 bg-clip-text text-transparent'>
          TRW SUN STEERING PRODUCTION DASHBOARD
        </span>
      </div>

      {/* Chart + Controls */}
      <div className='bg-white w-full flex flex-col md:flex-row'>
        <div className='bg-white md:w-3/4 w-full flex justify-center items-center md:pl-8'>
          <LineChart Chartname="Overall Production" arr={array1} newval={newVal} />
        </div>

        {/* Sidebar */}
        <div className='bg-white md:w-1/4 w-full flex flex-col justify-center items-center p-4'>
          <div className='flex flex-col w-full items-center'>
            <div className='font-semibold text-lg'>Overall analysis</div>
            <div className='w-full flex'>
              <div className='w-5/6 flex flex-col items-end'>
                <div className='flex'>
                  <div className='p-1'>Target Production:</div>
                  <div className='border border-gray-900 p-1 rounded-md'>125 units</div>
                </div>
                <div className='flex mt-1'>
                  <div className='p-1'>Actual Production:</div>
                  <div className='border border-gray-900 p-1 rounded-md'>107 units</div>
                </div>
              </div>
              <motion.div
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className='w-1/6 flex items-center justify-center'>
                <Play className='rotate-90 text-red-600'/>
              </motion.div>
            </div>

            {isHovered && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className='fixed right-10 bg-gradient-to-br from-white via-gray-200 to-gray-400 rounded-lg p-4 text-red-700 font-medium'>
                The Production has dropped by 14.4%
              </motion.div>
            )}
          </div>

          {/* Machine Buttons */}
          {[
            { name: 'Machine 1', color: 'green', percent: '95%', path: '/machine1' },
            { name: 'Machine 2', color: 'red', percent: '45%', path: '/machine2' },
            { name: 'Machine 3', color: 'orange', percent: '73%', path: '/machine3' },
            { name: 'Machine 4', color: 'green', percent: '87%', path: '/machine4' }
          ].map((machine, idx) => (
            <motion.div key={idx} className='w-full text-center pb-1 flex justify-center'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goTo(machine.path)}
                className='bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-md p-2'>
                {machine.name}
              </motion.button>
              <div className='flex items-center pl-1'>
                <div className={`w-2 h-2 rounded-lg bg-${machine.color}-600 pl-2`}></div>
                <div className='text-sm font-medium pl-2'>{machine.percent}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* View History */}
      <div className='bg-white w-full flex items-center justify-center'>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => goTo("/viewhistory")}
          className='bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-md p-2'>
          View History
        </motion.button>
      </div>
    </div>
  );
};

export default OverallDashboard;
