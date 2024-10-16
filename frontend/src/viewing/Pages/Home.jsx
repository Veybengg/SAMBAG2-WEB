import { useState, useRef, } from 'react';
import "slick-carousel/slick/slick.css";

import Slider from "react-slick";
import { Carousel } from "@material-tailwind/react";
import roncal from '../../assets/viewing/roncal.png';
import Aguilar from '../../assets/viewing/Aguilar.png';
import Quijote from '../../assets/viewing/Quijote.png';
import Bacus from '../../assets/viewing/Bacus.png';
import Amance from '../../assets/viewing/Amance.png';
import Jagmoc from '../../assets/viewing/Jagmoc.jpg';
import Jimenez from '../../assets/viewing/Jimenez.png';
import Paras from '../../assets/viewing/Paras.png';
import Sean from '../../assets/viewing/Sean.png';
import Tigley from '../../assets/viewing/Tigley.png';
import brgy1 from '../../assets/viewing/brgy1.jpg';
import brgy2 from '../../assets/viewing/brgysambag.jpg';
import brgy3 from '../../assets/viewing/brgy3.jpg';
import kn from '../../assets/viewing/kn.png';
import aileen from '../../assets/viewing/aileen.png';
import aznar from '../../assets/viewing/aznar.png';
import cabahay from '../../assets/viewing/cabahay.png';
import belarmino from '../../assets/viewing/belarmino.png';
import jagmoc from '../../assets/viewing/jagmoc.png';
import malalay from '../../assets/viewing/malalay.png';
import lorete from '../../assets/viewing/lorete.png';
import arrowIcon from '../../assets/viewing/arrowdown.png';
import capt from '../../assets/viewing/capt.png';
import img from '../../assets/viewing/Homepage.jpg';
import bgOfficials from '../../assets/viewing/bgofficials.png';
import '../Pages/home.css'; 
import leftArrowIcon from '../../assets/viewing/6.png'; 
import rightArrowIcon from '../../assets/viewing/7.png'; 

