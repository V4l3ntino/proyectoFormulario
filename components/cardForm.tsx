"use client"
import { motion } from "framer-motion";
import { useState } from "react";
import { ClipboardDocumentIcon, TrashIcon, PencilSquareIcon, DocumentIcon,TableCellsIcon } from "@heroicons/react/24/outline";
import { abel } from '@/app/ui/fonts'
import { ExpedienteJson } from "@/interfaces/interfaces";
import WordSvg from "./icons/word";
import ExcelSvg from "./icons/excel";
import EditSvg from "./icons/edit";

type Props = {
    expediente: ExpedienteJson
    update: (object: ExpedienteJson) => void
    fetchDownloadWord: (expediente: string) => void
}


const CardForm:React.FC<Props> = ({expediente, update, fetchDownloadWord}) => {
    
    const [style, setStyle] = useState(false)

    return ( 
        <motion.div 
        initial={{opacity:0}}
        whileInView={{opacity:1}}
        transition={{duration:0.5}}
        viewport={{ margin: "-10px", once: true }}
        onViewportEnter={() => { setStyle(true)}}
        onViewportLeave={() => { setStyle(false)}}
        className={`bg-slate-50 overflow-hidden relative rounded w-full h-40 mb-5 flex justify-between items-center px-4 lg:px-20 py-5 shadow-2xl transition-transform duration-500 ease-in-out 
        ${style ? `opacity-1 scale-1` : `opacity-0 scale-0 lg:translate-x-96 translate-x-20` }`}
        >
            <div className="flex gap-5 relative">
                <ClipboardDocumentIcon className="h-10 w-10 text-gray-400 hidden md:flex"/>
                <span className="h-full w-5 before:border-r-2 before:border-r-black before:border-solid before:absolute before:w-1 before:h-10 hidden md:flex"></span>
                <div className="flex-col">
                    <h1 className={`${abel.className} text-2xl`}>{expediente.trabajador_nombre}</h1>
                    <p>{expediente.fecha_suceso}</p>
                    <p>{expediente.lugar_accidente}</p>
                </div>
            </div>
            <div className="flex gap-4">
                <EditSvg width={28} height={28} onClick={() => {update(expediente)}} className="cursor-pointer"/>
                <WordSvg width={28} height={28} onClick={() => {fetchDownloadWord(expediente.id)}} className="cursor-pointer"/>
                <ExcelSvg width={28} height={28} className="cursor-pointer"/>
            </div>
        </motion.div>
     );
}
 
export default CardForm;