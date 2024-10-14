"use client"
import { ExpedienteJson, Person } from "@/interfaces/interfaces";
import CardForm from "./cardForm";
import { motion } from "framer-motion";
import { useState } from "react";
import { abel } from "@/app/ui/fonts";
import { DocumentPlusIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Expediente } from "@/models/Expediente";

type Props = {
    changeState: (state: boolean)=> void
    trabajadores: Person[]
    expedientesJson: ExpedienteJson[]
    update: (object: ExpedienteJson) => void
    fetchDownloadWord: (expediente: string) => void
    errorServidor: boolean
}

const CreateFormApp:React.FC<Props> = ({changeState, trabajadores, expedientesJson, update, fetchDownloadWord, errorServidor}) => {

    const expedientes2: ExpedienteJson[] = []
    if(expedientesJson && expedientesJson.length > 0 && trabajadores && trabajadores.length > 0){
        expedientesJson.forEach((item, index) => {
            trabajadores.forEach((user, index) => {
                if(item.trabajador == user.id){
                    const expedienteNuevo:ExpedienteJson = {
                        id: item.id,
                        trabajador: user.id,
                        trabajador_nombre: `${user.nombre}, ${user.apellido}`,
                        descripcion_hechos: item.descripcion_hechos,
                        edad: item.edad,
                        fecha_suceso: item.fecha_suceso,
                        lesion: item.lesion,
                        lugar_accidente: item.lugar_accidente,
                        sexo: item.sexo,
                        puesto_trabajo: item.puesto_trabajo,
                        lesionado_check: item.lesionado_check
                    }
                    expedientes2.push(expedienteNuevo)
                }
            })
        })
    } 
    
    const [style, setStyle] = useState(false)
    return ( 
        <section>
            <div className="bg-slate-200 p-2 lg:p-10 rounded flex-col overflow-hidden">
                    {!errorServidor? (
                            <motion.span
                            onClick={() => {changeState(false)}}
                            initial={{opacity:0}}
                            whileInView={{opacity:1}}
                            transition={{duration:0.5}}
                            whileTap={{scale:0.8}}
                            viewport={{ margin: "-100px", once: true }}
                            onViewportEnter={() => { setStyle(true)}}
                            onViewportLeave={() => { setStyle(false)}}
                            className={`bg-slate-50 hover:bg-slate-200 cursor-pointer overflow-hidden relative rounded w-full h-40 mb-5 flex justify-between items-center px-4 lg:px-20 py-5 shadow-2xl transition-transform duration-100 ease-in-out 
                            ${style ? `opacity-1 scale-1` : `opacity-0 scale-0 lg:translate-x-96 translate-x-20` }`}
                            >
                                <div className="flex gap-5 relative">
                                    <DocumentPlusIcon className="h-10 w-10 text-gray-400 hidden md:flex"/>
                                    <span className="h-full w-5 before:border-r-2 before:border-r-black before:border-solid before:absolute before:w-1 before:h-10 hidden md:flex"></span>
                                    <div className="flex-col">
                                        <h1 className={`${abel.className} text-2xl`}>Nuevo formulario</h1>
                                    </div>
                                </div>
                                <DocumentPlusIcon className="h-10 w-10 text-gray-400  md:hidden"/>
                            </motion.span>
                        ) : (
                            <motion.span
                            initial={{opacity:0}}
                            whileInView={{opacity:1}}
                            transition={{duration:0.5}}
                            viewport={{ margin: "-100px", once: true }}
                            onViewportEnter={() => { setStyle(true)}}
                            onViewportLeave={() => { setStyle(false)}}
                            className={`bg-red-500 text-white hover:bg-red-600 overflow-hidden relative rounded w-full h-40 mb-5 flex justify-between items-center px-4 lg:px-20 py-5 shadow-2xl transition-transform duration-100 ease-in-out 
                            ${style ? `opacity-1 scale-1` : `opacity-0 scale-0 lg:translate-x-96 translate-x-20` }`}
                            >
                                <div className="flex gap-5 relative">
                                    <ExclamationTriangleIcon className="h-10 w-10 text-white hidden md:flex"/>
                                    <span className="h-full w-5 before:border-r-2 before:border-r-black before:border-solid before:absolute before:w-1 before:h-10 hidden md:flex"></span>
                                    <div className="flex-col">
                                        <h1 className={`${abel.className} text-2xl`}>Error de conexión con la Base de Datos</h1>
                                    </div>
                                </div>
                                <ExclamationTriangleIcon className="h-10 w-10 text-white  md:hidden"/>
                            </motion.span>
                        )
                    }                    
                    {(expedientes2).map((item, key) => (
                        <CardForm key={key} expediente={item} update={update} fetchDownloadWord={fetchDownloadWord}/>
                    ))}
                </div>
        </section>
     );
}
 
export default CreateFormApp;