const Home = () => {
  const homeRef = useRef(null);
  const contact = useRef(null);
  const aboutUsRef = useRef(null);
  const sliderRef = useRef(null);
  const [showVision, setShowVision] = useState(true);


  const toggleVision = () => {
    setShowVision(true);
  };

  const toggleMission = () => {
    setShowVision(false);
  };

  const scrollToAboutUs = () => {
    aboutUsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const PrevArrow = ({ onClick }) => (
    <button
      className="slick-arrow slick-prev absolute left-[-0rem] top-1/2 transform -translate-y-1/2 z-10"
      onClick={onClick}
    >
      <img src={leftArrowIcon} alt="Previous" className="w-13 h-14" />
    </button>
  );
  
  const NextArrow = ({ onClick }) => (
    <button
      className="slick-arrow slick-next absolute right-[-.5rem] top-1/2 transform -translate-y-1/2 z-10"
      onClick={onClick}
    >
      <img src={rightArrowIcon} alt="Next" className="w-13 h-14" />
    </button>
  );
  
  
  
  const settings = {
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 2000,
        settings: {
          slidesToShow: 3
        }
      },
    ]
  };

  return (
    <div id="home" ref={homeRef}>
  <div className='bg-image h-auto w-full pb-[6rem]' style={{ backgroundColor: "rgba(138, 37, 44, 0.85)", backgroundImage: `url(${img})` }}>
    <div className="absolute h-[50rem] inset-0 opacity-65" style={{ backgroundColor: "rgba(138, 37, 44, 0.85)" }}></div>
    <div className='relative'>
      <div className='flex flex-col mx-10 pt-[15rem]'>
      <div className='border border-[#E3BA2B] bg-[#E3BA2B] w-[calc(100%/10)] h-2'></div>
        <div className='text-white text-[65px] font-bold opacity-100'>BARANGAY SAMBAG 2</div>
        <span className='text-white text-[26px] font-bold px-1 -mt-4'>Urgello, Cebu City, Cebu</span>
        <div className='text-white shadow-xl text-[17px] font-bold pt-1 pl-[5px]'>
          <h3>“𝑺𝒕𝒓𝒊𝒗𝒊𝒏𝒈 𝒕𝒐𝒘𝒂𝒓𝒅𝒔 𝒄𝒐𝒏𝒕𝒊𝒏𝒖𝒂𝒍 𝒅𝒆𝒗𝒆𝒍𝒐𝒑𝒎𝒆𝒏𝒕 𝒇𝒐𝒓 𝒕𝒉𝒆 𝒈𝒓𝒆𝒂𝒕𝒆𝒓 𝒈𝒐𝒐𝒅 𝒐𝒇 𝒐𝒖𝒓 𝒄𝒐𝒎𝒎𝒖𝒏𝒊𝒕𝒚.”</h3>
        </div>
        <div className="flex justify-center items-center pt-32">
  <button onClick={scrollToAboutUs} className="flex items-center gap-2 bg-[#8A252C] text-white font-bold rounded-[5px] hover:bg-[#ffff]  hover:text-black hover:rounded-[5px] text-center py-2 px-5 text-[20px]">
    DISCOVER MORE
    <img src={arrowIcon} alt="Arrow Down" className="w-6 h-6" />
  </button>
</div>
      </div>
    </div>
  </div>


      <div ref={aboutUsRef} className='About'>
        <div className='bg-[#FFF6F0]  w-full h-auto relative shadow-md'>  
          <div className='flex justify-center pt-10 text-[2rem] font-bold '>
            <span className='text-black text-center'>ABOUT US</span>
            
          </div>
          <div className='block lg:flex lg:justify-between item justify-center mx-auto px-6 pt-5'>
            <div className='flex justify-center lg:pt-[2rem]'>
              <Carousel
                autoplayDelay={2000}
                autoplay
                loop
                className="rounded-xl  h-60 w-[25rem] sm:w-[29rem] md:w-[30rem] xl:w-[31rem]">
                <img
                  src={brgy2}
                  alt="image 1"
                  className="h-full w-full object-cover absolute"
                />
                <img
                  src={brgy1}
                  alt="image 2"
                  className="h-full w-full object-cover absolute"
                />
                <img
                  src={brgy3}
                  alt="image 3"
                  className="h-full w-full object-cover absolute"
                />
              </Carousel>
            </div>
            <div className='flex flex-col justify-center items-center mt-10'>
            <p className='text-justify px-auto sm:px-6 md:px-8 lg:px-10 xl:px-20 pt-1'>
              In Cebu City's past, Osmeña Boulevard, lined with tamarind trees, was known as Sambag District. This area was later divided into Barangay Sambag Uno and Dos. Early settlers came due to the nearby train terminal. Established families include the Solon, Rallos, Caballes, and Urgello. The area even served as a meeting point for Filipino revolutionaries. Sambag Dos gained prominence due to President Osmeña's mansion and the construction of Southern Islands Hospital. Osmeña Boulevard's development attracted residents seeking proximity to key locations. Today, Sambag Dos is a bustling but challenged urban barangay facing issues like squatting, unemployment, and narrow roads. Most residents are migrants who rely on blue-collar jobs to make ends meet. Now, Sambag 2 has 18 sitio with 12,693 residents.
            </p>
        <div className='flex gap-10 justify-center mt-16 text-lg font-medium'>
        <span className={`text-white shadow-md bg-[#741F1F] cursor-pointer transform hover:scale-110 hover:bg-[#FFFFFF] transition duration-300 ease-in-out  rounded-md px-2 py-1 ${showVision ? 'bg-opacity-100' : 'bg-opacity-50'}`} onClick={toggleVision}>Vision</span>
        <span className={`text-white shadow-md bg-[#741F1F] cursor-pointer transform hover:scale-110 hover:bg-[#FFFFFF] transition duration-300 ease-in-out  rounded-md px-2 py-1 ${!showVision ? 'bg-opacity-100' : 'bg-opacity-50'}`} onClick={toggleMission}>Mission</span>
      </div>
      
      <div className='flex flex-col lg:flex-row justify-between items-center shadow-md bg-white mt-4 rounded-lg p-4'>
        {showVision ? (
          <div className='w-auto md:w-[30rem] pr-8 mb-6 lg:mb-0 lg:pr-0 text-sm leading-relaxed text-justify'>
            We envision our Municipality as one of the major global tourist destinations with self-reliant, peaceful, progressive, healthy environment-friendly and GOD centered community living in a very rich natural resources, supported by dedicated leaders and genuine people's participation towards better quality of life.
          </div>
        ) : (
          <div className='w-auto md:w-[30rem] pr-8 mb-6 lg:mb-0 lg:pr-0 text-sm leading-relaxed text-justify '>
            We are committed to promoting the general welfare of the people by providing quality basic services, encouraging people's participation, protecting our natural resources, and advancing the ECO-tourism industry to achieve a self-reliant, peaceful, progressive, healthy, environment-friendly, and GOD-centered community.
          </div>
          )}
          </div>

          </div>
        </div>
        <div className='block md:flex justify-center mt-10'>
          <div className=''>
            <img src={capt} alt="" />
          </div>
          <div className='block text-justify mx-10 w-auto'>
            <div className='flex items-center justify-center gap-2'>
              <span className='border w-10 border-[#FBCF32] mt-6'></span>
              <span className='mt-6 font-bold text-lg'>Barangay Captain</span>
            </div>
            <div className='w-auto md:w-[25rem]'>
              <h2 className='mt-4 font-bold text-xl'>Keith Noel Wenceslao</h2>
              <h3 className='mt-4'>"Alone, we can do so little; together, we can do so much." - Hellen Keller</h3>
              <p className='mt-4'>A dedicated Barangay Captain that fosters a self-reliant, progressive community in Sambag Dos, Cebu City. He champions initiatives addressing challenges like squatting and unemployment while promoting environmental sustainability.</p>
            </div>
            
          </div>
        </div>
        </div>
</div>

<div style={{ backgroundImage: `url(${bgOfficials})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
  <div className=' pb-1'>
    <div className='h-auto w-full'>
      <div className='flex justify-center items-center font-bold text-4xl pt-10'>
        <span id="barangay-officials" className='text-white text-center'>
          BARANGAY SAMBAG 2 <br/>
          <span className=''>OFFICIALS</span>
        </span>
      </div>
    </div>

          <div className="h-[37rem] w-100% mr-10 mb-9 ml-10 items-center bg-white bg-opacity-30 mt-4  justify-center">
          <Slider {...settings} className='pb-20'>
            <div className='flex flex-col mx-14 mt-16 relative items-center justify-center'>
            <div className='h-[30rem] w-3/4 flex flex-col items-center justify-center  rounded-lg bg-[#FFFFFF] bg-opacity-70 relative'>
                <img src={kn} className='absolute h-56 w-56 rounded-full top-14 z-10' alt="" />
                <span className='py-1 text-[27px] font-bold rounded-md w-60 mt-[11.5rem] text-center  opacity-65'>Barangay Captain</span>
                <h3 className='text-[20px] font-semibold italic rounded-md w-96 text-center  opacity-65'>Hon. Keith Noel T. Wenceslao</h3>
              </div> 
            </div>

            <div className='flex flex-col mx-14 mt-16 relative items-center justify-center'>
            <div className='h-[30rem] w-3/4 flex flex-col items-center justify-center  rounded-lg  bg-[#FFFFFF] bg-opacity-70 relative'>
                <img src={aileen} className='absolute h-56 w-56 rounded-full top-14 z-10' alt="" />
                <span className='py-1 text-[27px] font-bold rounded-md w-60 mt-[11.5rem] text-center  opacity-65'>Barangay Councilor</span>
                <h3 className='text-[20px] font-semibold italic rounded-md w-96 text-center  opacity-65'>Hon. Aileen C. Tecson</h3>
              </div> 
            </div>

            <div className='flex flex-col mx-14 mt-16 relative items-center justify-center'>
            <div className='h-[30rem] w-3/4 flex flex-col items-center justify-center  rounded-lg  bg-[#FFFFFF] bg-opacity-70 relative'>
                <img src={cabahay} className='absolute h-56 w-56 rounded-full top-14 z-10' alt="" />
                <span className='py-1 text-[27px] font-bold rounded-md w-60 mt-[11.5rem] text-center  opacity-65'>Barangay Councilor</span>
                <h3 className='text-[20px] font-semibold italic rounded-md w-96 text-center  opacity-65'>Hon. Randie D. Cababahay</h3>
              </div> 
            </div>

            <div className='flex flex-col mx-14 mt-16 relative items-center justify-center'>
            <div className='h-[30rem] w-3/4 flex flex-col items-center justify-center  rounded-lg  bg-[#FFFFFF] bg-opacity-70 relative'>
                <img src={belarmino} className='absolute h-56 w-56 rounded-full top-14 z-10' alt="" />
                <span className='py-1 text-[27px] font-bold rounded-md w-60 mt-[11.5rem] text-center  opacity-65'>Barangay Councilor</span>
                <h3 className='text-[20px] font-semibold italic rounded-md w-96 text-center  opacity-65'>Hon. Carl Stephen D. Belarmino</h3>
              </div> 
            </div>

            <div className='flex flex-col mx-14 mt-16 relative items-center justify-center'>
            <div className='h-[30rem] w-3/4 flex flex-col items-center justify-center  rounded-lg bg-[#FFFFFF] bg-opacity-70 relative'>
                <img src={jagmoc} className='absolute h-56 w-56 rounded-full top-14 z-10' alt="" />
                <span className='py-1 text-[27px] font-bold rounded-md w-60 mt-[11.5rem] text-center  opacity-65'>Barangay Councilor</span>
                <h3 className='text-[20px] font-semibold italic rounded-md w-96 text-center  opacity-65'>Hon. Edwin R. Jagmoc</h3>
              </div> 
            </div>

            <div className='flex flex-col mx-14 mt-16 relative items-center justify-center'>
            <div className='h-[30rem] w-3/4 flex flex-col items-center justify-center  rounded-lg  bg-[#FFFFFF] bg-opacity-70 relative'>
                <img src={lorete} className='absolute h-56 w-56 rounded-full top-14 z-10' alt="" />
                <span className='py-1 text-[27px] font-bold rounded-md w-60 mt-[11.5rem] text-center  opacity-65'>Barangay Councilor</span>
                <h3 className='text-[20px] font-semibold italic rounded-md w-96 text-center  opacity-65'>Hon. Flaviano Z. Lorete</h3>
              </div> 
            </div>

            <div className='flex flex-col mx-14 mt-16 relative items-center justify-center'>
            <div className='h-[30rem] w-3/4 flex flex-col items-center justify-center  rounded-lg  bg-[#FFFFFF] bg-opacity-70 relative'>
                <img src={aznar} className='absolute h-56 w-56 rounded-full top-14 z-10' alt="" />
                <span className='py-1 text-[27px] font-bold rounded-md w-60 mt-[11.5rem] text-center  opacity-65'>Barangay Councilor</span>
                <h3 className='text-[20px] font-semibold italic rounded-md w-96 text-center  opacity-65'>Hon. Ryan P. Aznar</h3>
              </div> 
            </div>
            
            <div className='flex flex-col mx-14 mt-16 relative items-center justify-center'>
            <div className='h-[30rem] w-3/4 flex flex-col items-center justify-center  rounded-lg  bg-[#FFFFFF] bg-opacity-70 relative'>
                <img src={malalay} className='absolute h-56 w-56 rounded-full top-14 z-10' alt="" />
                <span className='py-1 text-[27px] font-bold rounded-md w-60 mt-[11.5rem] text-center  opacity-65'>Barangay Councilor</span>
                <h3 className='text-[20px] font-semibold italic rounded-md w-96 text-center  opacity-65'>Hon. Michael Angelo Malalay</h3>
              </div> 
            </div>
          </Slider>
          </div>
        </div>
      </div>

      <div id='sk-officials'>
      <div className='bg-[#FFF6F0]'>
        <div className='h-auto w-full'>
          <div className='flex justify-center items-center font-bold text-5xl pt-10'>
            <span className=''>
              BARANGAY SAMBAG 2 <br />
              <span className='text-center ml-20'>SK COUNCIL</span>
            </span>
          </div>
        </div>
        <div>
        </div>
        <div className=" h-[36rem] items-center justify-center mr-10 mb-10 ml-10  bg-[#741F1F] bg-opacity-30 mt-4 ">
          <Slider {...settings} className='pb-14'>
            <div className='flex flex-col mx-14 mt-16 relative items-center justify-center'>
            <div className='h-[30rem] w-3/4 flex flex-col items-center justify-center  rounded-lg bg-[#FFFFFF] bg-opacity-70 relative'>
                <img src={roncal} className='absolute h-56 w-56 rounded-full top-14 z-10' alt="" />
                <span className='py-1 text-[27px] font-bold rounded-md w-60 mt-[11.5rem] text-center  opacity-65'>SK Chairperson</span>
                <h3 className='text-[20px] font-semibold italic rounded-md w-96 text-center  opacity-65'>Hon. Mary Rosyll T. Roncal</h3>
              </div> 
            </div>
          <div className='flex flex-col mx-14 mt-16 relative items-center justify-center'>
            <div className='h-[30rem] w-3/4 flex flex-col items-center justify-center  rounded-lg bg-[#FFFFFF] bg-opacity-70 relative'>
                <img src={Aguilar} className='absolute h-56 w-56 rounded-full top-14 z-10' alt="" />
                <span className='py-1 text-[27px] font-bold rounded-md w-60 mt-[11.5rem] text-center  opacity-65'>SK Secretary</span>
                <h3 className='text-[20px] font-semibold italic rounded-md w-96 text-center  opacity-65'>Hon. Jyle Rachelle Aguilar</h3>
              </div> 
            </div>
          <div className='flex flex-col mx-14 mt-16 relative items-center justify-center'>
            <div className='h-[30rem] w-3/4 flex flex-col items-center justify-center  rounded-lg bg-[#FFFFFF] bg-opacity-70 relative'>
                <img src={Quijote} className='absolute h-56 w-56 rounded-full top-14 z-10' alt="" />
                <span className='py-1 text-[27px] font-bold rounded-md w-60 mt-[11.5rem] text-center  opacity-65'>SK Treasurer</span>
                <h3 className='text-[20px] font-semibold italic rounded-md w-96 text-center  opacity-65'>Hon. Mary Claire Quejote</h3>
              </div> 
            </div>
          <div className='flex flex-col mx-14 mt-16 relative items-center justify-center'>
            <div className='h-[30rem] w-3/4 flex flex-col items-center justify-center  rounded-lg bg-[#FFFFFF] bg-opacity-70 relative'>
                <img src={Bacus} className='absolute h-56 w-56 rounded-full top-14 z-10' alt="" />
                <span className='py-1 text-[27px] font-bold rounded-md w-60 mt-[11.5rem] text-center  opacity-65'>SK Councilor</span>
                <h3 className='text-[20px] font-semibold italic rounded-md w-96 text-center  opacity-65'>Hon. Rudelyn M. Bacus</h3>
              </div> 
            </div>
          
          <div className='flex flex-col mx-14 mt-16 relative items-center justify-center'>
            <div className='h-[30rem] w-3/4 flex flex-col items-center justify-center  rounded-lg bg-[#FFFFFF] bg-opacity-70 relative'>
                <img src={Tigley} className='absolute h-56 w-56 rounded-full top-14 z-10' alt="" />
                <span className='py-1 text-[27px] font-bold rounded-md w-60 mt-[11.5rem] text-center  opacity-65'>SK Councilor</span>
                <h3 className='text-[20px] font-semibold italic rounded-md w-96 text-center  opacity-65'>Hon. Christian Joel Tigley</h3>
              </div> 
            </div>

          <div className='flex flex-col mx-14 mt-16 relative items-center justify-center'>
            <div className='h-[30rem] w-3/4 flex flex-col items-center justify-center  rounded-lg bg-[#FFFFFF] bg-opacity-70 relative'>
                <img src={Jagmoc} className='absolute h-56 w-56 rounded-full top-14 z-10' alt="" />
                <span className='py-1 text-[27px] font-bold rounded-md w-60 mt-[11.5rem] text-center  opacity-65'>SK Councilor</span>
                <h3 className='text-[20px] font-semibold italic rounded-md w-96 text-center  opacity-65'>Hon. Chinie T. Jagmoc</h3>
              </div> 
            </div>
          <div className='flex flex-col mx-14 mt-16 relative items-center justify-center'>
            <div className='h-[30rem] w-3/4 flex flex-col items-center justify-center  rounded-lg bg-[#FFFFFF] bg-opacity-70  relative'>
                <img src={Paras} className='absolute h-56 w-56 rounded-full top-14 z-10' alt="" />
                <span className='py-1 text-[27px] font-bold rounded-md w-60 mt-[11.5rem] text-center  opacity-65'>SK Councilor</span>
                <h3 className='text-[20px] font-semibold italic rounded-md w-96 text-center  opacity-65'>Hon. Cashlee Paras</h3>
              </div> 
            </div>


          <div className='flex flex-col mx-14 mt-16 relative items-center justify-center'>
            <div className='h-[30rem] w-3/4 flex flex-col items-center justify-center  rounded-lg bg-[#FFFFFF] bg-opacity-70 relative'>
                <img src={Sean} className='absolute h-56 w-56 rounded-full top-14 z-10' alt="" />
                <span className='py-1 text-[27px] font-bold rounded-md w-60 mt-[11.5rem] text-center  opacity-65'>SK Councilor</span>
                <h3 className='text-[20px] font-semibold italic rounded-md w-96 text-center  opacity-65'>Hon. Sean Paul T. Domingo</h3>
              </div> 
            </div>
          <div className='flex flex-col mx-14 mt-16 relative items-center justify-center'>
            <div className='h-[30rem] w-3/4 flex flex-col items-center justify-center  rounded-lg bg-[#FFFFFF] bg-opacity-70 relative'>
                <img src={Amance} className='absolute h-56 w-56 rounded-full top-14 z-10' alt="" />
                <span className='py-1 text-[27px] font-bold rounded-md w-60 mt-[11.5rem] text-center  opacity-65'>SK Councilor</span>
                <h3 className='text-[20px] font-semibold italic rounded-md w-96 text-center  opacity-65'>Hon. Brix Leann Amance</h3>
              </div> 
            </div>
          <div className='flex flex-col mx-14 mt-16 relative items-center justify-center'>
            <div className='h-[30rem] w-3/4 flex flex-col items-center justify-center  rounded-lg bg-[#FFFFFF] bg-opacity-70 relative'>
                <img src={Jimenez} className='absolute h-56 w-56 rounded-full top-14 z-10' alt="" />
                <span className='py-1 text-[27px] font-bold rounded-md w-60 mt-[11.5rem] text-center  opacity-65'>SK Councilor</span>
                <h3 className='text-[20px] font-semibold italic rounded-md w-96 text-center  opacity-65'>Hon. John Michael Jimenez</h3>
              </div> 
            </div>
          </Slider>
          </div>
          
        </div>
      </div>

    </div>
  );
}


export default Home;

