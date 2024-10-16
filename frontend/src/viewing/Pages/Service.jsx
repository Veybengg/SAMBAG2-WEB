import React from 'react'
import Indigency from '../assets/indigency.png'
import BarangayClearance from '../assets/BarangayClearance.png'
import Business from '../assets/Business.png'

const Service = () => {
  return (
    <div id='services'>
        <div className='bg-[#ECF8F5] h-auto w-auto flex flex-col justify-center items-center pb-10 '>
            <div className='mt-6 mb-10 flex justify-center items-center font-bold pt-3'>
            <span className='text-center text-3xl text-black'>SERVICES</span>
            </div>
            <div className='block px-5 md:flex justify-between gap-6'>
  <div className=' shadow-xl bg-white rounded-[1rem] h-[30rem] w-auto  mt-6 mb-6 flex flex-col justify-center items-center'>
    <img src={Indigency} className='h-[34rem] w-[34rem] rounded-[1.5rem] transform hover:scale-105 transition duration-300 ease-in-out' alt="" />
  </div>
  <div className='shadow-xl bg-white rounded-[1rem] h-[30rem] w-auto  flex flex-col justify-center items-center'>
    <img src={Business} className='h-[34rem] w-[34rem] rounded-[1.5rem] transform hover:scale-105 transition duration-300 ease-in-out ' alt="" />
  </div>
  <div className=' shadow-xl bg-white rounded-[1rem] h-[30rem] w-auto  mt-6 flex flex-col justify-center items-center'>
    <img src={BarangayClearance} className='h-[34rem] w-[34rem] rounded-[1.5rem] transform hover:scale-105 transition duration-300 ease-in-out' alt="" />
  </div>
</div>


        </div>
        
    </div>
  )
}

export default Service