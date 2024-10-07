"use client"
import { useEffect, useState } from "react"
import { ExpedienteJson, Person } from "@/interfaces/interfaces"
import SearchForm from "./search-form"
import Wrapper from "./wrapper"

import CreateFormApp from "./createform-app"
import NewformApp from "./newform-app"
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline"



type Props = {
    jsonTrabajadores: Person[]
    jsonExpedientes: ExpedienteJson[]

}

const DashboardApp:React.FC<Props> = ({jsonTrabajadores, jsonExpedientes}) => {

    const [state, setState] = useState<boolean>(true)
    const [update, setUpdate] = useState<number|undefined>()

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
        changeState(false)
    }
    const saveInStorage = (tipo: string, value: any) => {
        localStorage.setItem(tipo, JSON.stringify(value))
    }
    const Icon = ArrowLeftCircleIcon;
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
            { state ? (``) : (<span className="cursor-pointer hover:underline flex gap-1 hover:gap-2 w-fit" onClick={() => {changeState(true); setUpdate(undefined)}}>Volver <Icon className="w-6" /></span>)}
            <br />
            {
                state ? (
                    <CreateFormApp funcion={changeState} trabajadores={jsonTrabajadores} expedientesJson={jsonExpedientes} update={updateExpediente}/>
                ) : (<NewformApp propJson={jsonTrabajadores} metodo={update? 'PUT' : 'POST'} updateId={update? update : undefined} setUpdateId={update? setUpdateFuncion : undefined} idExpediente={update? update : jsonExpedientes.length>0 ? (jsonExpedientes[jsonExpedientes.length-1].id)+1 : 1}/>)
            }
        </main>
     );
}
 
export default DashboardApp;