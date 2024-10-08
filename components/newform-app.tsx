"use client"

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ExpedienteJson, ImagenJson, Person } from "@/interfaces/interfaces";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { abel, inter } from "@/app/ui/fonts";
import { Expediente } from "@/models/Expediente";
import { motion } from "framer-motion";

type Props = {
    propJson: Person[]
    clearUpdate?: () => void
    idExpediente: number
}

const NewformApp: React.FC<Props> = ({ propJson ,  clearUpdate, idExpediente}) => {
    const [lista, setLista] = useState<Person[]>([])
    const [json, setJson] = useState<Person[]>(propJson)

    const edadRefElement = useRef<HTMLInputElement>(null);
    const experienciaRefElement = useRef<HTMLInputElement>(null);
    
    const [idexpediente, setIdexpediente] = useState<number>(idExpediente)
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
    const [estado, setEstado] = useState<boolean>(true)

    const imagenesGuardadas: ImagenJson[] = (
        () => {
            try {
                const storedImages = localStorage.getItem("imagenes")
                return storedImages ? JSON.parse(storedImages) as ImagenJson[] : []
            } catch (error) {
                console.log("Error parsein json", error)
                return [];
            }
        }
    )()
    useEffect(() => {
        filter()
    }, [name])


    const saveInStorage = (tipo: string, value: any) => {
        localStorage.setItem(tipo, JSON.stringify(value))
    }
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
    }

    useEffect(() => {
        const name = localStorage.getItem("name")
        const edad = JSON.parse(localStorage.getItem("edad")!) || 18
        const experiencia = JSON.parse(localStorage.getItem("experiencia")!) || ``
        const men = JSON.parse(localStorage.getItem("men")!) || false
        const women = JSON.parse(localStorage.getItem("women")!) || false
        const lugarAccidente = JSON.parse(localStorage.getItem("lugarAccidente")!)
        const fechaSuceso = JSON.parse(localStorage.getItem("fechaSuceso")!)
        const descripcion = JSON.parse(localStorage.getItem("descripcion")!)
        const idTrabajador = JSON.parse(localStorage.getItem("idTrabajador")!)
        name ? setName(JSON.parse(name)) : ``;
        lugarAccidente ? setLugar(lugarAccidente) : ``;
        fechasuceso ? setFechasuceso(fechaSuceso) : ``;
        console.log(fechaSuceso)
        descripcion ? setDescripcion(descripcion) : ``;
        idTrabajador ? setIdtrabajador(idTrabajador) : ``;
        try {
            edad < 100 ? edadRefElement.current!.value = edad : edadRefElement.current!.value = "18";
            experienciaRefElement.current!.value = experiencia
            if (men) {
                setMen(true); setWomen(false);
                return
            }
            if (women) {
                setMen(false); setWomen(true);
            }
        } catch (error) {
            console.warn(error)
        }
    }, [])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0){
            setImagenes([...e.target.files])
        }
    }
    useEffect(() => {
        if (imagenes) {
          console.log('Imagenes seleccionadas:', imagenes);
        }
      }, [imagenes]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const sexo = men? `H` : `M`
        const lesion = `${lesiontipo} | ${lesiondescripcion}`
        
        if(idtrabajador){
            const expediente = new Expediente(idtrabajador, sexo, edad, lugar, fechasuceso, lesion, descripcion)
            fetchExpedientePost(expediente)
            return
        }
        alert("Id no especificado")
        
    }
    const verificarOperario = (id: number) => {
        let estado = false

        const persona = json.find((item) => item.id == id)
        if(persona){
            estado = true
        }
        setEstado(estado)
        return estado
    }
    const fetchExpedienteImagenes = async(): Promise<void> => {
        if(imagenes && imagenes.length > 0){
            imagenes.map((item) => {
                const formData = new FormData();
                formData.append('expediente', idexpediente.toString())
                formData.append('imagen', item)
                const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/imagenes/`
                if (clearUpdate) clearUpdate()
                fetch(url, {
                    method: `POST`,
                    body: formData
                }).then(response => {
                    if(!response.ok){
                        throw new Error('Error al enviar la imagen')
                    }
                }).catch((error) => {
                    console.error('No se puede establecer conexión con el servidor: ', error)
                })
            })
        }
    }
    const fetchExpedientePost = async(formulario: Expediente):Promise<void> =>{
        const updateId:number = +(JSON.parse(localStorage.getItem("updateId")!))
        const methodtype = updateId ? 'PUT' : 'POST'
        const url = updateId ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expediente/${updateId}/` : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expediente/`
        
        if(!verificarOperario(formulario.trabajador)) {
            alert('No existe dicho trabajador en la base de datos')
            return
        }

        const data:ExpedienteJson = {
            id: updateId? updateId : idexpediente,
            trabajador: formulario.trabajador,
            descripcion_hechos: formulario.descripcionHechos,
            edad: formulario.edad,
            fecha_suceso: formulario.fechaSuceso,
            lesion: formulario.lesion,
            lugar_accidente: formulario.lugarAccidente,
            sexo: formulario.sexo,
        }
        if (clearUpdate) clearUpdate()
        fetch(url, {
            method: methodtype,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(response => {
            if(!response.ok){
                throw new Error(`Error en la solicitud por ${methodtype}`)
            }
            fetchExpedienteImagenes()
            localStorage.clear()
            window.location.reload()
        }).catch((error) => {
            console.error('No se puede establecer conexión con el servidor: ', error)
        })
    }

    const fetchDeleteImage = async(id:number): Promise<void> => {
       try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/imagenes/${id}`, {method: "DELETE"})
            if(!response.ok){
                throw new Error("Error al eliminar la foto")
            }
            let lista: ImagenJson[] = JSON.parse(localStorage.getItem("imagenes")||`[]`) as ImagenJson[]
            lista = lista.filter((item) => item.id !== id)
            localStorage.setItem("imagenes", JSON.stringify(lista))
            window.location.reload()
       } catch (error) {
            console.log(error)
       }

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
    const Trash = TrashIcon;
    const XMarc = XMarkIcon;
    return (
        <section>
            <div className="flex justify-between">
                <div></div>
                <span onClick={() => { clearStorage() }} className="cursor-pointer hover:underline flex gap-1">Limpiar formulario <TrashIcon className="w-4" /></span>
            </div>
            <div className="bg-slate-200 p-2 lg:p-5 rounded flex-col overflow-hidden">
                <form action="" onSubmit={handleSubmit} className="w-full">
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
                            <input value={idtrabajador? idtrabajador : ``} onChange={(e) => { setIdtrabajador(+e.target.value);saveInStorage("idTrabajador", e.target.value); verificarOperario(+e.target.value) }} type="number" className="  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder=" Identificador " required />
                        </div>
                        <div className="lg:w-1/3 w-full">
                            <label htmlFor="">Edad</label>
                            <input ref={edadRefElement} onChange={(e) => { setEdad(+e.target.value);saveInStorage("edad", e.target.value) }} type="number" className="  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder=" Edad " required />
                        </div>
                    </div>
                    <div className="flex gap-2 lg:gap-5 flex-col lg:flex-row w-ful">
                        <div className="lg:w-1/6 w-full">
                            <label htmlFor="">Meses</label>
                            <input onChange={(e) => { setExperiencia(+e.target.value);saveInStorage("experiencia", e.target.value) }}
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
                            <label htmlFor="">Lugar accidente</label>
                            <input type="text" value={lugar} onChange={(e) => {setLugar(e.target.value);saveInStorage("lugarAccidente", e.target.value)}} className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" name="" id="" />
                        </div>
                        <div className="lg:w-1/3 w-full">
                            <label htmlFor="">Fecha suceso</label>
                            <input type="datetime-local" value={fechasuceso} onChange={(e) => {setFechasuceso(e.target.value); saveInStorage("fechaSuceso", e.target.value)}} className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" name="" id="" />
                        </div>
                    </div>
                    <br />
                    <div className="flex lg:gap-5 flex-col lg:flex-row justify-left lg:items-center w-full">
                        <div className="flex gap-2 items-center mb-1">
                            <label>Ha habido lesión?</label>
                            <input type="checkbox" onChange={(e) => {setLesionado(e.target.checked)}} name="" id="" />
                        </div>
                        {
                            lesionado ? (
                                <div className="w-full">
                                    <div className="flex lg:flex-row flex-col lg:gap-5 mb-2">
                                        <label>Tipo de lesión</label>
                                        <select value={lesiontipo} onChange={(e) => {setLesiontipo(e.target.value)}} className="h-11 lg:w-2/6 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600 text-[17px]" name="" id="">
                                            <option value="Leve">Leve</option>
                                            <option value="Grave">Grave</option>
                                            <option value="MuyGrave">Muy grave</option>
                                            <option value="Mortal">Mortal</option>
                                        </select>
                                    </div>
                                    <textarea name="" placeholder="Describe la lesión" onChange={(e) => {setLesiondescripcion(e.target.value)}} className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" id=""></textarea>
                                </div>
                            ) : (``)
                        }
                    </div>
                    <br />
                    <div className="w-full flex flex-col">
                        <label>Descripción del Suceso</label>
                        <textarea onChange={(e) => {setDescripcion(e.target.value); saveInStorage("descripcion", e.target.value)}} value={descripcion} name="" id=""></textarea>
                    </div>
                    {
                        imagenesGuardadas.length > 0 ? (
                            <div className="w-full flex lg:flex-row flex-col gap-5 p-10 border-2 border-blue-400 border-dashed mt-5">
                                {
                                    imagenesGuardadas.map((foto) => (
                                        <div className="lg:w-1/4 h-32 rounded flex bg-slate-100 relative">
                                            <motion.img 
                                            initial={{x: 100}}
                                            animate={{ x: 0 }}
                                            transition={{ type: "spring", stiffness: 100 }} 
                                            className="w-2/4" src={`${foto.imagen}`} alt="" />
                                            <div className="w-2/4 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                                                <motion.div initial={{scale:0}} animate={{scale:1}} transition={{ type: "spring", stiffness: 100 }} onClick={() => fetchDeleteImage(foto.id!)} className="bg-red-300 hover:bg-red-400 rounded-full p-2 absolute -top-[0.50rem] z-10 -right-2"><XMarc className="w-5"/></motion.div>
                                                <motion.a href={`${foto.imagen}`} target="_blank" className="w-full h-full flex justify-center items-center" whileHover={{scale: 1.3}}>Ver</motion.a>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        ):(
                            <div className="w-full flex gap-3 p-10 border-2 border-blue-400 border-dashed mt-5">
                                <h1>No tiene imágenes guardadas este expediente</h1>
                            </div>
                        )
                    }
                    <div className="w-full flex flex-col">
                        <label>Subir imagenes</label>
                        <input type="file" multiple onChange={(e) => {handleImageChange(e)}}/>
                    </div>
                    <button type="submit" className={`bg-slate-800 p-2 rounded-md mt-2 text-white hover:bg-black ${abel.className}`}>Enviar</button>
                </form>
            </div>
        </section>
    );
}

export default NewformApp;