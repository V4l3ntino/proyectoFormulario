"use client"
import { useEffect, useState } from "react"
import { Person } from "@/interfaces/interfaces"
import SearchForm from "./search-form"
import Wrapper from "./wrapper"
import { json } from "@/data"
import CreateFormApp from "./createform-app"
import NewformApp from "./newform-app"
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline"



type Props = {
    json: Person[]
}

const DashboardApp:React.FC<Props> = ({json}) => {

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
                    <CreateFormApp funcion={changeState}/>
                ) : (<NewformApp propJson={json}/>)
            }
        </main>
     );
}
 
export default DashboardApp;