"use client"
import { useEffect, useState } from "react"
import { ExpedienteJson, ImagenJson, Person } from "@/interfaces/interfaces"
import { v4 as uuidv4 } from 'uuid';


import CreateFormApp from "./createform-app"
import NewformApp from "./newform-app"
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline"



type Props = {
    jsonTrabajadores: Person[]
    jsonExpedientes: ExpedienteJson[]
    jsonImagenes: ImagenJson[]

}

const DashboardApp:React.FC<Props> = ({jsonTrabajadores, jsonExpedientes, jsonImagenes}) => {

    const [state, setState] = useState<boolean>(true)
    const [update, setUpdate] = useState<string|undefined>()
    const [lastIdExpediente, setLastIdExpediente] = useState<number>()

    useEffect(() => {
        const stateStorage:string = localStorage.getItem('state')!
        if(stateStorage){
            setState(JSON.parse(stateStorage))
        }

    }, [])
    const changeState = (state: boolean):void => {
        setState(state);
        localStorage.setItem('state', JSON.stringify(state))
    }
    const setUpdateFuncion = ():void => {
        setUpdate(undefined)
    }
    const updateExpediente = async(expediente: ExpedienteJson) => {
        const user = jsonTrabajadores.find((person) => {return person.id === expediente.trabajador})
        saveInStorage("name", expediente.trabajador_nombre)
        saveInStorage("edad", expediente.edad)
        saveInStorage("experiencia", user?.experiencia)
        
        saveInStorage("men", expediente.sexo == "H" ? true : false)
        saveInStorage("women", expediente.sexo == "M" ? true : false)
        saveInStorage("lugarAccidente", expediente.lugar_accidente)
        saveInStorage("fechaSuceso", expediente.fecha_suceso)
        saveInStorage("descripcion", expediente.descripcion_hechos)
        saveInStorage("idTrabajador", user?.id)
        setUpdate(expediente.id)

        saveInStorage("imagenes", jsonImagenes.filter((item) => item.expediente == expediente.id ))

        changeState(false)
    }
    const saveInStorage = (tipo: string, value: any) => {
        localStorage.setItem(tipo, JSON.stringify(value))
    }
    const Icon = ArrowLeftCircleIcon;
    useEffect(()=>{
        if(update){
            saveInStorage("updateId", update)
            return
        }

    },[update])
    return ( 
        <main>
            { state ? (
                <h1>Historial</h1>
            ) : (<div>
                <h1>Nuevo Expediente</h1>
            </div>)
            }
            <br />
            <hr />
            <br />
            { state ? (``) : (<span className="cursor-pointer hover:underline flex gap-1 hover:gap-2 w-fit" onClick={() => {changeState(true); localStorage.clear()}}>Volver <Icon className="w-6" /></span>)}
            <br />
            {
                state ? (
                    <CreateFormApp funcion={changeState} trabajadores={jsonTrabajadores} expedientesJson={jsonExpedientes} update={updateExpediente}/>
                ) : (<NewformApp propJson={jsonTrabajadores} clearUpdate={update? setUpdateFuncion : undefined} idExpediente={update? update : uuidv4()}/>)
            }
        </main>
     );
}
 
export default DashboardApp;