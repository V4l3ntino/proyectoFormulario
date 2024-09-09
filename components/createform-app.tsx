"use client"
import { Formulario } from "@/interfaces/interfaces";
import CardForm from "./cardForm";
import { motion } from "framer-motion";
import { useState } from "react";
import { abel } from "@/app/ui/fonts";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
const CreateFormApp = () => {
    const json:Formulario[] = [
        {
            creador: 'Paco',
            operario: 'Operario1',
            created_at: '2024-04-04'
        },
        {
            creador: 'Paco',
            operario: 'Operario1',
            created_at: '2024-04-04'
        },
        {
            creador: 'Paco',
            operario: 'Operario1',
            created_at: '2024-04-04'
        },
        {
            creador: 'Paco',
            operario: 'Operario1',
            created_at: '2024-04-04'
        },
        {
            creador: 'Paco',
            operario: 'Operario1',
            created_at: '2024-04-04'
        },
        {
            creador: 'Paco',
            operario: 'Operario1',
            created_at: '2024-04-04'
        },
        {
            creador: 'Paco',
            operario: 'Operario1',
            created_at: '2024-04-04'
        },
        {
            creador: 'Paco',
            operario: 'Operario1',
            created_at: '2024-04-04'
        },
        {
            creador: 'Paco',
            operario: 'Operario1',
            created_at: '2024-04-04'
        },
        {
            creador: 'Paco',
            operario: 'Operario1',
            created_at: '2024-04-04'
        },
        {
            creador: 'Paco',
            operario: 'Operario1',
            created_at: '2024-04-04'
        },
        {
            creador: 'Paco',
            operario: 'Operario1',
            created_at: '2024-04-04'
        },
    ]
    const [style, setStyle] = useState(false)
    return ( 
        <main>
            <h1>Historial</h1>
            <br />
            <hr />
            <br />
            <section>
                
                <div className="bg-slate-200 p-2 lg:p-10 rounded flex-col overflow-hidden">
                    <motion.div 
                    initial={{opacity:0}}
                    whileInView={{opacity:1}}
                    transition={{duration:0.5}}
                    viewport={{ margin: "-100px", once: false }}
                    onViewportEnter={() => { setStyle(true)}}
                    onViewportLeave={() => { setStyle(false)}}
                    className={`bg-slate-50 overflow-hidden relative rounded w-full h-40 mb-5 flex justify-between items-center px-4 lg:px-20 py-5 shadow-2xl transition-transform duration-1000 ease-in-out 
                    ${style ? `translate-x-0` : `translate-x-5` }`}
                    >
                        <div className="flex gap-5 relative">
                            <DocumentPlusIcon className="h-10 w-10 text-gray-400 hidden md:flex"/>
                            <span className="h-full w-5 before:border-r-2 before:border-r-black before:border-solid before:absolute before:w-1 before:h-10 hidden md:flex"></span>
                            <div className="flex-col">
                                <h1 className={`${abel.className} text-2xl`}>Nuevo formulario</h1>
                            </div>
                        </div>
                        <DocumentPlusIcon className="h-10 w-10 text-gray-400  md:hidden"/>
                    </motion.div>                    
                    {(json).map((item, key) => (
                        <CardForm key={key} creador={item.creador} operario={item.operario} created_at={item.created_at}/>
                    ))}
                </div>
            </section>
        </main>
     );
}
 
export default CreateFormApp;