"use client"

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { aplicarAcciones, ExpedienteJson, ImagenJson, Person, selectJson } from "@/interfaces/interfaces";
import { TrashIcon, XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import { abel, inter, roboto } from "@/app/ui/fonts";
import { Expediente } from "@/models/Expediente";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import WordSvg from "./icons/word";
import ExcelSvg from "./icons/excel";
import {saveInStorage, fetchUpdateLocalImages, fetchDeleteImage, redirectToEdit, compressImage, existValue} from "../lib/data"
import { format } from 'date-fns';


type Props = {
    propJson: Person[]
    idExpediente: string
    fetchDeleteExpediente: (id:string)=>void
    fetchDownloadWord: (id:string)=>void
    jsonPuestoTrabajo: selectJson[]
    jsonLugarAccidente: selectJson[]
    jsonFormasProducirseAccidente: selectJson[]
    jsonCausasAccidente: selectJson[]
    jsonCreador: selectJson[]
}

type Variant = {
    creador: boolean
    puesto_trabajo: boolean
    lugar_accidente: boolean
}
let variant:Variant = {
    creador: false,
    puesto_trabajo: false,
    lugar_accidente: false
}

const NewformApp: React.FC<Props> = ({ propJson ,  idExpediente, fetchDeleteExpediente, fetchDownloadWord, jsonPuestoTrabajo, jsonLugarAccidente, jsonFormasProducirseAccidente, jsonCausasAccidente, jsonCreador}) => {
    const [lista, setLista] = useState<Person[]>([])
    const [json, setJson] = useState<Person[]>(propJson)
    const router = useRouter()
    const edadRefElement = useRef<HTMLInputElement>(null);
    const experienciaRefElement = useRef<HTMLInputElement>(null);
    
    const fechaActual = new Date();
    const fechaFormateada = format(fechaActual, "yyyy-MM-dd'T'HH:mm");

    const [idexpediente, setIdexpediente] = useState<string>(idExpediente)
    const [name, setName] = useState('');
    const [edad, setEdad] = useState<number>(18);
    const [experiencia, setExperiencia] = useState<number>(0)
    const [men, setMen] = useState<boolean>(false)
    const [women, setWomen] = useState<boolean>(false)
    const [lugar, setLugar] = useState<string>(jsonLugarAccidente[0]?.nombre || "")
    const [lesionado, setLesionado] = useState<boolean>(false)
    const [lesiontipo, setLesiontipo] = useState<string>(`Leve`)
    const [lesiondescripcion, setLesiondescripcion] = useState<string>("")
    const [fechasuceso, setFechasuceso] = useState<string>(fechaFormateada)
    const [fechaInvestigacion, setFechaInvestigacion] = useState<string>(fechaFormateada)
    const [descripcion, setDescripcion] = useState<string>("")
    const [idtrabajador, setIdtrabajador] = useState<number|undefined>(undefined)
    const [imagenes, setImagenes] = useState<File[]|null>(null)
    const [puestoTrabajo, setPuestoTrabajo] = useState<string>(jsonPuestoTrabajo[0]?.nombre || "")
    const [estado, setEstado] = useState<boolean>(true)
    const [updateId, setUpdateId] = useState<string|undefined>()
    const [arrowLoading, setArrowLoading] = useState<boolean>(false)
    const [valoracionHechos, setValoracionHechos] = useState<string[]>(new Array(5).fill(""))
    const [formasAccidente, setFormasAccidente] = useState<string>(jsonFormasProducirseAccidente[0]?.nombre || "")
    const [analisisCausas, setAnalisisCausas] = useState<string[][]>(Array.from({length: 8}, () => {return []}))
    const [causasAccidente, setCausasAccidente] = useState<string[]>([])
    const [listaAcciones, setListaAcciones] = useState<aplicarAcciones[]>([])
    const [accionAplicar, setAccionAplicar] = useState<string>("")
    const [prioridad, setPrioridad] = useState<number>(1)
    const [responsable, setResponsable] = useState<string>("Envasado")
    const [idAccion, setIdAccion] = useState<number>(0)
    const [itinere, setItinere] = useState<boolean>(false)
    const [descripcionCausaAccidente, setDescripcionCausaAccidente] = useState<string>("")
    const [tipoSuceso, setTipoSuceso] = useState<string>("Accidente con baja")
    const [creador, setCreador] = useState<string>(jsonCreador[0]?.nombre || "")
    const [exception, setException] = useState<Variant>(variant)
    const [otros, setOtros] = useState<boolean>(false)
    const [empresa, setEmpresa] = useState<string>("")
    const [estadoCargaImg, setEstadoCargaImg] = useState<boolean>(false)
    
    

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
        // localStorage.removeItem('fechaSuceso')
        // setFechasuceso(``)
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

        // localStorage.removeItem('fechaInvestigacion')
        // setFechaInvestigacion("")

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
        const aplicar_accionStorage = JSON.parse(localStorage.getItem("aplicar_accion")!)
        const itinereStorage = JSON.parse(localStorage.getItem("itinere")!)
        const tipoSucesoStorage = JSON.parse(localStorage.getItem("tipo_suceso")!)
        const fechaInvestigacionStorage = JSON.parse(localStorage.getItem("fechaInvestigacion")!)
        const creadorStorage = JSON.parse(localStorage.getItem("creador")!)
        const otrosStorage = JSON.parse(localStorage.getItem("otros")!)
        const empresaStorage = JSON.parse(localStorage.getItem("empresa")!)
        
        if(aplicar_accionStorage){
            let lista: aplicarAcciones[] = []
            aplicar_accionStorage.map((item:string[], index:number) => {
                const accion: aplicarAcciones = {
                    id: index,
                    accion: item[0],
                    prioridad: JSON.parse(item[1]),
                    responsable: item[2]
                }
                lista.push(accion)
            })
            setListaAcciones(lista)    
        }

        puestoTrabajoStorage ? setPuestoTrabajo(puestoTrabajoStorage) : ``; 
        nameStorage ? setName(JSON.parse(nameStorage)) : ``;
        lugarAccidenteStorage ? setLugar(lugarAccidenteStorage) : ``;
        fechaSucesoStorage ? setFechasuceso(fechaSucesoStorage) : ``;
        fechaInvestigacionStorage ? setFechaInvestigacion(fechaInvestigacionStorage) : ``;
        descripcionStorage ? setDescripcion(descripcionStorage) : ``;
        idTrabajadorStorage ? setIdtrabajador(idTrabajadorStorage) : ``;
        lesionadoStorage ? setLesionado(lesionadoStorage) : ``;
        lesionTipoStorage ? setLesiontipo(lesionTipoStorage) : ``;
        lesionDescripcionStorage ? setLesiondescripcion(lesionDescripcionStorage) : ``;
        valoracionHechosStorage ? setValoracionHechos(valoracionHechosStorage) : ``;
        formasAccidenteStorage ? setFormasAccidente(formasAccidenteStorage) : ``;
        analisisCausasStorage ? setAnalisisCausas(analisisCausasStorage) : ``;
        causasAccidenteStorage ? setCausasAccidente(causasAccidenteStorage) : ``;
        itinereStorage ? setItinere(itinereStorage) : ``;
        tipoSucesoStorage ? setTipoSuceso(tipoSucesoStorage) : ``;
        creadorStorage ? setCreador(creadorStorage) : ``;
        empresaStorage ? setEmpresa(empresaStorage) : ``;

        if (otrosStorage){
            setOtros(true)
        }

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

        variant.creador = false
        variant.puesto_trabajo = false
        variant.lugar_accidente = false
        
        if(storeId){
            if(!existValue(creadorStorage, jsonCreador)){
                variant.creador = true
            }
            if(!existValue(puestoTrabajoStorage, jsonPuestoTrabajo)){
                variant.puesto_trabajo = true
            }
            if(!existValue(lugarAccidenteStorage, jsonLugarAccidente)){
                variant.lugar_accidente = true
            }
            setException(variant)    
        }


    }, [])
    
    useEffect(() => {
        console.log("hola",exception)
    }, [exception])

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

    const pushCausasAccidente = () => { 
        let lista = causasAccidente;
        let value = descripcionCausaAccidente
        lista = [...lista, value]
        lista = lista.filter((item) => item !== "")
        setCausasAccidente(lista)
        saveInStorage("causas_accidente", lista)
        setDescripcionCausaAccidente("")
        console.log(lista)
   }

   const deleteCausaAccidente = (index:number) => {
        let lista = causasAccidente;
        lista = lista.filter((item,key) => key != index)
        setCausasAccidente(lista)
        saveInStorage("causas_accidente", lista)
   }
    

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && (e.target.files.length + imagenesGuardadas.length > 0) && (e.target.files.length + imagenesGuardadas.length) <= 3){
            setEstadoCargaImg(true)
            setArrowLoading(true)
            const compressedImages = await Promise.all(
                Array.from(e.target.files).map((file) => compressImage(file))
            );
            setImagenes(compressedImages);
            setEstadoCargaImg(false)
            setArrowLoading(false)
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
            let aplicar_accion:string[][] = []
            listaAcciones.map((item) => {
                aplicar_accion.push([
                    item.accion,
                    item.prioridad.toString(),
                    item.responsable
                ]);
            })
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
                causas_accidente: JSON.stringify(causasAccidente),
                aplicar_accion: JSON.stringify(aplicar_accion),
                itinere: itinere,
                tipo_suceso: tipoSuceso,
                creador: creador,
                fecha_investigacion: fechaInvestigacion,
                otros: otros,
                empresa: empresa
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
            saveInStorage("experiencia", `${persona.experiencia}`)
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

    const addNewAction = () => {
        const accion:aplicarAcciones = {
            id: idAccion + 1,
            accion: accionAplicar,
            prioridad: prioridad,
            responsable: responsable
        }
        setIdAccion(accion.id)
        setAccionAplicar("")
        setPrioridad(1)
        setResponsable("Envasado") 
        let lista = [...listaAcciones]
        lista.push(accion)
        setListaAcciones(lista)
        
        let aplicar_accion:string[][] = []
        lista.map((item) => {
            aplicar_accion.push([
                item.accion,
                item.prioridad.toString(),
                item.responsable
            ]);
        })
        console.log(aplicar_accion)
        saveInStorage("aplicar_accion", aplicar_accion)
    }
    const deleteAction = (id:number) => {
        let lista = [...listaAcciones]
        lista = lista.filter((item) => item.id != id)
        setListaAcciones(lista)
    }

    const formasProducirseAccidenteSelector = (value: string) => {
        saveInStorage("formas_accidente", value); setFormasAccidente(value);
        if(value == "Otros"){
            setOtros(true)
            saveInStorage("otros", true)
            setFormasAccidente("")
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
                    ``
                )
            }
            <div className="bg-slate-100 p-2 lg:p-5 rounded flex-col overflow-hidden">
                {updateId? (
                    <div className="flex gap-2">
                        <motion.div
                        whileTap={{scale:0.93}}
                        onClick={() => fetchDownloadWord(updateId)}  className="mb-3 flex items-center gap-1 cursor-pointer p-2 rounded-sm bg-blue-400 text-white">
                            <WordSvg width={28} height={28}/>
                            <p className="hover:underline">Exportar a Word</p>
                        </motion.div>
                        <motion.span
                        whileTap={{scale:0.73}}
                        onClick={() => {borrarIncidente()}} className="cursor-pointer hover:underline flex gap-1 p-2 bg-red-500 rounded-md mb-3 text-white items-center">Eliminar <TrashIcon className="w-4" /></motion.span>
                        {/* <motion.div
                        whileTap={{scale:0.93}}
                        onClick={() => fetchDownloadWord(updateId)}  className="mb-3 flex items-center gap-1 cursor-pointer p-2 rounded-sm bg-green-500 text-white">
                            <ExcelSvg width={28} height={28}/>
                            <p className="hover:underline">Exportar a Excel</p>
                        </motion.div> */}
                    </div>
                ):(``)}
                <form action="" onSubmit={handleSubmit} className="w-full">
                    <div className="flex sm:flex-row flex-col w-full gap-5">
                        <fieldset className="border-2 border-gray-300 rounded-lg p-5 flex lg:flex-row flex-col gap-5 sm:w-1/6 w-full">
                            <legend>Empresa</legend>
                            <div className="flex gap-2 items-center">
                                <label>Publindal</label>
                                <input type="radio" value="Publindal" name="empresa" checked={empresa == "Publindal" ? true : false} required onChange={() => {setEmpresa("Publindal"), saveInStorage("empresa", "Publindal")}}/>
                            </div>
                            <div className="flex gap-2 items-center">
                                <label>Catal</label>
                                <input type="radio" value="Catal" name="empresa" checked={empresa == "Catal" ? true : false} required onChange={() => {setEmpresa("Catal"), saveInStorage("empresa", "Catal")}}/>
                            </div>
                        </fieldset>
                        <fieldset className="border-2 border-gray-300 rounded-lg p-5 flex lg:flex-row flex-col gap-5 w-full">
                            <legend>Firmas</legend>
                            <div className="w-full">
                                {
                                    exception.creador ? (
                                        <>
                                            <label className="flex gap-3">Persona que efectúa la investigación <PencilSquareIcon onClick={() => {redirectToEdit("creador")}} className="w-5 h-5 hover:cursor-pointer"/></label>
                                            <input value={creador} className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" onChange={(e) => {setCreador(e.target.value); saveInStorage("creador", e.target.value)}} />
                                        </>
                                    ) : (
                                        <>
                                            <label className="flex gap-3">Persona que efectúa la investigación <PencilSquareIcon onClick={() => {redirectToEdit("creador")}} className="w-5 h-5 hover:cursor-pointer"/></label>
                                            <select value={creador} className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" onChange={(e) => {setCreador(e.target.value); saveInStorage("creador", e.target.value)}} >
                                                {
                                                    jsonCreador.map((item, key) => (
                                                        <option key={key} value={item.nombre}>{item.nombre}</option>
                                                    ))
                                                }
                                            </select>
                                        </>
                                    )
                                }
                            </div>
                            <div className="lg:w-1/3 w-full">
                                <label>Fecha de investigación</label>
                                <input readOnly onChange={(e: ChangeEvent<HTMLInputElement>) => {setFechaInvestigacion(e.target.value); saveInStorage("fechaInvestigacion", e.target.value)}} value={fechaInvestigacion} type="datetime-local" className="h-10 w-full bg-slate-200 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" />
                            </div>
                        </fieldset>
                    </div>
                    <br />
                    <fieldset className="border-2 border-gray-300 rounded-lg p-5">
                        <legend>1. Datos del suceso</legend>
                        <div className="flex gap-2 lg:gap-5 flex-col lg:flex-row w-full">
                            <div className="lg:w-2/3 w-full">
                                <label htmlFor="">Operario</label>
                                <input onChange={(e: ChangeEvent<HTMLInputElement>) => { setName(e.target.value); saveInStorage("name", e.target.value) }} value={name}
                                    type="text" className="  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder=" Escribe el apellido " required />
                                {lista.length > 0 ?
                                    <div className="bg-slate-100 flex flex-col border-[1px] border-solid border-gray-50 max-h-40 overflow-auto rounded mt-2 gap-2">
                                        {
                                            (lista).map((item, index) => (
                                                <span key={index} onClick={() => { choose(item) }} className="cursor-pointer text-start mx-[2px] hover:bg-black/15 rounded px-2 border-b-[1px] border-b-gray-300 p-2 border-solid">{item.nombre}, {item.apellido} | Id: {item.id}</span>
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
                                {
                                    !itinere ? (
                                        <>
                                            {
                                                exception.puesto_trabajo ? (
                                                    <>
                                                      <label htmlFor="" className="flex gap-2">Puesto de Trabajo <PencilSquareIcon onClick={() => {redirectToEdit("puesto_trabajo")}} className="w-5 h-5 hover:cursor-pointer"/>
                                                        <div className="flex gap-2 items-center mb-1">
                                                            <label>Itinere?</label>
                                                            <input type="checkbox" checked={itinere? true : false} onChange={(e) => {if(!updateId){setItinere(e.target.checked); saveInStorage("itinere", e.target.checked)}}} name="" id="" />
                                                        </div>

                                                        </label>
                                                        <input type="text" value={puestoTrabajo} onChange={(e) => { setPuestoTrabajo(e.target.value);saveInStorage("puesto_trabajo", e.target.value) }} className="  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" required />
                                                    </>
                                                ) : (
                                                    <>
                                                        <label htmlFor="" className="flex gap-2">Puesto de Trabajo <PencilSquareIcon onClick={() => {redirectToEdit("puesto_trabajo")}} className="w-5 h-5 hover:cursor-pointer"/>
                                                        <div className="flex gap-2 items-center mb-1">
                                                            <label>Itinere?</label>
                                                            <input type="checkbox" checked={itinere? true : false} onChange={(e) => {if(!updateId){setItinere(e.target.checked); saveInStorage("itinere", e.target.checked)}}} name="" id="" />
                                                        </div>

                                                        </label>
                                                        <select value={puestoTrabajo} onChange={(e) => { setPuestoTrabajo(e.target.value);saveInStorage("puesto_trabajo", e.target.value) }} className="  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" required>
                                                            {
                                                                jsonPuestoTrabajo.map((item, index) => (
                                                                    <option key={index} value={`${item.nombre}`}>{item.nombre}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </>
                                                )
                                            }
                                        </>
                                    ) : (
                                        <>
                                            <label htmlFor="" className="flex gap-2">Puesto de Trabajo 
                                                <div className="flex gap-2 items-center mb-1">
                                                    <label>Itinere?</label>
                                                    <input type="checkbox" checked={itinere? true : false} onChange={(e) => {if(!updateId){setItinere(e.target.checked); saveInStorage("itinere", e.target.checked)}}} name="" id="" />
                                                </div>

                                            </label>
                                            <input type="text" value={puestoTrabajo} onChange={(e) => { setPuestoTrabajo(e.target.value);saveInStorage("puesto_trabajo", e.target.value) }} className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" />
                                        </>
                                    )
                                }
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
                        <br />
                        <div className="flex gap-2 lg:gap-5 flex-col lg:flex-row w-full">
                            <div className="lg:w-1/2 w-full">
                                {
                                    exception.lugar_accidente ? (
                                        <>
                                            <label className="flex gap-2">Lugar accidente <PencilSquareIcon onClick={() => {redirectToEdit("lugar_accidente")}} className="w-5 h-5 hover:cursor-pointer"/></label>
                                            <input type="text" value={lugar} onChange={(e) => {setLugar(e.target.value);saveInStorage("lugarAccidente", e.target.value)}} className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" />
                                        </>
                                    ) : (
                                        <>
                                            <label className="flex gap-2">Lugar accidente <PencilSquareIcon onClick={() => {redirectToEdit("lugar_accidente")}} className="w-5 h-5 hover:cursor-pointer"/></label>
                                            <select value={lugar} onChange={(e) => {setLugar(e.target.value);saveInStorage("lugarAccidente", e.target.value)}} className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" name="" id="" >
                                                {
                                                    jsonLugarAccidente.map((item, index) => (
                                                        <option key={index} value={`${item.nombre}`}>{item.nombre}</option>
                                                    ))
                                                }
                                            </select>
                                        </>
                                    )
                                }
                            </div>
                            <div className="lg:w-1/3 w-full">
                                <label htmlFor="">Fecha suceso</label>
                                <input type="datetime-local" value={fechasuceso} onChange={(e) => {setFechasuceso(e.target.value); saveInStorage("fechaSuceso", e.target.value)}} className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" name="" id="" />
                            </div>
                            <div className="lg:w-1/3 w-full">
                                <label>Tipo de suceso</label>
                                <select value={tipoSuceso} onChange={(e) => {setTipoSuceso(e.target.value); saveInStorage("tipo_suceso", e.target.value)}} className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" name="" id="">
                                    <option value="Accidente con baja">Accidente con baja</option>
                                    <option value="Accidente sin baja">Accidente sin baja</option>
                                    <option value="Incidente">Incidente</option>
                                </select>
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
                                        <textarea name="" placeholder="Describe la lesión" value={lesiondescripcion} onChange={(e) => {setLesiondescripcion(e.target.value); saveInStorage("lesionDescripcion", e.target.value)}} className="min-h-20 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" id=""></textarea>
                                    </div>
                                ) : (``)
                            }
                        </div>
                    </fieldset>
                    <br />
                    <fieldset className="w-full flex flex-col border-2 border-gray-300 rounded-lg p-5">
                        <legend>3. Descripción de los hechos</legend>
                        <label>Describe detalladamente lo sucedido</label>
                        <textarea className="min-h-20 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" onChange={(e) => {setDescripcion(e.target.value); saveInStorage("descripcion", e.target.value)}} value={descripcion} name="" id=""></textarea>
                    </fieldset>
                    <br />
                    <fieldset className="border-2 border-gray-300 rounded-lg p-5">
                        <legend>4. FORMA DE PRODUCIRSE EL ACCIDENTE </legend>
                        <div className="w-full flex flex-col">
                            <label className="flex gap-2" htmlFor="">Opciones </label>
                            {!otros? (
                                <div>
                                    <select value={formasAccidente} className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" onChange={(e) => {formasProducirseAccidenteSelector(e.target.value)}} name="" id="">
                                        {
                                            jsonFormasProducirseAccidente.map((item,index) => (
                                                <option key={index} value={`${item.nombre}`}>{item.nombre}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            ) : (
                                <input type="text" value={formasAccidente} className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" onChange={(e) => {formasProducirseAccidenteSelector(e.target.value)}}  maxLength={100} />
                            )}
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

                        <label className="flex gap-2">Causas que han provocado el Accidente.</label>
                        <div className="h-auto w-full text-gray-900 focus:outline-none p-5 flex lg:flex-row flex-col sm:gap-10 gap-5">
                            <div className="lg:w-1/4">
                                <div className="w-full">
                                    <fieldset className="border-2 border-gray-400 rounded-lg p-3 flex flex-col ">
                                        <label>Descripción</label>
                                        <textarea value={descripcionCausaAccidente} className="min-h-20" onChange={(e) => {setDescripcionCausaAccidente(e.target.value); saveInStorage("descripcion_causa_accidente", descripcionCausaAccidente)}}  name="" id=""></textarea>
                                        <br />
                                        <span onClick={() => {pushCausasAccidente()}} className="bg-slate-300 hover:bg-slate-100 cursor-pointer text-center">+</span>
                                    </fieldset>
                                </div>
                            </div>
                            <div className="w-full lg:pl-20">
                                <ul className="listaDesordenada">
                                    {
                                        causasAccidente.map((item, key) => (
                                            <div className="relative">
                                                <li className="bg-slate-300 p-4 rounded shadow-sm mt-2" key={key}>{item}</li>
                                                <motion.div onClick={() => {deleteCausaAccidente(key)}} initial={{scale:0}} whileInView={{scale:1}} transition={{ type: "spring", stiffness: 100, delay:0.3 }}  className="bg-red-300 hover:bg-red-400 rounded-full p-2 absolute -top-[0.9rem] cursor-pointer z-10 -right-2"><XMarc className="w-5"/></motion.div>
                                            </div>
                                        ))
                                    }
                                </ul>
                            </div>

                        </div>
                    </div>
                    <br />
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
                    <br />
                    <fieldset className="border-2 border-gray-300 rounded-lg p-5 flex xl:flex-row flex-col gap-5">
                        <legend>7. Medidas correctoras propuestas</legend>
                        <div className="lg:w-1/4">
                            <div className="w-full">
                                <fieldset className="border-2 border-gray-400 rounded-lg p-3 flex flex-col ">
                                    <label>Acción aplicar</label>
                                    <textarea className="min-h-20" onChange={(e) => {setAccionAplicar(e.target.value); saveInStorage("accion_aplicar", e.target.value)}} value={accionAplicar} name="" id=""></textarea>
                                    <label>Prioridad</label>
                                    <select onChange={(e) => {setPrioridad(+(e.target.value)); saveInStorage("accion_prioridad", +(e.target.value))}} value={prioridad} name="" id="">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                    </select>
                                    <label>Responsable</label>
                                    <select onChange={(e) => {setResponsable(e.target.value); saveInStorage("accion_responsable", e.target.value)}} value={responsable} name="" id="">
                                        <option value="Envasado">Envasado</option>
                                        <option value="Autos">Autos</option>
                                        <option value="Planchas">Planchas</option>
                                    </select>
                                    <br />
                                    <span onClick={() => addNewAction()} className="bg-slate-300 hover:bg-slate-100 cursor-pointer text-center">+</span>
                                </fieldset>
                            </div>
                        </div>
                        <div className="w-full">
                            {
                                listaAcciones.map((item, key) => (
                                    <fieldset className="border-2 border-gray-400 rounded-lg p-3 mb-5 relative">
                                        <legend>Responsable:{item.responsable} - Prioridad:{item.prioridad}</legend>
                                        <motion.div initial={{scale:0}} whileInView={{scale:1}} transition={{ type: "spring", stiffness: 100, delay:0.3 }} onClick={() => {deleteAction(item.id)}} className="bg-red-300 hover:bg-red-400 rounded-full p-2 absolute -top-[0.9rem] cursor-pointer z-10 -right-2"><XMarc className="w-5"/></motion.div>
                                        <p>{item.accion}</p>
                                    </fieldset>
                                ))
                            }
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
                    <br />
                    <div className="flex items-center gap-3">
                        {!estadoCargaImg ? (
                            <motion.button
                            whileTap={{scale:0.8}}
                            type="submit" className={`bg-slate-800 w-52 p-2 rounded-md mt-2 text-white hover:bg-black ${abel.className}`}>Enviar</motion.button>
                        ) : (``)}
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