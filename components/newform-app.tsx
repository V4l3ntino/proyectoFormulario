"use client"

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ExpedienteJson, ImagenJson, Person, selectJson } from "@/interfaces/interfaces";
import { TrashIcon, XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import { abel, inter, roboto } from "@/app/ui/fonts";
import { Expediente } from "@/models/Expediente";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import WordSvg from "./icons/word";
import ExcelSvg from "./icons/excel";
import {saveInStorage, fetchUpdateLocalImages, fetchDeleteImage, redirectToEdit, compressImage} from "../lib/data"

type Props = {
    propJson: Person[]
    idExpediente: string
    fetchDeleteExpediente: (id:string)=>void
    fetchDownloadWord: (id:string)=>void
    jsonPuestoTrabajo: selectJson[]
    jsonLugarAccidente: selectJson[]
    jsonFormasProducirseAccidente: selectJson[]
    jsonCausasAccidente: selectJson[]
}

const NewformApp: React.FC<Props> = ({ propJson ,  idExpediente, fetchDeleteExpediente, fetchDownloadWord, jsonPuestoTrabajo, jsonLugarAccidente, jsonFormasProducirseAccidente, jsonCausasAccidente}) => {
    const [lista, setLista] = useState<Person[]>([])
    const [json, setJson] = useState<Person[]>(propJson)
    const router = useRouter()
    const edadRefElement = useRef<HTMLInputElement>(null);
    const experienciaRefElement = useRef<HTMLInputElement>(null);
    
    const [idexpediente, setIdexpediente] = useState<string>(idExpediente)
    const [name, setName] = useState('');
    const [edad, setEdad] = useState<number>(18);
    const [experiencia, setExperiencia] = useState<number>(0)
    const [men, setMen] = useState<boolean>(false)
    const [women, setWomen] = useState<boolean>(false)
    const [lugar, setLugar] = useState<string>("")
    const [lesionado, setLesionado] = useState<boolean>(false)
    const [lesiontipo, setLesiontipo] = useState<string>(`Leve`)
    const [lesiondescripcion, setLesiondescripcion] = useState<string>("")
    const [fechasuceso, setFechasuceso] = useState<string>("2024-10-11T11:47")
    const [descripcion, setDescripcion] = useState<string>("")
    const [idtrabajador, setIdtrabajador] = useState<number|undefined>(undefined)
    const [imagenes, setImagenes] = useState<File[]|null>(null)
    const [puestoTrabajo, setPuestoTrabajo] = useState<string>("")
    const [estado, setEstado] = useState<boolean>(true)
    const [updateId, setUpdateId] = useState<string|undefined>()
    const [arrowLoading, setArrowLoading] = useState<boolean>(false)
    const [valoracionHechos, setValoracionHechos] = useState<string[]>(new Array(5).fill(""))
    const [formasAccidente, setFormasAccidente] = useState<string>("")
    const [analisisCausas, setAnalisisCausas] = useState<string[][]>(Array.from({length: 8}, () => {return []}))
    const [causasAccidente, setCausasAccidente] = useState<string[]>([])

    const [imagenesGuardadas, setImagenesGuardadas] = useState<ImagenJson[]>([])
    useEffect(() => {
        filter()
    }, [name])


    const clearStorage = () => {
        localStorage.removeItem('name')
        setName(``)
        localStorage.removeItem('edad')
        edadRefElement.current!.value = `18`
        localStorage.removeItem('experiencia')
        experienciaRefElement.current!.value = ``
        localStorage.removeItem('men')
        setMen(false)
        localStorage.removeItem('women')
        setWomen(false)
        localStorage.removeItem('lugarAccidente')
        setLugar(``)
        localStorage.removeItem('fechaSuceso')
        setFechasuceso(``)
        localStorage.removeItem('descripcion')
        setDescripcion(``)
        localStorage.removeItem('idTrabajador')
        setIdtrabajador(undefined)
        localStorage.removeItem('puesto_trabajo')
        setPuestoTrabajo('')
        localStorage.removeItem('valoracionHechos')
        setValoracionHechos(new Array(5).fill(""))
        localStorage.removeItem('formas_accidente')
        setFormasAccidente('')
        
        localStorage.removeItem('analisis_causas')
        setAnalisisCausas(Array.from({length: 8}, () => {return []}))

        localStorage.removeItem('causas_accidente')
        setCausasAccidente([])
    }

    useEffect(() => {
        const nameStorage = localStorage.getItem("name")
        const edadStorage = JSON.parse(localStorage.getItem("edad")!) || 18
        const experienciaStorage = JSON.parse(localStorage.getItem("experiencia")!) || ``
        const menStorage = JSON.parse(localStorage.getItem("men")!) || false
        const womenStorage = JSON.parse(localStorage.getItem("women")!) || false
        const lugarAccidenteStorage = JSON.parse(localStorage.getItem("lugarAccidente")!)
        const fechaSucesoStorage = JSON.parse(localStorage.getItem("fechaSuceso")!)
        const descripcionStorage = JSON.parse(localStorage.getItem("descripcion")!)
        const idTrabajadorStorage = JSON.parse(localStorage.getItem("idTrabajador")!)
        const lesionadoStorage = JSON.parse(localStorage.getItem("lesionado")!)
        const lesionTipoStorage = JSON.parse(localStorage.getItem("lesionTipo")!)
        const lesionDescripcionStorage = JSON.parse(localStorage.getItem("lesionDescripcion")!)
        const puestoTrabajoStorage = JSON.parse(localStorage.getItem("puesto_trabajo")!)
        const valoracionHechosStorage = JSON.parse(localStorage.getItem("valoracionHechos")!)
        const formasAccidenteStorage = JSON.parse(localStorage.getItem("formas_accidente")!)
        const analisisCausasStorage = JSON.parse(localStorage.getItem("analisis_causas")!)
        const causasAccidenteStorage = JSON.parse(localStorage.getItem("causas_accidente")!)
        

        puestoTrabajoStorage ? setPuestoTrabajo(puestoTrabajoStorage) : ``; 
        nameStorage ? setName(JSON.parse(nameStorage)) : ``;
        lugarAccidenteStorage ? setLugar(lugarAccidenteStorage) : ``;
        fechasuceso ? setFechasuceso(fechaSucesoStorage) : ``;
        descripcionStorage ? setDescripcion(descripcionStorage) : ``;
        idTrabajadorStorage ? setIdtrabajador(idTrabajadorStorage) : ``;
        lesionadoStorage ? setLesionado(lesionadoStorage) : ``;
        lesionTipoStorage ? setLesiontipo(lesionTipoStorage) : ``;
        lesionDescripcionStorage ? setLesiondescripcion(lesionDescripcionStorage) : ``;
        valoracionHechosStorage ? setValoracionHechos(valoracionHechosStorage) : ``;
        formasAccidenteStorage ? setFormasAccidente(formasAccidenteStorage) : ``;
        analisisCausasStorage ? setAnalisisCausas(analisisCausasStorage) : ``;
        causasAccidenteStorage ? setCausasAccidente(causasAccidenteStorage) : ``;

        const storeId = localStorage.getItem("updateId")
        setUpdateId(storeId ? JSON.parse(storeId) : undefined)

        const storedImages = localStorage.getItem("imagenes")
        setImagenesGuardadas(storedImages ? JSON.parse(storedImages) as ImagenJson[] : [])

        try {
            edadStorage < 100 ? edadRefElement.current!.value = edadStorage : edadRefElement.current!.value = "18";
            experienciaRefElement.current!.value = experienciaStorage
            setEdad(+(edadRefElement.current!.value))
            if (menStorage) {
                setMen(true); setWomen(false);
                return
            }
            if (womenStorage) {
                setMen(false); setWomen(true);
            }
        } catch (error) {
            console.warn(error)
        }
    }, [])

    const updateValoracionHechos = (value: string, index: number) => {
        let lista = [...valoracionHechos]; lista[index] = `${value}`; setValoracionHechos(lista);
        saveInStorage("valoracionHechos", lista)
    }

    const pushOptions = (index: number,value:string) => {
        let lista = [...analisisCausas]; 
        if(lista[index].includes(value)){
            let deleteOption = lista[index].filter((item) => item !== value)
            lista[index] = [...deleteOption] 
        }else{
            lista[index].push(value)
        }
        setAnalisisCausas(lista)
        saveInStorage("analisis_causas", lista)
    }

    const pushCausasAccidente = (value:string) => { 
        let lista = [...causasAccidente];
        if(lista.includes(value)){
            lista = lista.filter((item) => item !== value)
            setCausasAccidente(lista)
            saveInStorage("causas_accidente", lista)
            return
        }
        lista = [...lista, value]
        setCausasAccidente(lista)
        saveInStorage("causas_accidente", lista)
        
   }
    
    useEffect(() => {
        console.log(analisisCausas)
    },[analisisCausas])

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && (e.target.files.length + imagenesGuardadas.length > 0) && (e.target.files.length + imagenesGuardadas.length) <= 3){
            const compressedImages = await Promise.all(
                Array.from(e.target.files).map((file) => compressImage(file))
            );
            setImagenes(compressedImages);
        }else{
            alert("Solo puedes subir hasta 3 imágenes como máximo.");
            e.target.value = "";
            return;
        }
    }
    useEffect(() => {
        if (imagenes) {
          console.log('Imagenes seleccionadas:', imagenes);
        }
      }, [imagenes]);

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setArrowLoading(true)
        const sexo = men? `H` : `M`
        const lesion = `${lesiontipo}|${lesiondescripcion}`
        
        if(idtrabajador){
            // const expediente = new Expediente(idtrabajador, sexo, edad, lugar, fechasuceso, lesionado? lesion: `|`, descripcion, lesionado, puestoTrabajo)
            const expediente:ExpedienteJson = {
                id: updateId? updateId : idexpediente,
                trabajador: idtrabajador,
                sexo: sexo,
                edad: edad,
                lugar_accidente: lugar,
                fecha_suceso: fechasuceso,
                lesionado_check: lesionado,
                lesion: lesionado? lesion : `|`,
                descripcion_hechos: descripcion,
                puesto_trabajo: puestoTrabajo,
                valoracion_hechos: valoracionHechos.toString(),
                formas_accidente: formasAccidente,
                analisis_causas: JSON.stringify(analisisCausas),
                causas_accidente: causasAccidente.toString()
            }
            fetchExpedientePost(expediente)
            if(!updateId){
                localStorage.clear()
                const timeout = await new Promise((r) => setTimeout(r, 1000))
                window.location.reload()
            }
            const timeout = await new Promise((r) => setTimeout(r, 1000))
            window.location.reload()
            return
        }
        alert("Id no especificado")
        
    }
    const verificarOperario = (id: number) => {
        let estadoDefault = false

        const persona:Person|undefined = json.find((item) => item.id == id)
        if(persona){
            estadoDefault = true;
            setName(`${persona.nombre}, ${persona.apellido}`)
            experienciaRefElement.current!.value = `${persona.experiencia}`
            saveInStorage("name", `${persona.nombre}, ${persona.apellido}`)
        }
        setEstado(estadoDefault)
        return estado
    }

    const fetchExpedienteImagenes = async(): Promise<void> => {
        let ids_imagenes:string[] = []
        if(imagenes && imagenes.length > 0){
            imagenes.map((item) => {
                const formData = new FormData();
                const id = uuidv4()
                ids_imagenes.push(id)
                formData.append("id", id)
                formData.append('expediente', updateId? updateId : idexpediente)
                formData.append('imagen', item)
                const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/imagenes/`
                console.log(url)
                fetch(url, {
                    method: `POST`,
                    body: formData
                }).then(response => {
                    if(!response.ok){
                        throw new Error('Error al enviar la imagen')
                    }
                }).catch((error) => {
                    console.error('No se puede establecer conexión con el servidor: ', error)
                    console.log(url)
                    for (const [key, value] of formData.entries()) {
                        console.log(`${key}: ${value}`);
                    }
                })
            })
            ids_imagenes.map((id) => {
                fetchUpdateLocalImages(id)
            })
        }
    }
    const fetchExpedientePost = async(formulario: ExpedienteJson):Promise<void> =>{
        const methodtype = updateId ? 'PUT' : 'POST'
        const url = updateId ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expediente/${updateId}/` : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expediente/`
        if(!verificarOperario(formulario.trabajador)) {
            alert('No existe dicho trabajador en la base de datos')
            return
        }

        fetch(url, {
            method: methodtype,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formulario)
        }).then(response => {
            if(!response.ok){
                alert('Algo ha ido mal')
                throw new Error(`Error en la solicitud por ${methodtype}`)
            }
            if(response.status === 201 || response.status === 200){
                router.refresh()
                fetchExpedienteImagenes()
                router.refresh()
                return
            }
            alert('Algo ha ido mal')
            alert(response.status)
        }).catch((error) => {
            console.group
                console.error('No se puede establecer conexión con el servidor: ', error)
                console.log(url)
                console.dir(formulario)
            console.groupEnd
        })
    }

    const filter = async () => {
        // new Promise((resolve) => {
        //     setTimeout(resolve, 1000)
        // })
        const listaFiltrada:Person[] = json.filter((item, index) => {
            return item.id.toString().toLowerCase().trim().startsWith(name.toLowerCase().trim()) || item.nombre.toLowerCase().trim().startsWith(name.toLowerCase().trim()) || item.apellido.toLowerCase().trim().startsWith(name.toLowerCase().trim())
        })
        setLista(name.length > 0 ? listaFiltrada : [])
    }
    const choose = (operario: Person) => {
        setName(`${operario.nombre}, ${operario.apellido}`);
        setIdtrabajador(operario.id)
        localStorage.setItem("name", JSON.stringify(`${operario.nombre}, ${operario.apellido} | Id: ${operario.id}`))
        experienciaRefElement.current!.value = operario.experiencia.toString();
        localStorage.setItem("experiencia", JSON.stringify(operario.experiencia))
        localStorage.setItem("idTrabajador", JSON.stringify(operario.id))
        setLista([])
    }

    const borrarIncidente = () => {
        let verificacion = confirm("Esta seguro de que quiere borrar el expediente?")
        if(verificacion){
            fetchDeleteExpediente(updateId!)
        }
    }

    const Trash = TrashIcon;
    const XMarc = XMarkIcon;
    return (
        <section>
            { updateId ? (
                <>
                    <h1>Actualizar Expediente</h1>
                    <br />
                </>
            ) : (``)
            }
            <hr />
            <br />
            {
                !updateId ? (
                    <div className="flex justify-between">
                        <div></div>
                        <span onClick={() => { clearStorage() }} className="cursor-pointer hover:underline flex gap-1">Limpiar formulario <TrashIcon className="w-4" /></span>
                    </div>
                ) : (
                    <div className="flex justify-between">
                        <div></div>
                        <motion.span
                        whileTap={{scale:0.73}}
                        onClick={() => {borrarIncidente()}} className="cursor-pointer hover:underline flex gap-1 p-2 bg-red-500 rounded-md mb-3 text-white">Eliminar <TrashIcon className="w-4" /></motion.span>
                    </div>
                )
            }
            <div className="bg-slate-200 p-2 lg:p-5 rounded flex-col overflow-hidden">
                {updateId? (
                    <div className="flex gap-2">
                        <motion.div
                        whileTap={{scale:0.93}}
                        onClick={() => fetchDownloadWord(updateId)}  className="mb-3 flex items-center gap-1 cursor-pointer p-2 rounded-sm bg-blue-400 text-white">
                            <WordSvg width={28} height={28}/>
                            <p className="hover:underline">Exportar a Word</p>
                        </motion.div>
                        <motion.div
                        whileTap={{scale:0.93}}
                        onClick={() => fetchDownloadWord(updateId)}  className="mb-3 flex items-center gap-1 cursor-pointer p-2 rounded-sm bg-green-500 text-white">
                            <ExcelSvg width={28} height={28}/>
                            <p className="hover:underline">Exportar a Excel</p>
                        </motion.div>
                    </div>
                ):(``)}
                <form action="" onSubmit={handleSubmit} className="w-full">
                    <fieldset className="border-2 border-gray-300 rounded-lg p-5">
                        <legend>1. Datos del suceso</legend>
                        <div className="flex gap-2 lg:gap-5 flex-col lg:flex-row w-full">
                            <div className="lg:w-2/3 w-full">
                                <label htmlFor="">Operario</label>
                                <input onChange={(e: ChangeEvent<HTMLInputElement>) => { setName(e.target.value); saveInStorage("name", e.target.value) }} value={name}
                                    type="text" className="  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder=" Escribe el apellido " required />
                                {lista.length > 0 ?
                                    <div className="bg-slate-100 flex flex-col border-[1px] border-solid border-gray-50 max-h-40 overflow-auto rounded mt-2">
                                        {
                                            (lista).map((item, index) => (
                                                <span key={index} onClick={() => { choose(item) }} className="cursor-pointer text-start mx-[2px] hover:bg-black/15 rounded px-2">{item.nombre}, {item.apellido} | Id: {item.id}</span>
                                            ))
                                        }
                                    </div>
                                    : ``}
                            </div>
                            <div className="lg:w-1/3 w-full">
                            {estado? (<label>Id</label>) : (<span className="border-b-2 border-rose-700 text-red-400">No se ha encontrado a dicho operario</span>)}
                                <input min={0} value={idtrabajador? idtrabajador : ``} onChange={(e) => { setIdtrabajador(+e.target.value);saveInStorage("idTrabajador", e.target.value); verificarOperario(+e.target.value) }} type="number" className="  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder=" Identificador " required />
                            </div>
                            <div className="lg:w-1/3 w-full">
                                <label htmlFor="">Edad</label>
                                <input ref={edadRefElement} onChange={(e) => { setEdad(+e.target.value);saveInStorage("edad", e.target.value) }} type="number" className="  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder=" Edad " required />
                            </div>
                            <div className="lg:w-1/3 w-full">
                                <label htmlFor="" className="flex gap-2">Puesto de Trabajo <PencilSquareIcon onClick={() => {redirectToEdit("puesto_trabajo")}} className="w-5 h-5 hover:cursor-pointer"/></label>
                                <select value={puestoTrabajo} onChange={(e) => { setPuestoTrabajo(e.target.value);saveInStorage("puesto_trabajo", e.target.value) }} className="  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" required>
                                    {
                                        jsonPuestoTrabajo.map((item, index) => (
                                            <option key={index} value={`${item.nombre}`}>{item.nombre}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2 lg:gap-5 flex-col lg:flex-row w-ful">
                            <div className="lg:w-1/6 w-full">
                                <label htmlFor="">Meses</label>
                                <input min={0} onChange={(e) => { setExperiencia(+e.target.value);saveInStorage("experiencia", e.target.value) }}
                                    type="number" ref={experienciaRefElement} className="  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder=" Experiencia " required />
                            </div>
                            <div className="flex gap-2 w-2/3">
                                <div className="lg:w-1/6 w-full">
                                    <label htmlFor="">Hombre</label>
                                    <input type="checkbox" onChange={() => { setMen(true); setWomen(false); saveInStorage("men", true) }} checked={men} name="floating_email" className="  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder=" Edad " />
                                </div>
                                <div className="lg:w-1/6 w-full">
                                    <label htmlFor="">Mujer</label>
                                    <input type="checkbox" onChange={() => { setWomen(true); setMen(false); saveInStorage("women", true); saveInStorage("men", false) }} checked={women} name="floating_email" className="  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder=" Edad " />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 lg:gap-5 flex-col lg:flex-row w-full">
                            <div className="lg:w-1/2 w-full">
                                <label className="flex gap-2">Lugar accidente <PencilSquareIcon onClick={() => {redirectToEdit("lugar_accidente")}} className="w-5 h-5 hover:cursor-pointer"/></label>
                                <select value={lugar} onChange={(e) => {setLugar(e.target.value);saveInStorage("lugarAccidente", e.target.value)}} className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" name="" id="" >
                                    {
                                        jsonLugarAccidente.map((item, index) => (
                                            <option key={index} value={`${item.nombre}`}>{item.nombre}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="lg:w-1/3 w-full">
                                <label htmlFor="">Fecha suceso</label>
                                <input type="datetime-local" value={fechasuceso} onChange={(e) => {setFechasuceso(e.target.value); saveInStorage("fechaSuceso", e.target.value)}} className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" name="" id="" />
                            </div>
                        </div>
                    </fieldset>
                    <br />
                    <fieldset className="border-2 border-gray-300 rounded-lg p-5">
                        <legend>2. Consecuencias</legend>
                        <div className="flex lg:gap-5 flex-col lg:flex-row justify-left lg:items-center w-full">
                            <div className="flex gap-2 items-center mb-1">
                                <label>Ha habido lesión?</label>
                                <input type="checkbox" checked={lesionado? true : false} onChange={(e) => {setLesionado(e.target.checked); saveInStorage("lesionado", e.target.checked)}} name="" id="" />
                            </div>
                            {
                                lesionado ? (
                                    <div className="w-full">
                                        <div className="flex lg:flex-row flex-col lg:gap-5 mb-2">
                                            <label>Tipo de lesión</label>
                                            <select value={lesiontipo} onChange={(e) => {setLesiontipo(e.target.value); saveInStorage("lesionTipo", e.target.value)}} className="h-11 lg:w-2/6 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600 text-[17px]" name="" id="">
                                                <option value="Leve">Leve</option>
                                                <option value="Grave">Grave</option>
                                                <option value="MuyGrave">Muy grave</option>
                                                <option value="Mortal">Mortal</option>
                                            </select>
                                        </div>
                                        <textarea name="" placeholder="Describe la lesión" value={lesiondescripcion} onChange={(e) => {setLesiondescripcion(e.target.value); saveInStorage("lesionDescripcion", e.target.value)}} className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" id=""></textarea>
                                    </div>
                                ) : (``)
                            }
                        </div>
                    </fieldset>
                    <br />
                    <fieldset className="w-full flex flex-col border-2 border-gray-300 rounded-lg p-5">
                        <legend>3. Descripción de los hechos</legend>
                        <label>Describe detalladamente lo sucedido</label>
                        <textarea onChange={(e) => {setDescripcion(e.target.value); saveInStorage("descripcion", e.target.value)}} value={descripcion} name="" id=""></textarea>
                    </fieldset>
                    <br />
                    <fieldset className="border-2 border-gray-300 rounded-lg p-5">
                        <legend>4. FORMA DE PRODUCIRSE EL ACCIDENTE </legend>
                        <div className="w-full flex flex-col">
                            <label className="flex gap-2" htmlFor="">Opciones <PencilSquareIcon className="w-5 h-5 hover:cursor-pointer" onClick={() => {redirectToEdit("forma_producirse_accidente")}} /></label>
                            <select value={formasAccidente} className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" onChange={(e) => {saveInStorage("formas_accidente", e.target.value); setFormasAccidente(e.target.value);}} name="" id="">
                                {
                                    jsonFormasProducirseAccidente.map((item,index) => (
                                        <option key={index} value={`${item.nombre}`}>{item.nombre}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </fieldset>
                    <br />
                    <fieldset className="border-2 border-gray-300 rounded-lg p-5 flex gap-3 flex-wrap">
                        <legend className="flex flex-col">5. ANÁLISIS DE LAS CAUSAS <span className={`text-[13px] ${roboto.className}`}>Marcar con un tick las opciones que consideres</span></legend>
                        <div className=" flex flex-col gap-1 border-2 border-gray-300 rounded-lg p-5">
                            <label>5.1 MÁQUINAS</label>
                            <div className="h-auto w-full text-gray-900 focus:outline-none p-5 flex flex-col gap-2">
                                <div className="flex gap-1 "><input type="checkbox" checked={analisisCausas[0].includes("Ausencia resguardos y/o dispositivos protección")} onChange={() => {pushOptions(0,"Ausencia resguardos y/o dispositivos protección")}} className="mt-1" name="" id="" /><span>Ausencia resguardos y/o dispositivos protección</span></div>
                                <div className="flex gap-1 "><input type="checkbox" checked={analisisCausas[0].includes("Sistemas mando inseguros")} onChange={() => {pushOptions(0,"Sistemas mando inseguros")}} className="mt-1" name="" id="" /><span>Sistemas mando inseguros</span></div>
                                <div className="flex gap-1 "><input type="checkbox" checked={analisisCausas[0].includes("Paro emergencia inexistente ó ineficaz")} onChange={() => {pushOptions(0,"Paro emergencia inexistente ó ineficaz")}} className="mt-1" name="" id="" /><span>Paro emergencia inexistente ó ineficaz</span></div>
                                <div className="flex gap-1 "><input type="checkbox" checked={analisisCausas[0].includes("Dispositivos enclavamiento violados")} onChange={() => {pushOptions(0,"Dispositivos enclavamiento violados")}} className="mt-1" name="" id="" /><span>Dispositivos enclavamiento violados</span></div>
                                <div className="flex gap-1 "><input type="checkbox" checked={analisisCausas[0].includes("Máquina mal utilizada")} onChange={() => {pushOptions(0,"Máquina mal utilizada")}} className="mt-1" name="" id="" /><span>Máquina mal utilizada</span></div>
                                <div className="flex gap-1 "><input type="checkbox" checked={analisisCausas[0].includes("Riesgos debidos a movilidad máquinas automotrices.")} onChange={() => {pushOptions(0,"Riesgos debidos a movilidad máquinas automotrices.")}} className="mt-1" name="" id="" /><span>Riesgos debidos a movilidad máquinas automotrices.</span></div>
                                <div className="flex gap-1 "><input type="checkbox" checked={analisisCausas[0].includes("Otros1")} onChange={() => {pushOptions(0,"Otros1")}} className="mt-1" name="" id="" /><span>Otros</span></div>
                            </div>
                        </div>
                        <div className=" flex flex-col border-2 border-gray-300 rounded-lg p-5">
                            <label>5.2 EQUIPOS, HERRAMIENTAS MEDIOS AUXILIARES</label>
                            <div className="h-auto w-full text-gray-900 focus:outline-none p-5 flex flex-col gap-2">
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[1].includes("Equipos, herramientas, medios auxiliares en mal estado.")} onChange={() => {pushOptions(1, "Equipos, herramientas, medios auxiliares en mal estado.")}} className="mt-1" name="" id="" /><span>Equipos, herramientas, medios auxiliares en mal estado.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[1].includes("Equipos, herramientas, medios auxiliares mal utilizados.")} onChange={() => {pushOptions(1, "Equipos, herramientas, medios auxiliares mal utilizados.")}} className="mt-1" name="" id="" /><span>Equipos, herramientas, medios auxiliares mal utilizados.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[1].includes("Inestabilidad de apilamientos, estanterías.")} onChange={() => {pushOptions(1, "Inestabilidad de apilamientos, estanterías.")}} className="mt-1" name="" id="" /><span>Inestabilidad de apilamientos, estanterías.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[1].includes("Otros2")} onChange={() => {pushOptions(1, "Otros2")}} className="mt-1" name="" id="" /><span>Otros</span></div>
                            </div>
                        </div>
                        <div className=" flex flex-col border-2 border-gray-300 rounded-lg p-5">
                            <label className="flex gap-2" htmlFor="">5.3 INCENDIOS</label>
                            <div className="h-auto w-full text-gray-900 focus:outline-none p-5 flex flex-col gap-2">
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[2].includes("Mal almacenamiento de sustancias inflamables")} onChange={() => {pushOptions(2, "Mal almacenamiento de sustancias inflamables")}} className="mt-1" name="" id="" /><span>Mal almacenamiento de sustancias inflamables</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[2].includes("Insuficiencia / ausencia medios extinción.")} onChange={() => {pushOptions(2, "Insuficiencia / ausencia medios extinción.")}} className="mt-1" name="" id="" /><span>Insuficiencia / ausencia medios extinción.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[2].includes("Otros3")} onChange={() => {pushOptions(2, "Otros3")}} className="mt-1" name="" id="" /><span>Otros</span></div>
                            </div>
                        </div>
                        <div className=" flex flex-col border-2 border-gray-300 rounded-lg p-5">
                            <label className="flex gap-2" htmlFor="">5.4 ELECTRICIDAD</label>
                            <div className="h-auto w-full text-gray-900 focus:outline-none p-5 flex flex-col gap-2">
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[3].includes("Inexistencia / fallo protección contra contactos directos.")} onChange={() => {pushOptions(3, "Inexistencia / fallo protección contra contactos directos.")}} className="mt-1" name="" id="" /><span>Inexistencia / fallo protección contra contactos directos.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[3].includes("Inexistencia / fallo protección contra contactos indirectos.")} onChange={() => {pushOptions(3, "Inexistencia / fallo protección contra contactos indirectos.")}} className="mt-1" name="" id="" /><span>Inexistencia / fallo protección contra contactos indirectos.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[3].includes("Otros4")} onChange={() => {pushOptions(3, "Otros4")}} className="mt-1" name="" id="" /><span>Otros</span></div>
                            </div>
                        </div>
                        <div className=" flex flex-col border-2 border-gray-300 rounded-lg p-5">
                            <label className="flex gap-2" htmlFor="">5.5 MATERIALES</label>
                            <div className="h-auto w-full text-gray-900 focus:outline-none p-5 flex flex-col gap-2">
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[4].includes("Sustancias o productos agresivos")} onChange={() => {pushOptions(4, "Sustancias o productos agresivos")}} className="mt-1" name="" id="" /><span>Sustancias o productos agresivos</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[4].includes("Objetos peligrosos por naturaleza (pesados, cortantes,...)")} onChange={() => {pushOptions(4, "Objetos peligrosos por naturaleza (pesados, cortantes,...)")}} className="mt-1" name="" id="" /><span>Objetos peligrosos por naturaleza (pesados, cortantes,...)</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[4].includes("Otros5")} onChange={() => {pushOptions(4, "Otros5")}} className="mt-1" name="" id="" /><span>Otros</span></div>
                            </div>
                        </div>
                        <div className=" flex flex-col border-2 border-gray-300 rounded-lg p-5">
                            <label className="flex gap-2" htmlFor="">5.6 AMBIENTE Y LUGAR DE TRABAJO</label>
                            <div className="h-auto w-full text-gray-900 focus:outline-none p-5 flex flex-col gap-2">
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[5].includes("Deficiencia, ausencia Distracción.")} onChange={() => {pushOptions(5, "Deficiencia, ausencia Distracción.")}} className="mt-1" name="" id="" /><span>Deficiencia, ausencia Distracción.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[5].includes("Ruido excesivo (enmascarador de señalización)")} onChange={() => {pushOptions(5, "Ruido excesivo (enmascarador de señalización)")}} className="mt-1" name="" id="" /><span>Ruido excesivo (enmascarador de señalización)</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[5].includes("Iluminación insuficiente ó deslumbramiento.")} onChange={() => {pushOptions(5, "Iluminación insuficiente ó deslumbramiento.")}} className="mt-1" name="" id="" /><span>Iluminación insuficiente ó deslumbramiento.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[5].includes("Otros agentes físicos (temperatura, humedad, etc.)")} onChange={() => {pushOptions(5, "Otros agentes físicos (temperatura, humedad, etc.)")}} className="mt-1" name="" id="" /><span>Otros agentes físicos (temperatura, humedad, etc.)</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[5].includes("Falta de orden y limpieza")} onChange={() => {pushOptions(5, "Falta de orden y limpieza")}} className="mt-1" name="" id="" /><span>Falta de orden y limpieza</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[5].includes("Malos pasos, tropiezos.")} onChange={() => {pushOptions(5, "Malos pasos, tropiezos.")}} className="mt-1" name="" id="" /><span>Malos pasos, tropiezos.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[5].includes("Posturas forzadas, espacio insuficiente.")} onChange={() => {pushOptions(5, "Posturas forzadas, espacio insuficiente.")}} className="mt-1" name="" id="" /><span>Posturas forzadas, espacio insuficiente.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[5].includes("Aberturas y huecos desprotegidos")} onChange={() => {pushOptions(5, "Aberturas y huecos desprotegidos")}} className="mt-1" name="" id="" /><span>Aberturas y huecos desprotegidos</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[5].includes("No delimitar zonas de paso-trabajo-almacén.")} onChange={() => {pushOptions(5, "No delimitar zonas de paso-trabajo-almacén.")}} className="mt-1" name="" id="" /><span>No delimitar zonas de paso-trabajo-almacén.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[5].includes("Deficiencias en plataformas de trabajo")} onChange={() => {pushOptions(5, "Deficiencias en plataformas de trabajo")}} className="mt-1" name="" id="" /><span>Deficiencias en plataformas de trabajo</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[5].includes("Otros6")} onChange={() => {pushOptions(5, "Otros6")}} className="mt-1" name="" id="" /><span>Otros</span></div>
                            </div>
                        </div>
                        <div className=" flex flex-col border-2 border-gray-300 rounded-lg p-5">
                            <label className="flex gap-2" htmlFor="">5.7 AL INDIVIDUO</label>
                            <div className="h-auto w-full text-gray-900 focus:outline-none p-5 flex flex-col gap-2">
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[6].includes("Desconocimiento de los Riesgos.")} onChange={() => {pushOptions(6, "Desconocimiento de los Riesgos.")}} className="mt-1" name="" id="" /><span>Desconocimiento de los Riesgos.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[6].includes("Desconocimientos medidas prevención adoptar.")} onChange={() => {pushOptions(6, "Desconocimientos medidas prevención adoptar.")}} className="mt-1" name="" id="" /><span>Desconocimientos medidas prevención adoptar.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[6].includes("Incumplimiento órdenes expresas de trabajo.")} onChange={() => {pushOptions(6, "Incumplimiento órdenes expresas de trabajo.")}} className="mt-1" name="" id="" /><span>Incumplimiento órdenes expresas de trabajo.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[6].includes("Desconocimiento método trabajo.")} onChange={() => {pushOptions(6, "Desconocimiento método trabajo.")}} className="mt-1" name="" id="" /><span>Desconocimiento método trabajo.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[6].includes("Desconocimiento medidas prevención  a aplicar.")} onChange={() => {pushOptions(6, "Desconocimiento medidas prevención  a aplicar.")}} className="mt-1" name="" id="" /><span>Desconocimiento medidas prevención  a aplicar.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[6].includes("Anulación-Retirada protecciones.")} onChange={() => {pushOptions(6, "Anulación-Retirada protecciones.")}} className="mt-1" name="" id="" /><span>Anulación-Retirada protecciones.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[6].includes("Sobre esfuerzos carácter personal.")} onChange={() => {pushOptions(6, "Sobre esfuerzos carácter personal.")}} className="mt-1" name="" id="" /><span>Sobre esfuerzos carácter personal.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[6].includes("No utilización de EPI`s")} onChange={() => {pushOptions(6, "No utilización de EPI`s")}} className="mt-1" name="" id="" /><span>No utilización de EPI`s</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[6].includes("Operar sin autorización")} onChange={() => {pushOptions(6, "Operar sin autorización")}} className="mt-1" name="" id="" /><span>Operar sin autorización</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[6].includes("Distracción al trabajar.")} onChange={() => {pushOptions(6, "Distracción al trabajar.")}} className="mt-1" name="" id="" /><span>Distracción al trabajar.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[6].includes("Otros: Manipulación incorrecta de cargas")} onChange={() => {pushOptions(6, "Otros: Manipulación incorrecta de cargas")}} className="mt-1" name="" id="" /><span>Otros: Manipulación incorrecta de cargas</span></div>
                            </div>
                        </div>
                        <div className=" flex flex-col border-2 border-gray-300 rounded-lg p-5">
                            <label className="flex gap-2" htmlFor="">5.8 ORGANIZACIÓN</label>
                            <div className="h-auto w-full text-gray-900 focus:outline-none p-5 flex flex-col gap-2">
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[7].includes("Falta de adecuación del equipo o material para la tarea a realizar.")} onChange={() => {pushOptions(7, "Falta de adecuación del equipo o material para la tarea a realizar.")}} className="mt-1" name="" id="" /><span>Falta de adecuación del equipo o material para la tarea a realizar.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[7].includes("Mantenimiento ó limpieza del equipo de trabajo sin detenerlo.")} onChange={() => {pushOptions(7, "Mantenimiento ó limpieza del equipo de trabajo sin detenerlo.")}} className="mt-1" name="" id="" /><span>Mantenimiento ó limpieza del equipo de trabajo sin detenerlo.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[7].includes("Sobrecarga de trabajo – Esfuerzos.")} onChange={() => {pushOptions(7, "Sobrecarga de trabajo – Esfuerzos.")}} className="mt-1" name="" id="" /><span>Sobrecarga de trabajo – Esfuerzos.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[7].includes("Falta coordinación entre trabajadores/as y/o empresas.")} onChange={() => {pushOptions(7, "Falta coordinación entre trabajadores/as y/o empresas.")}} className="mt-1" name="" id="" /><span>Falta coordinación entre trabajadores/as y/o empresas.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[7].includes("Operaciones incompatibles.")} onChange={() => {pushOptions(7, "Operaciones incompatibles.")}} className="mt-1" name="" id="" /><span>Operaciones incompatibles.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[7].includes("Compra – alquiler de equipos sin considerar aspectos preventivos.")} onChange={() => {pushOptions(7, "Compra – alquiler de equipos sin considerar aspectos preventivos.")}} className="mt-1" name="" id="" /><span>Compra – alquiler de equipos sin considerar aspectos preventivos.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[7].includes("Mantenimiento de equipos inexistente ó inadecuado.")} onChange={() => {pushOptions(7, "Mantenimiento de equipos inexistente ó inadecuado.")}} className="mt-1" name="" id="" /><span>Mantenimiento de equipos inexistente ó inadecuado.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[7].includes("Inexistencia de EPI`s")} onChange={() => {pushOptions(7, "Inexistencia de EPI`s")}} className="mt-1" name="" id="" /><span>Inexistencia de EPI`s</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[7].includes("Falta de formación-información.")} onChange={() => {pushOptions(7, "Falta de formación-información.")}} className="mt-1" name="" id="" /><span>Falta de formación-información.</span></div>
                                <div className="flex gap-1"><input type="checkbox" checked={analisisCausas[7].includes("Otros8")} onChange={() => {pushOptions(7, "Otros8")}} className="mt-1" name="" id="" /><span>Otros</span></div>
                            </div>
                        </div>
                    </fieldset>
                    <br />
                    <div className=" flex flex-col gap-1 border-2 border-gray-300 rounded-lg p-5">
                        <label className="flex gap-2">Cáusas que han provocado el Accidente. <PencilSquareIcon className="w-5 h-5 hover:cursor-pointer" onClick={() => {redirectToEdit("causas_accidente")}} /></label>
                        <div className="h-auto w-full text-gray-900 focus:outline-none p-5 flex flex-col gap-2">
                            {/* <div className="flex gap-1 "><input type="checkbox" checked={analisisCausas[0].includes("Ausencia resguardos y/o dispositivos protección")} onChange={() => {pushOptions(0,"Ausencia resguardos y/o dispositivos protección")}} className="mt-1" name="" id="" /><span>Ausencia resguardos y/o dispositivos protección</span></div> */}
                            {
                                jsonCausasAccidente.map((item, key) => (
                                    <div key={key} className="flex gap-1 "><input checked={causasAccidente.includes(item.nombre)} type="checkbox" className="mt-1" name="" id="" onChange={() => {pushCausasAccidente(item.nombre)}} /><span>{item.nombre}</span></div>
                                ))
                            }
                        </div>
                    </div>

                    <fieldset className="border-2 border-gray-300 rounded-lg p-5">
                        <legend>6. Valoración de los hechos </legend>
                        <div className="w-full flex flex-col gap-5">
                            <div className="w-full flex flex-col lg:flex-row gap-2">
                                <label className="flex w-full" htmlFor="">LA REPETICIÓN DE ESTE HECHO ES:</label>
                                <div className="flex w-full lg:justify-end gap-5">
                                    <label>BAJA</label>
                                    <input type="radio" value="BAJA" name="repeticion" required checked={valoracionHechos[0] == "BAJA"} onChange={() => {updateValoracionHechos("BAJA", 0)}}/>
                                    <label>MEDIA</label>
                                    <input type="radio" value="MEDIA" name="repeticion" required checked={valoracionHechos[0] == "MEDIA"} onChange={() => {updateValoracionHechos("MEDIA", 0)}}/>
                                    <label>ALTA</label>
                                    <input type="radio" value="ALTA" name="repeticion" required checked={valoracionHechos[0] == "ALTA"} onChange={() => {updateValoracionHechos("ALTA", 0)}}/>
                                </div>
                            </div>
                            <div className="w-full flex flex-col lg:flex-row gap-2">
                                <label className="flex w-full" htmlFor="">LA GRAVEDAD QUE PODÍA HABER TENIDO EL HECHO ES:</label>
                                <div className="flex  gap-3 w-full lg:justify-end">
                                    <label>LEVE</label>
                                    <input type="radio" value="LEVE" name="gravedad" required checked={valoracionHechos[1] == "LEVE"} onChange={() => {updateValoracionHechos("LEVE", 1)}}/>
                                    <label>GRAVE</label>
                                    <input type="radio" value="GRAVE" name="gravedad" required checked={valoracionHechos[1] == "GRAVE"} onChange={() => {updateValoracionHechos("GRAVE", 1)}}/>
                                    <label>MUY GRAVE</label>
                                    <input type="radio" value="MUY GRAVE" name="gravedad" required checked={valoracionHechos[1] == "MUY GRAVE"} onChange={() => {updateValoracionHechos("MUY GRAVE", 1)}}/>
                                </div>
                            </div>
                            <div className="w-full flex flex-col lg:flex-row gap-2">
                                <label className="flex w-full" htmlFor="">EXISTÍAN MEDIDAS DE CONTROL PARA EL RIESGO:</label>
                                <div className="flex  gap-5">
                                    <label>SI</label>
                                    <input type="radio" value="si" name="medidasControl" required checked={valoracionHechos[2] == "SI"} onChange={() => {updateValoracionHechos("SI", 2)}}/>
                                    <label>NO</label>
                                    <input type="radio" value="no" name="medidasControl" required checked={valoracionHechos[2] == "NO"} onChange={() => {updateValoracionHechos("NO", 2)}}/>
                                </div>
                            </div>
                            <div className="w-full flex flex-col lg:flex-row gap-2">
                                <label className="flex w-full" htmlFor="">EL ACCIDENTADO/A CONOCÍA EL RIESGO:</label>
                                <div className="flex  gap-5">
                                    <label>SI</label>
                                    <input type="radio" value="si" name="riesgo" required checked={valoracionHechos[3] == "SI"} onChange={() => {updateValoracionHechos("SI", 3)}}/>
                                    <label>NO</label>
                                    <input type="radio" value="no" name="riesgo" required checked={valoracionHechos[3] == "NO"} onChange={() => {updateValoracionHechos("NO", 3)}}/>
                                </div>
                            </div>
                            <div className="w-full flex flex-col lg:flex-row gap-2">
                                <label className="flex w-full" htmlFor="">EL ACCIDENTADO/A CONOCÍA LAS MEDIDAS DE PREVENCIÓN:</label>
                                <div className="flex  gap-5">
                                    <label>SI</label>
                                    <input type="radio" value="si" name="prevencion" required checked={valoracionHechos[4] == "SI"} onChange={() => {updateValoracionHechos("SI", 4)}}/>
                                    <label>NO</label>
                                    <input type="radio" value="no" name="prevencion" required checked={valoracionHechos[4] == "NO"} onChange={() => {updateValoracionHechos("NO", 4)}}/>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    {
                        imagenesGuardadas.length > 0 ? (
                            <div className="w-full flex flex-wrap flex-row  gap-5 p-10 border-2 border-blue-400 border-dashed mt-5">
                                {
                                    imagenesGuardadas.map((foto) => (
                                        <motion.div
                                        initial={{scale:0}}
                                        whileInView={{scale:1}}
                                        viewport={{once:true}}
                                        transition={{ type: "spring", stiffness: 100 }}
                                        className="w-[30rem] h-52 rounded flex bg-slate-100 relative ">
                                            <motion.img 
                                            initial={{x: 100}}
                                            whileInView={{x: 0}}
                                            transition={{ type: "spring", stiffness: 100, delay:0.3 }} 
                                            className="w-2/4" src={`${foto.imagen}`} alt="" />
                                            <div className="w-2/4 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                                                <motion.div initial={{scale:0}} whileInView={{scale:1}} transition={{ type: "spring", stiffness: 100, delay:0.3 }} onClick={() => fetchDeleteImage(foto.id!)} className="bg-red-300 hover:bg-red-400 rounded-full p-2 absolute -top-[0.50rem] z-10 -right-2"><XMarc className="w-5"/></motion.div>
                                                <motion.a href={`${foto.imagen}`} target="_blank" className="w-full h-full flex justify-center items-center" whileHover={{scale: 1.3}}>Ver</motion.a>
                                            </div>
                                        </motion.div>
                                    ))
                                }
                            </div>
                        ):(
                            <div className="w-full flex gap-3 p-10 border-2 border-blue-400 border-dashed mt-5">
                                <h1>No tiene imágenes guardadas este expediente</h1>
                            </div>
                        )
                    }
                    {
                        imagenesGuardadas.length < 3 ? (
                            <div className="w-full flex flex-col">
                                <label>Subir imagenes</label>
                                <input type="file" accept=".png, .jpg, .jpeg" multiple onChange={(e) => {handleImageChange(e)}}/>
                            </div>
                        ) : (``)
                    }
                    <div className="flex items-center gap-3">
                        <motion.button
                        whileTap={{scale:0.8}}
                        type="submit" className={`bg-slate-800 p-2 rounded-md mt-2 text-white hover:bg-black ${abel.className}`}>Enviar</motion.button>
                        {arrowLoading ? (
                            <div className="loaderForm"></div>
                        ) : (``)}
                    </div>
                </form>
            </div>
        </section>
    );
}

export default NewformApp;