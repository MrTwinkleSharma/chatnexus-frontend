import Authentication from "../Components/Authentication"
import Navbar from "../Components/Navbar"
import Typewriter from 'react-ts-typewriter';
import Features from "../Components/Features";
import Footer from "../Components/Footer";
import { ChatState } from '../Context/ChatProvider.js';
import { useRef } from "react";

const Home = ({ }) => {
    const myRef = useRef();
    const { user } = ChatState();

    const handleFeatureClick = () => {
        myRef?.current?.scrollIntoView({ behavior: "smooth" })
    }
    return <div className="">
        <Navbar isLogin={false} handleFeatureClick={handleFeatureClick} />
        <div className=" ">
            <div className="grid grid-cols-[60%_40%] h-[85vh] items-center px-5 my-8">
                <div className="">
                    <h1 className="text-center text-[#11256D] text-4xl uppercase">
                        <Typewriter speed={70} delay={20} text={"Bringing people together in real-time"} />
                    </h1>
                    <div className="">
                        <img className="my-12" src="https://res.cloudinary.com/diafifpzr/image/upload/v1674635329/girls_1_1_1_hqalzo.png" width={900} height={600} alt="" />
                    </div>
                </div>
                <div className="h-full ">
                    <Authentication />
                </div>
            </div>
        </div>

        {
            !user && <>
                <div className='bg-[#11256D] h-[0.15rem] rounded-full my-12 mx-5'></div>
                <div ref={myRef} className="mx-10">
                    <Features />
                </div>

                <div className='bg-[#11256D] h-[0.1rem] rounded-full my-12 mx-5'></div>
                <div>
                    <Footer />
                </div>
            </>
        }

    </div>
}

export default Home;