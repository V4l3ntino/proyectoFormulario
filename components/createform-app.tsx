"use client"
import { ExpedienteJson, Person } from "@/interfaces/interfaces";
import CardForm from "./cardForm";
import { motion } from "framer-motion";
import { useState } from "react";
import { abel } from "@/app/ui/fonts";
import { DocumentPlusIcon, ExclamationTriangleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Expediente } from "@/models/Expediente";
import EditSvg from "./icons/edit";
import WordSvg from "./icons/word";
import React from "react";
import ExcelSvg from "./icons/excel";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

type Props = {
    changeState: (state: boolean)=> void
    trabajadores: Person[]
    expedientesJson: ExpedienteJson[]
    update: (object: ExpedienteJson) => void
    fetchDownloadExcel: () => void
    fetchDownloadWord: (value:string) => void
    errorServidor: boolean
}

const CreateFormApp:React.FC<Props> = ({changeState, trabajadores, expedientesJson, update, fetchDownloadWord, fetchDownloadExcel, errorServidor}) => {

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
                        lesionado_check: item.lesionado_check,
                        valoracion_hechos: item.valoracion_hechos,
                        formas_accidente: item.formas_accidente,
                        analisis_causas: item.analisis_causas,
                        causas_accidente: item.causas_accidente,
                        aplicar_accion: item.aplicar_accion,
                        itinere: item.itinere,
                        tipo_suceso: item.tipo_suceso,
                        creador: item.creador,
                        fecha_investigacion: item.fecha_investigacion,
                        otros: item.otros,
                        empresa: item.empresa,
                        agente: item.agente,
                        forma_producirse: item.forma_producirse,
                        parte_cuerpo: item.parte_cuerpo
                    }
                    expedientes2.push(expedienteNuevo)
                }
            })
        })
    } 

    const [listaExpedientes, setListaExpedientes] = useState<ExpedienteJson[]>(expedientes2)

    const searchFilter = (value: string) => {
        value = value.toLowerCase()
        const lista = listaExpedientes.filter((item) => {
            return item.trabajador_nombre?.toLowerCase().indexOf(
                value.toString()
            ) !== -1 || item.creador?.toLowerCase().indexOf(
                value.toString()
            ) !== -1 || item.trabajador_nombre?.toLowerCase().indexOf(
                value.toString()
            ) !== -1 || item.empresa?.toLowerCase().indexOf(
                value.toString()
            ) !== -1 || item.fecha_investigacion?.split("T")[0].indexOf(
                value.toString()
            ) !== -1 || item.fecha_investigacion?.split("T")[1].indexOf(
                value.toString()
            ) !== -1 || item.tipo_suceso?.toLowerCase().indexOf(
                value.toString()
            ) !== -1
        })
        lista.length > 0 && value.length > 0 ? setListaExpedientes(lista) : setListaExpedientes(expedientes2)
    }
    const [style, setStyle] = useState(false)
    return ( 
        <section>
            <div className="rounded flex-col overflow-auto h-full">
                <div className="w-full flex sm:flex-row gap-11 items-left flex-col p-4">
                    <div className="relative text-gray-60 w-fit">
                        <input type="search" name="serch" placeholder="Buscar" className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none " onChange={(e) => {searchFilter(e.target.value)}}/>
                        <MagnifyingGlassIcon className="w-5 h-5 absolute top-3 right-5"/>
                    </div>
                    {/* <motion.button
                    whileTap={{scale:0.8}}
                    initial={{scale: 0}}
                    whileInView={{scale: 1}}
                    onClick={() => {changeState(false)}} className="sm:w-fit w-full p-3 rounded-md bg-blue-400 text-white hover:bg-blue-500" >Añadir</motion.button>
                    <motion.button
                    whileTap={{scale:0.8}}
                    initial={{scale: 0}}
                    whileInView={{scale: 1}}
                    onClick={() => {fetchDownloadExcel()}} className="sm:w-fit w-full p-3 rounded-md bg-green-400 text-white justify-center hover:bg-green-500 flex gap-2" >Exportar <ExcelSvg height={28} width={28}/></motion.button> */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline">Acciones</Button>
                        </SheetTrigger>
                        <SheetContent>
                            <div className="grid gap-2 py-4">
                                <div className="grid md:grid-cols-4 grid-rows-2 items-center gap-2">
                                    <motion.button
                                    whileTap={{scale:0.8}}
                                    initial={{scale: 0}}
                                    whileInView={{scale: 1}}
                                    onClick={() => {changeState(false)}} className="sm:w-fit w-full p-3 rounded-md bg-blue-400 text-white hover:bg-blue-500" >Añadir</motion.button>
                                    <motion.button
                                    whileTap={{scale:0.8}}
                                    initial={{scale: 0}}
                                    whileInView={{scale: 1}}
                                    onClick={() => {fetchDownloadExcel()}} className="sm:w-fit w-full p-3 rounded-md bg-green-400 text-white justify-center hover:bg-green-500 flex gap-2" >Exportar <ExcelSvg height={28} width={28}/></motion.button>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Input type="search" placeholder="Buscar..." onChange={(e) => {searchFilter(e.target.value)}}/>
                                    <div className="w-full h-[32rem] flex flex-col gap-2 overflow-auto">
                                        {
                                            listaExpedientes.map((item, key) => (
                                                <React.Fragment key={key}>
                                                    <motion.div
                                                    initial={{opacity: 0}}
                                                    animate={{opacity: 1}}
                                                    className="w-full p-5 hover:bg-slate-100 border rounded-md flex flex-col gap-3 hover:cursor-pointer" >
                                                        <div onClick={() => {update(item)}}>
                                                            <span className="text-left w-full flex sm:flex-row flex-col sm:gap-2"><strong>Creador:</strong>  {item.creador}</span>
                                                            <span className="text-left w-full flex sm:flex-row flex-col sm:gap-2"><strong>Operario:</strong>  {item.trabajador_nombre}</span>
                                                            <span className="text-left w-full flex sm:flex-row flex-col sm:gap-2"><strong>Empresa:</strong>  {item.empresa}</span>
                                                            <span className="text-left w-full flex sm:flex-row flex-col sm:gap-2"><strong>Fecha Creación:</strong>  {item.fecha_investigacion.split('T')[0]}</span>
                                                            <span className="text-left w-full flex sm:flex-row flex-col sm:gap-2"><strong>Hora Creación:</strong>  {item.fecha_investigacion.split('T')[1]}</span>
                                                            <span className="text-left w-full flex sm:flex-row flex-col sm:gap-2"><strong>Tipo suceso:</strong>  {item.tipo_suceso}</span>
                                                        </div>
                                                        <span className="text-left w-full flex sm:flex-row flex-col sm:gap-2">
                                                        <motion.div
                                                            whileTap={{scale:0.93}}
                                                            onClick={() => fetchDownloadWord(item.id)}  className="mb-3 flex items-center gap-1 cursor-pointer p-2 rounded-sm bg-blue-400 text-white">
                                                                <WordSvg width={28} height={28}/>
                                                                <p className="hover:underline">Exportar a Word</p>
                                                        </motion.div>
                                                        </span>
                                                    </motion.div>
                                                </React.Fragment>
                                            ))
                                        }
                                    </div>
                                    
                                </div>
                            </div>
                            {/* <SheetFooter>
                            <SheetClose asChild>
                                <Button type="submit">Save changes</Button>
                            </SheetClose>
                            </SheetFooter> */}
                        </SheetContent>
                    </Sheet>
                </div>
                <br />
                <div className="w-full  flex flex-wrap xl:flex-col xl:gap-0 gap-3  max-w-[1488px]">
                    <div className="w-full xl:flex justify-between border-b-2 p-10  hidden ">
                        <strong className="w-[200px] text-center">Creador</strong>
                        <strong className="w-[300px] text-center">Operario</strong>
                        <strong className="w-[100px] text-center">Empresa</strong>
                        <strong className="w-[300px] text-center">Fecha Creación</strong>
                        <strong className="w-[200px] text-center">Hora creación</strong>
                        <strong className="w-[200px] text-center">Tipo suceso</strong>
                    </div>
                    {
                        listaExpedientes.map((item, key) => (
                            <React.Fragment key={key}>
                                <motion.div
                                initial={{filter: 'blur(40px)'}}
                                animate={{filter: 'blur(0px)'}}
                                transition={{duration: (key/4)*0.5}}
                                className="w-full xl:flex justify-between p-10 hover:bg-slate-100 border  hidden hover:cursor-pointer" onClick={() => {update(item)}} >
                                    <span className="w-[200px] text-center border-r-orange-200">{item.creador}</span>
                                    <span className="w-[300px] text-center px-5">{item.trabajador_nombre}</span>
                                    <span className="w-[100px] text-center">{item.empresa}</span>
                                    <span className="w-[300px] text-center">{item.fecha_investigacion.split('T')[0]}</span>
                                    <span className="w-[200px] text-center">{item.fecha_investigacion.split('T')[1]}</span>
                                    <span className="w-[200px] text-center">{item.tipo_suceso}</span>
                                </motion.div>
                                <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                className="w-full xl:hidden  p-5 hover:bg-slate-100 border rounded-md flex flex-col gap-3 hover:cursor-pointer" onClick={() => {update(item)}} >
                                    <span className="text-left w-full flex sm:flex-row flex-col sm:gap-2"><strong>Creador:</strong>  {item.creador}</span>
                                    <span className="text-left w-full flex sm:flex-row flex-col sm:gap-2"><strong>Operario:</strong>  {item.trabajador_nombre}</span>
                                    <span className="text-left w-full flex sm:flex-row flex-col sm:gap-2"><strong>Empresa:</strong>  {item.empresa}</span>
                                    <span className="text-left w-full flex sm:flex-row flex-col sm:gap-2"><strong>Fecha Creación:</strong>  {item.fecha_investigacion.split('T')[0]}</span>
                                    <span className="text-left w-full flex sm:flex-row flex-col sm:gap-2"><strong>Hora Creación:</strong>  {item.fecha_investigacion.split('T')[1]}</span>
                                    <span className="text-left w-full flex sm:flex-row flex-col sm:gap-2"><strong>Tipo suceso:</strong>  {item.tipo_suceso}</span>
                                </motion.div>
                            </React.Fragment>
                        ))
                    }
                </div>
                {errorServidor? (
                        <motion.span
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        transition={{duration:0.5}}
                        viewport={{once: true }}
                        className={`bg-red-500 text-white hover:bg-red-600 overflow-hidden relative rounded max-w-[1488px] h-40 mb-5 flex justify-between items-center px-4 lg:px-20 py-5 shadow-2xl transition-transform duration-100 ease-in-out opacity-1 scale-1 `}>
                            <div className="flex gap-5 relative">
                                <ExclamationTriangleIcon className="h-10 w-10 text-white hidden md:flex"/>
                                <span className="h-full w-5 before:border-r-2 before:border-r-black before:border-solid before:absolute before:w-1 before:h-10 hidden md:flex"></span>
                                <div className="flex-col">
                                    <h1 className={`${abel.className} text-2xl`}>Error de conexión con la Base de Datos</h1>
                                </div>
                            </div>
                            <ExclamationTriangleIcon className="h-10 w-10 text-white  md:hidden"/>
                        </motion.span>
                    ) : (``)
                }
                
            </div>
        </section>
     );
}
 
export default CreateFormApp;