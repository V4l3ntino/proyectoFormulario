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
    const fecha_investigacion_all = expediente.fecha_investigacion.split("T")
    const fecha_investigacion = fecha_investigacion_all[0].split("-")
    return ( 
        <motion.div 
        initial={{opacity:0}}
        whileInView={{opacity:1}}
        transition={{duration:0.5}}
        viewport={{ margin: "-10px", once: true }}
        className={`bg-slate-50 overflow-hidden relative rounded w-full h-40 mb-5 flex justify-between items-center px-4 lg:px-20 py-5 shadow-2xl 
            transition-transform duration-500 ease-in-out opacity-1 scale-1`}
        >
            <div className="flex gap-5 relative">
                <div className="flex-col">
                    <h1 className={`${abel.className} text-2xl`}>{expediente.trabajador_nombre}</h1>
                    <p>{expediente.tipo_suceso}</p>
                    <p>{fecha_investigacion_all[1]} {`${fecha_investigacion[2]}/${fecha_investigacion[1]}/${fecha_investigacion[0]}`}</p>
                    <p>{expediente.lugar_accidente}</p>
                    <p>Creador: {expediente.creador}</p>
                </div>
            </div>
            <div className="flex gap-4 flex-col sm:flex-row">
                <motion.div
                initial={{scale: 0}}
                whileInView={{scale: 1}}
                whileTap={{scale:1.5}}
                >
                    <EditSvg width={28} height={28} onClick={() => {update(expediente)}} className="cursor-pointer"/>
                </motion.div>
                <motion.div
                whileTap={{scale:1.5}}
                initial={{scale: 0}}
                whileInView={{scale: 1}}
                >
                    <WordSvg width={28} height={28} onClick={() => {fetchDownloadWord(expediente.id)}} className="cursor-pointer"/>
                </motion.div>
            </div>
        </motion.div>
     );
}
 
export default CardForm;