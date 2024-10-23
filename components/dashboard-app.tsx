"use client"
import { useEffect, useState } from "react"
import { ExpedienteJson, ImagenJson, Person, selectJson } from "@/interfaces/interfaces"
import { v4 as uuidv4 } from 'uuid';


import CreateFormApp from "./createform-app"
import NewformApp from "./newform-app"
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline"
import Downloading from "./downloading";
import { useRouter } from "next/navigation";
import {saveInStorage} from "../lib/data"



type Props = {
    jsonTrabajadores: Person[]
    jsonExpedientes: ExpedienteJson[]
    jsonImagenes: ImagenJson[]
    errorServidor: boolean,
    jsonPuestoTrabajo: selectJson[]
    jsonLugarAccidente: selectJson[]
    jsonFormasProducirseAccidente: selectJson[]


}

const DashboardApp:React.FC<Props> = ({jsonTrabajadores, jsonExpedientes, jsonImagenes, errorServidor, jsonPuestoTrabajo, jsonLugarAccidente, jsonFormasProducirseAccidente}) => {
    const router = useRouter()
    const [state, setState] = useState<boolean>(true)
    const [update, setUpdate] = useState<string|undefined>()
    const [stateDownload, setStateDownload] = useState<boolean>(false)

    useEffect(() => {
        const stateStorage:string = localStorage.getItem('state')!
        if(stateStorage){
            setState(JSON.parse(stateStorage))
        }

    }, [])
    const changeState = async(state: boolean) => {
        const timeout = await new Promise((r) => setTimeout(r, 200))
        setState(state);
        localStorage.setItem('state', JSON.stringify(state))
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
        saveInStorage("lesionado", expediente.lesionado_check)
        saveInStorage("lesionTipo", expediente.lesion.split("|")[0])
        saveInStorage("lesionDescripcion", expediente.lesion.split("|")[1])
        saveInStorage("puesto_trabajo", expediente.puesto_trabajo)
        saveInStorage("id", expediente.id)
        saveInStorage("valoracionHechos", expediente.valoracion_hechos.split(","))

        setUpdate(expediente.id)

        saveInStorage("imagenes", jsonImagenes.filter((item) => item.expediente == expediente.id ))

        changeState(false)
    }


    const fetchDownloadWord = async(id:string):Promise<void> => {
        const timeOut = await new Promise<void>((r) => setTimeout(r, 200))
        setStateDownload(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expediente/generate-word-document/${id}/`,{method: 'POST'})
            if(!response.ok){
                throw new Error("Error al generar el documento word")
            }
            setStateDownload(false)
            window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/media/word/ficha_${id}.docx`
        } catch (error) {
            console.log(error)
        }
    }

    const fetchDeleteExpediente = async(id:string): Promise<void> => {
        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expediente/${id}/`,{method: 'DELETE'})
            if(!response.ok){
                throw new Error("Error al eliminar el expediente")
            }
            if (response.status === 204){
                router.refresh()
                localStorage.clear()
                window.location.reload()
            }
        }catch(Error){
            console.log(Error)
        }
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
                <>
                <h1>Historial</h1>
                <br />
                <hr />
                <br />
                </>
            ) : (``)
            }
            { state ? (``) : (<span className="cursor-pointer hover:underline flex gap-1 hover:gap-2 w-fit" onClick={() => {changeState(true); localStorage.clear(); setUpdate(undefined)}}>Volver <Icon className="w-6" /></span>)}
            <br />
            {
                state ? (
                    <CreateFormApp changeState={changeState} trabajadores={jsonTrabajadores} expedientesJson={jsonExpedientes} update={updateExpediente} fetchDownloadWord={fetchDownloadWord} errorServidor={errorServidor}/>
                ) : (<NewformApp 
                    propJson={jsonTrabajadores} 
                    idExpediente={update? update : uuidv4()} 
                    fetchDeleteExpediente={fetchDeleteExpediente} 
                    fetchDownloadWord={fetchDownloadWord} 
                    jsonPuestoTrabajo={jsonPuestoTrabajo} 
                    jsonLugarAccidente={jsonLugarAccidente}
                    jsonFormasProducirseAccidente={jsonFormasProducirseAccidente}
                    />)
            }
            {
                stateDownload ? (
                    <Downloading />
                ) : (``)
            }
        </main>
     );
}
 
export default DashboardApp;