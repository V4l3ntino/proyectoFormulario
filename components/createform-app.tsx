"use client"
import { ExpedienteJson, Person } from "@/interfaces/interfaces";
import CardForm from "./cardForm";
import { motion } from "framer-motion";
import { useState } from "react";
import { abel } from "@/app/ui/fonts";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { Expediente } from "@/models/Expediente";

type Props = {
    funcion: (state: boolean)=> void
    trabajadores: Person[]
    expedientesJson: ExpedienteJson[]
}

const CreateFormApp:React.FC<Props> = ({funcion, trabajadores, expedientesJson}) => {

    const expedientes2: Expediente[] = []
    if(expedientesJson && expedientesJson.length > 0 && trabajadores && trabajadores.length > 0){
        expedientesJson.forEach((item, index) => {
            trabajadores.forEach((user, index) => {
                if(item.trabajador == user.id){
                    const expedienteNuevo = new Expediente(item.id, user.nombre, item.sexo, item.edad, item.lugar_accidente, item.fecha_suceso, item.lesion, item.descripcion_hechos)
                    expedientes2.push(expedienteNuevo)
                }
            })
        })
    } 
   
    
    const [style, setStyle] = useState(false)
    return ( 
        <section>
            <div className="bg-slate-200 p-2 lg:p-10 rounded flex-col overflow-hidden">
                    <motion.span
                    onClick={() => {funcion(false)}}
                    initial={{opacity:0}}
                    whileInView={{opacity:1}}
                    transition={{duration:0.5}}
                    viewport={{ margin: "-100px", once: true }}
                    onViewportEnter={() => { setStyle(true)}}
                    onViewportLeave={() => { setStyle(false)}}
                    className={`bg-slate-50 hover:bg-slate-200 cursor-pointer overflow-hidden relative rounded w-full h-40 mb-5 flex justify-between items-center px-4 lg:px-20 py-5 shadow-2xl transition-transform duration-1000 ease-in-out 
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
                    {(expedientes2).map((item, key) => (
                        <CardForm key={key} creador={item.trabajador} operario={item.lugarAccidente} created_at={item.fechaSuceso}/>
                    ))}
                </div>
        </section>
     );
}
 
export default CreateFormApp;