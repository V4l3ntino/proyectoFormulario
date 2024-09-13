"use client"
import {motion} from 'framer-motion'
type Props = {
    operario: Person
}
import { UserIcon, CursorArrowRippleIcon } from "@heroicons/react/24/outline";
import { useState } from 'react'
import { abel } from '@/app/ui/fonts'
import { Person } from '@/interfaces/interfaces';
const Card: React.FC<Props> = ({operario}) => {
    const [style, setStyle] = useState(false)
    const [tipe, setTipe] = useState(false)
    return ( 
        <motion.div 
        initial={{opacity:0}}
        whileInView={{opacity:1}}
        transition={{duration:0.5}}
        viewport={{ margin: "-10px", once: true }}
        onViewportEnter={() => { setStyle(true)}}
        onViewportLeave={() => { setStyle(false)}}
        className={`bg-slate-50 overflow-hidden relative rounded w-full md:w-4/6 h-40 mb-5 flex justify-between items-center px-10 py-5 shadow-2xl transition-transform duration-300 ease-in-out 
        ${style ? `opacity-1 scale-1` : `opacity-0 scale-0 lg:translate-x-96 translate-x-20` }`}
        onHoverStart={() => {setTipe(true)}}
        onHoverEnd={() => {setTipe(false)}}
        >
            <div className="flex gap-5 relative">
                <div>
                    <UserIcon className="h-10 w-10 text-gray-400"/>
                    <p>Id: {operario.id}</p>
                </div>
                <span className="h-full w-5 before:border-r-2 before:border-r-black before:border-solid before:absolute before:w-1 before:h-10"></span>
                <div className="flex-col">
                    <h1 className={`${abel.className} text-2xl`}>{operario.nombre}</h1>
                    <p>{operario.apellido}</p>
                </div>
            </div>
            {tipe && 
            <motion.div
            initial={{filter: 'blur(50px)'}}
            animate={{filter: 'blur(0px)'}}
            transition={{delay:0.1}}
            className='w-full bg-black/40 absolute top-0 left-0 h-40 flex justify-center items-center rounded'><CursorArrowRippleIcon className='w-7 h-7 text-white'/></motion.div>
            }
        </motion.div>
     );
}
 
export default Card;