import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import socket from '../socket.js'
import { useDataStore } from '../store/dataStore.js'

const Home = () => {

    const nav = useNavigate();
    const {getData} = useDataStore();

    const handleDashboard = () => {
        getData(1);
        nav("/dash");
    }

  return (
    <div className='w-full h-screen flex flex-col justify-center items-center bg-white'>
        <div className='font-heading font-bold md:text-4xl flex mb-10'>
            <span className='bg-green-500'>
                <img src="./TRW IMAGE.jpg" alt="logo" className='size-5 md:size-16'/>
            </span>
            <span className='w-2'>

            </span>
            <span className='bg-gradient-to-br from-red-500 via-pink-600 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center'>
                TRW SUN STEERING
            </span>
        </div>

        <motion.div 
            initial = {{opacity : 0 , y: 15}}
            animate = {{opacity : 1, y: 0}}
            transition={{duration:0.5}}
            whileHover={{scale:1.05}}
            whileTap={{scale:0.95}}
            className='bg-gradient-to-br from-red-500 via-pink-600 to-cyan-500 p-0.5 rounded-xl'
            >
            <motion.button 
                whileHover={{scale:1}}
                onClick={() => handleDashboard()}
                className='bg-white p-2 rounded-lg font-heading font-bold'>
                <span className='bg-gradient-to-br from-red-500 via-pink-600 to-cyan-600 bg-clip-text text-transparent hover:bg-gradient-to-bl'>
                    DashBoard
                </span>
            </motion.button>
        </motion.div>

        <motion.div
            initial ={{scale:0}}
            animate ={{scale:1}}
            transition={{duration:0.3, ease:"easeOut"}}
            className='fixed -top-48 -left-48 w-96 h-96 md:-top-[300px] md:-left-[300px] md:w-[600px] md:h-[600px] bg-gradient-to-br from-red-600 via-pink-600 to-orange-600 rounded-full'
        >
        </motion.div>

        <motion.div
            initial ={{scale:0}}
            animate ={{scale:1}}
            transition={{duration:0.5, ease:"easeOut"}}
            className='fixed -bottom-48 -right-48 w-96 h-96 md:-bottom-[450px] md:-right-[450px] md:w-[900px] md:h-[900px] bg-gradient-to-br from-cyan-400 via-blue-600 to-orange-600 rounded-full'
        >
        </motion.div>

    </div>
  )
}

export default Home