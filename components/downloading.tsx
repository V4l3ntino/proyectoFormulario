"use client"

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Downloading = () => {
    
    const [state, setState] = useState<boolean>(false)
    
    useEffect(() => {
        setState(true)
        const interval = setInterval(() => {
            setState(prevState => !prevState);
        }, 3100);

        return () => clearInterval(interval);
    },[])
    return ( 
        <section className="w-full h-full fixed z-50 bg-black top-0 left-0">
            <div className="w-full h-full z-50 flex items-center justify-center bg-gray-900 bg-opacity-60">
                {/* <svg id="loading-overlay" className="h-8 w-8 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                    </svg> */}
                <span className="text-white text-3xl font-bold">
                    <span className="flex gap-2">
                        Cargando
                        <div className="loader mt-3"></div>
                    </span>
                    <p className="text-sm font-thin">{
                        ("Esto puede tardar unos segundos").split(" ").map((word, indexWord) => (
                            <span className="inline-block mr-1" key={indexWord}>
                                {
                                    word.split("").map((char, indexChar) => (
                                        <motion.span
                                        initial={{filter: "blur(0px)"}}
                                        animate={state ? {filter: "blur(1px)"} : {filter: "blur(0px)", fontFamily: "Lato, sans-serif"}}
                                        transition={{delay: (indexWord * 0.5) + (indexChar * 0.1)}}
                                        key={indexChar+indexWord}>{char}</motion.span>
                                    ))
                                }
                            </span>
                        ))
                    }</p></span>
            </div>
        </section>
     );
}
 
export default Downloading;