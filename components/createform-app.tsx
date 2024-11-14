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
                        empresa: item.empresa
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
            ) !== -1 || item.tipo_suceso?.indexOf(
                value.toString()
            ) !== -1
        })
        lista.length > 0 && value.length > 0 ? setListaExpedientes(lista) : setListaExpedientes(expedientes2)
    }
    const [style, setStyle] = useState(false)
    return ( 
        <section>
            <div className="p-2 lg:p-10 rounded flex-col overflow-auto h-full">
                <div className="w-full flex gap-11 items-center">
                    <div className="relative text-gray-60 w-fit">
                        <input type="search" name="serch" placeholder="Search" className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none sm:w-96" onChange={(e) => {searchFilter(e.target.value)}}/>
                        <MagnifyingGlassIcon className="w-5 h-5 absolute top-3 right-5"/>
                    </div>
                    <motion.button
                    whileTap={{scale:0.8}}
                    initial={{scale: 0}}
                    whileInView={{scale: 1}}
                    onClick={() => {changeState(false)}} className="w-fit p-3 rounded-md bg-blue-400 text-white hover:bg-blue-500" >Añadir</motion.button>
                </div>
                <br />
                <table className="tablaDatos max-w-[1488px]">
                    <colgroup>
                        <col />
                        <col style={{minWidth: '200px'}}/>
                        <col />
                        <col style={{minWidth: '200px'}}/>
                        <col style={{minWidth: '200px'}}/>
                        <col style={{minWidth: '200px'}}/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Creador</th>
                            <th>Operario</th>
                            <th>Empresa</th>
                            <th>Fecha Creación</th>
                            <th>Hora Creación</th>
                            <th>Tipo suceso</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listaExpedientes.map((item, key) => (
                                <tr key={key} className="cursor-pointer hover:bg-slate-100" onClick={() => {update(item)}}>
                                    <td>{item.creador}</td>
                                    <td>{item.trabajador_nombre}</td>
                                    <td>{item.empresa}</td>
                                    <td>{`${item.fecha_investigacion.split('T')[0]}`}</td>
                                    <td>{`${item.fecha_investigacion.split('T')[1]}`}</td>
                                    <td>{item.tipo_suceso}</td>
                                    {/* <td className="flex gap-4 flex-col sm:flex-row justify-center">
                                        <motion.div
                                        initial={{scale: 0}}
                                        whileInView={{scale: 1}}
                                        whileTap={{scale:1.5}}
                                        >
                                            <EditSvg width={28} height={28}  className="cursor-pointer"/>
                                        </motion.div>
                                        <motion.div
                                        whileTap={{scale:1.5}}
                                        initial={{scale: 0}}
                                        whileInView={{scale: 1}}
                                        >
                                            <WordSvg width={28} height={28} onClick={() => {fetchDownloadWord(item.id)}} className="cursor-pointer"/>
                                        </motion.div>
                                    </td> */}
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                
                {errorServidor? (
                        <motion.span
                        initial={{opacity:0}}
                        whileInView={{opacity:1}}
                        transition={{duration:0.5}}
                        viewport={{ margin: "-100px", once: true }}
                        onViewportEnter={() => { setStyle(true)}}
                        onViewportLeave={() => { setStyle(false)}}
                        className={`bg-red-500 text-white hover:bg-red-600 overflow-hidden relative rounded w-[1488px] h-40 mb-5 flex justify-between items-center px-4 lg:px-20 py-5 shadow-2xl transition-transform duration-100 ease-in-out 
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
                    ) : (``)
                }
            </div>
        </section>
     );
}
 
export default CreateFormApp;