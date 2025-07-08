import React, { useState } from 'react'
import LineChart from '../components/LineChart'
import { motion } from 'framer-motion'
import { Play, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BarGraph from '../components/BarGraph'

const viewHistory = () => {

    const nav = useNavigate();

    const goToDashBoard = () => {
        nav("/dash");
    }

    const [isHovered, setIsHovered] = useState(false);

  return (
 <div className='bg-white w-full h-screen flex flex-col justify-center items-center'>
        
        <div className='w-full py-4 px-1 font-semibold text-2xl pl-4 font-heading flex items-center justify-start'>
            <span>
                <img src="./TRW IMAGE.jpg" alt="logo" className='size-10 mr-5'/>
            </span>
            <span className='bg-gradient-to-r from-red-600 via-pink-600 to-orange-400 bg-clip-text text-transparent'>
                TRW SUN STEERING PRODUCTION DASHBOARD
            </span>
        </div>

        <div className='bg-white w-full flex flex-col md:flex-row '>
          <div className='bg-white md:w-3/4 w-full flex justify-center items-center md:pl-8'>
            <BarGraph/>
          </div>
          <div className='bg-white md:w-1/4 w-full flex flex-col justify-center items-center p-4'>

            <div className='flex flex-col bg-white w-full justify-center items-center'>
              <div className='font-semibold text-lg font-heading'>
                Weekly Analysis 
              </div>
              <div className='w-full flex'>

                <div className='w-5/6 flex flex-col justify-center items-end'>
                    <div className='flex'>
                        <div className='p-1 rounded-md'>
                            Weekly Target :
                        </div>
                        <div className='border border-gray-900 p-1 rounded-md'>
                            1200 units
                        </div>
                    </div>
                    <div className='flex mt-1'>
                        <div className='p-1 rounded-md'>
                            Actual Production :
                        </div>
                        <div className='border border-gray-900 p-1 rounded-md'>
                            1327 units
                        </div>
                    </div>
                </div> 

                <motion.div 
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                className='w-1/6 flex items-center justify-center'>
                    <Play className='-rotate-90 text-green-600'/>
                </motion.div> 

                {
                    isHovered ? 
                    <>
                        <motion.div 
                        initial = {{scale:0, opacity:0}}
                        animate = {{scale:1, opacity:1}}
                        transition={{duration:0.2}}
                        className='fixed right-10 bg-gradient-to-br from-white via-gray-200 to-gray-400 rounded-lg p-4 text-green-700 font-medium' >
                            The Production has increased by 9.6%
                        </motion.div>
                    </> 
                    : 
                    <></>
                }

              </div>

                <div className='mt-5 font-heading'>
                    Weekly Report
                </div>

                <div className='bg-white w-full'>
                     <div className='w-full flex flex-col justify-center items-center'>
                    <div className='flex justify-center items-center w-full'>
                        <div className='p-1 rounded-md w-3/6 text-center'>
                            Avg Production
                        </div>
                        <div className='border border-gray-900 p-1 rounded-md w-2/6 text-cente'>
                            217 Units
                        </div>
                        <div className='pl-2 w-1/6'>
                            <div className='w-2 h-2 rounded-lg bg-green-500'>
                            </div>
                        </div>
                    </div>
                     <div className='flex justify-center items-center w-full'>
                        <div className='p-1 rounded-md w-3/6 text-center'>
                            Efficiency :
                        </div>
                        <div className='border border-gray-900 p-1 rounded-md w-2/6 text-cente'>
                            89 %
                        </div>
                        <div className='pl-2 w-1/6'>
                            <div className='w-2 h-2 rounded-lg bg-orange-400'>
                            </div>
                        </div>
                    </div>
                </div> 
                </div>

            </div>
           
          </div>
        </div> 

        <div className='bg-white w-full flex items-center justify-center'>
            <motion.button 
                whileHover={{scale:1.05}}
                whileTap={{scale:0.95}}
                onClick={()=>goToDashBoard()}
                className='bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-md p-2 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-600'>
                DashBoard
            </motion.button>
        </div>


      </div>
  )
}

export default viewHistory