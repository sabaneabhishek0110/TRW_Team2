// src/components/LineChart.jsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useRef, useState } from 'react';
import socket from '../socket.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ Chartname, arr, newval}) => {
  console.log(newval, "Newval"); 

  const [color, setColor] = useState("gray");
  const predictedData = Array.from({ length: 60 }, (_, i) => 5 * (i + 1));

  useEffect(() => {
    const i = arr.length; // current index is length of array
    const expected = predictedData[i] ?? 0;
    
    if (newval < expected - 25) {
      setColor("red");
    } else if (newval < expected - 15) {
      setColor("orange");
    } else if (newval > expected + 5) {
      setColor("green");
    } else {
      setColor("gray");
    }
  }, [newval, arr]);

  const labels = Array.from({ length: 60 }, (_, i) => i + 1);

  const isSmallScreen = window.innerWidth < 768;
  const pointRadius = isSmallScreen ? 0 : 3;
  const borderWidth = isSmallScreen ? 1 : 3;

  const data = {
    labels,
    datasets: [
      {
        label: 'Predicted Units',
        data: predictedData,
        borderColor: 'black',
        backgroundColor: 'white',
        tension: 0,
        pointRadius,
        pointHoverRadius: 4,
        pointHitRadius: 5,
        pointBorderWidth: 1,
        borderWidth,
      },
      {
        label: 'Actual Units',
        data: arr,
        borderColor: color,
        backgroundColor: 'white',
        tension: 0.2,
        pointRadius,
        pointHoverRadius: 4,
        pointHitRadius: 5,
        pointBorderWidth: 1,
        borderWidth,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `${Chartname}` },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;


// // src/components/LineChart.jsx
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { useEffect, useRef, useState } from 'react';
// import socket from '../socket.js';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const LineChart = ({ Chartname }) => {
//   const [actualdata, setActualData] = useState([]);
//   const [color, setColor] = useState("orange");
//   const listenerSet = useRef(false);

//   const predictedData = Array.from({ length: 60 }, (_, i) => 5 * (i + 1));
//   const labels = Array.from({ length: 60 }, (_, i) => i + 1);

//  useEffect(() => {
   
//   if (listenerSet.current) return; // prevent re-registering
//   listenerSet.current = true;
//   socket.emit('machine1-stream', { Chartname, c: true });
  
//   const handleMachineData = (incoming) => {

//     console.log(incoming, 'a');
    
//     if (Array.isArray(incoming) && incoming.length > 0 && incoming.length <= 60) {
//       const count = incoming[0]?.count;
//       if (typeof count === 'number') {
//         setActualData(prev => {
//           const updated = [...prev, count];
//           if (updated.length > 60) updated.shift(); // keep max 60

//           // ✅ Color logic should go here to always use correct length
//           const index = updated.length - 1;
//           const expected = 5 * (index + 1);

//           if (count < expected - 20) setColor("red");
//           else if (count < expected - 10) setColor("orange");
//           else if (count > expected + 5) setColor("green");
//           else setColor("gray");

//           return updated;
//         });
//       }
//     }
//   };

//   socket.on('machine1-data', handleMachineData);

//   return () => {
//     socket.off('machine1-data', handleMachineData); // ✅ clean it up!
//     listenerSet.current = false; // allow future remount
//   };
// }, []);

//   const isSmallScreen = window.innerWidth < 768;
//   const pointRadius = isSmallScreen ? 0 : 3;
//   const borderWidth = isSmallScreen ? 1 : 3;

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: 'Predicted Units',
//         data: predictedData,
//         borderColor: 'black',
//         backgroundColor: 'white',
//         tension: 0,
//         pointRadius,
//         pointHoverRadius: 4,
//         pointHitRadius: 5,
//         pointBorderWidth: 1,
//         borderWidth,
//       },
//       {
//         label: 'Actual Units',
//         data: actualdata,
//         borderColor: color,
//         backgroundColor: 'white',
//         tension: 0.2,
//         pointRadius,
//         pointHoverRadius: 4,
//         pointHitRadius: 5,
//         pointBorderWidth: 1,
//         borderWidth,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: true, text: `${Chartname}` },
//     },
//   };

//   return <Line data={data} options={options} />;
// };

// export default LineChart;
