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
            { state ? (``) : (<span className="cursor-pointer hover:underline flex gap-1 hover:gap-2 w-fit" onClick={() => {changeState(true)}}>Volver <Icon className="w-6" /></span>)}
            <br />
            {
                state ? (
                    <CreateFormApp funcion={changeState} trabajadores={jsonTrabajadores} expedientesJson={jsonExpedientes}/>
                ) : (<NewformApp propJson={jsonTrabajadores}/>)
            }
        </main>
     );
}
 
export default DashboardApp;