"use client"
import {motion} from 'framer-motion'
type Props = {
    name:string
    description:string,
    index:number
}
import { UserIcon } from "@heroicons/react/24/outline";
import { useState } from 'react'
const Card: React.FC<Props> = ({name, description, index}) => {
    const [style, setStyle] = useState(false)
    return ( 
        <motion.div 
        initial={{opacity:0}}
        whileInView={{opacity:1}}
        transition={{duration:0.5}}
        viewport={{ margin: "-100px", once: true }}
        onViewportEnter={() => { setStyle(true)}}
        className={`bg-slate-50 rounded w-full md:w-5/6 h-40 mb-5 flex justify-between items-center px-10 py-5 shadow-2xl transition-transform duration-1000 ease-in-out ${style ? `translate-x-0` : `translate-x-20` }`}>
            <div className="flex gap-5 relative">
                <UserIcon className="h-10 w-10 text-gray-400"/>
                <span className="h-full w-5 before:border-r-2 before:border-r-black before:border-solid before:absolute before:w-1 before:h-10"></span>
                <div className="flex-col">
                    <h1>{name}</h1>
                    <p>{description}</p>
                </div>
            </div>
        </motion.div>
     );
}
 
export default Card;