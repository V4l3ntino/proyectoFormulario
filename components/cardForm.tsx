import { motion } from "framer-motion";
import { useState } from "react";
import { ClipboardDocumentIcon, TrashIcon, PencilSquareIcon, DocumentIcon,TableCellsIcon } from "@heroicons/react/24/outline";
import { abel } from '@/app/ui/fonts'
import { ExpedienteJson } from "@/interfaces/interfaces";

type Props = {
    expediente: ExpedienteJson
    update: (object: ExpedienteJson) => void
}


const CardForm:React.FC<Props> = ({expediente, update}) => {
    const [style, setStyle] = useState(false)
    const [idExp, setIdexp] = useState<number | undefined>(expediente.id)

    const fetchDeleteExpediente = async(): Promise<void> => {
        try{
            const response = await fetch(`http://localhost:8000/api/expediente/${idExp}/`,{method: 'DELETE'})
            if(!response.ok){
                throw new Error("Error al eliminar el expediente")
            }
            window.location.reload()
        }catch(Error){
            console.log(Error)
        }
    }
    return ( 
        <motion.div 
        initial={{opacity:0}}
        whileInView={{opacity:1}}
        transition={{duration:0.5}}
        viewport={{ margin: "-10px", once: true }}
        onViewportEnter={() => { setStyle(true)}}
        onViewportLeave={() => { setStyle(false)}}
        className={`bg-slate-50 overflow-hidden relative rounded w-full h-40 mb-5 flex justify-between items-center px-4 lg:px-20 py-5 shadow-2xl transition-transform duration-1000 ease-in-out 
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
                <TrashIcon onClick={() => {fetchDeleteExpediente()}}  className="h-5 w-5 text-gray-400 md:h-10 md:w-10 cursor-pointer" />
                <PencilSquareIcon onClick={() => {update(expediente)}} className="h-5 w-5 text-gray-400 md:h-10 md:w-10 cursor-pointer"/>
                <DocumentIcon className="h-5 w-5 text-gray-400 md:h-10 md:w-10" />
                <TableCellsIcon className="h-5 w-5 text-gray-400 md:h-10 md:w-10" />
            </div>
        </motion.div>
     );
}
 
export default CardForm;