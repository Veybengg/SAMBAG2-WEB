import React, { useState } from 'react';

const SKCard = ({ name, position, image }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className='flex flex-col mx-14 mt-20 relative items-center justify-center'>
      <div className="absolute inset-0 flex items-center mr-[7.5rem] mb-[8.5rem] justify-center">
        <img src={image} className='w-56 h-56 rounded-full z-10' onClick={toggleDetails} />
      </div>
      <div className='h-[30rem] w-3/4 flex flex-col items-center justify-center relative rounded-lg bg-white opacity-65'>
        <span className='py-1 text-[27px] font-bold rounded-md w-60 mt-[11.5rem] text-center'>{position}</span>
        <h3 className='text-[20px] font-semibold italic rounded-md w-96 text-center'>{name}</h3>
        {showDetails && (
          <div className="mt-4">
            {/* Add individual details here */}
            {/* Example: */}
            {/* <p>Name: {name}</p> */}
            {/* <p>Position: {position}</p> */}
            {/* Add more details as needed */}
          </div>
        )}
      </div>
    </div>
  );
};

export default SKCard;
