"use client"

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Person } from "@/interfaces/interfaces";
import { TrashIcon } from "@heroicons/react/24/outline"
import { abel, inter } from "@/app/ui/fonts";

type Props = {
    propJson: Person[]
}

const NewformApp: React.FC<Props> = ({ propJson }) => {
    const [lista, setLista] = useState<Person[]>([])
    const [json, setJson] = useState<Person[]>(propJson)

    const [name, setName] = useState('');
    const edadRefElement = useRef<HTMLInputElement>(null);
    const experienciaRefElement = useRef<HTMLInputElement>(null);
    const [men, setMen] = useState<boolean>(false)
    const [women, setWomen] = useState<boolean>(false)

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
    }

    useEffect(() => {
        const name = localStorage.getItem("name")
        const edad = JSON.parse(localStorage.getItem("edad")!) || 18
        const experiencia = JSON.parse(localStorage.getItem("experiencia")!) || ``
        const men = JSON.parse(localStorage.getItem("men")!) || false
        const women = JSON.parse(localStorage.getItem("women")!) || false
        name ? setName(JSON.parse(name)) : ``;
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }
    const filter = async () => {
        // new Promise((resolve) => {
        //     setTimeout(resolve, 1000)
        // })
        const listaFiltrada = json.filter((item, index) => {
            return item.id.toString().toLowerCase().trim().startsWith(name.toLowerCase().trim()) || item.nombre.toLowerCase().trim().startsWith(name.toLowerCase().trim()) || item.apellido.toLowerCase().trim().startsWith(name.toLowerCase().trim())
        })
        setLista(name.length > 0 ? listaFiltrada : [])
    }
    const choose = (operario: Person) => {
        setName(`${operario.nombre}, ${operario.apellido} | Id: ${operario.id}`);
        localStorage.setItem("name", JSON.stringify(`${operario.nombre}, ${operario.apellido} | Id: ${operario.id}`))
        experienciaRefElement.current!.value = operario.experiencia.toString();
        localStorage.setItem("experiencia", JSON.stringify(operario.experiencia))
        setLista([])
    }
    const Trash = TrashIcon;
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
                                            <span onClick={() => { choose(item) }} className="cursor-pointer text-start mx-[2px] hover:bg-black/15 rounded px-2">{item.nombre}, {item.apellido} | Id: {item.id}</span>
                                        ))
                                    }
                                </div>
                                : ``}
                        </div>
                        <div className="lg:w-1/3 w-full">
                            <label htmlFor="">Edad</label>
                            <input ref={edadRefElement} onChange={(e) => { saveInStorage("edad", e.target.value) }} type="number" className="  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder=" Edad " required />
                        </div>
                    </div>
                    <div className="flex gap-2 lg:gap-5 flex-col lg:flex-row w-ful">
                        <div className="lg:w-1/6 w-full">
                            <label htmlFor="">Meses</label>
                            <input onChange={(e) => { saveInStorage("experiencia", e.target.value) }}
                                type="number" ref={experienciaRefElement} className="  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder=" Experiencia " required />
                        </div>
                        <div className="flex gap-2 w-2/3">
                            <div className="lg:w-1/6 w-full">
                                <label htmlFor="">Hombre</label>
                                <input type="checkbox" onChange={() => { setMen(true); setWomen(false); saveInStorage("men", true) }} checked={men} name="floating_email" className="  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder=" Edad " required />
                            </div>
                            <div className="lg:w-1/6 w-full">
                                <label htmlFor="">Mujer</label>
                                <input type="checkbox" onChange={() => { setWomen(true); setMen(false); saveInStorage("women", true); saveInStorage("men", false) }} checked={women} name="floating_email" className="  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder=" Edad " required />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 lg:gap-5 flex-col lg:flex-row w-full">
                        <div className="lg:w-1/2 w-full">
                            <label htmlFor="">Lugar accidente</label>
                            <input type="text" className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" name="" id="" />
                        </div>
                        <div className="lg:w-1/3 w-full">
                            <label htmlFor="">Fecha suceso</label>
                            <input type="datetime-local" className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" name="" id="" />
                        </div>
                    </div>
                    <div className="w-full flex flex-col">
                        <label>Descripción del Suceso</label>
                        <textarea name="" id=""></textarea>
                    </div>
                    <button type="submit" className={`bg-slate-800 p-2 rounded-md mt-2 text-white hover:bg-black ${abel.className}`}>Enviar</button>
                </form>
            </div>
        </section>
    );
}

export default NewformApp;