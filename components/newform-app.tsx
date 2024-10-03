"use client"

import { useEffect, useRef, useState } from "react";
import { Person } from "@/interfaces/interfaces";

type Props = {
    propJson: Person[]
}

const NewformApp:React.FC<Props> = ({propJson}) => {
    const [name, setName] = useState('');
    const refElement = useRef<HTMLInputElement>(null);
    const experienciaRefElement = useRef<HTMLInputElement>(null);

    const [lista, setLista] = useState<Person[]>([])
    const [json, setJson] = useState<Person[]>(propJson)
    const [men, setMen] = useState<boolean>(false)
    const [women, setWomen] = useState<boolean>(false)

    useEffect(() => {
        filter()
    },[name])


    useEffect(() => {}, [])

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }
    const filter = async() => {
        // new Promise((resolve) => {
        //     setTimeout(resolve, 1000)
        // })
        const listaFiltrada = json.filter((item,index) => {
            return item.id.toString().toLowerCase().trim().startsWith(name.toLowerCase().trim())||item.nombre.toLowerCase().trim().startsWith(name.toLowerCase().trim()) || item.apellido.toLowerCase().trim().startsWith(name.toLowerCase().trim())
        })
        setLista(name.length > 0 ? listaFiltrada : [])
    }
    const choose = (operario:Person) => {
        refElement.current!.value = `${operario.nombre}, ${operario.apellido} | Id: ${operario.id}`
        experienciaRefElement.current!.value = operario.experiencia.toString()
        setLista([])
    }
    return ( 
        <section>
            <div className="bg-slate-200 p-2 lg:p-5 rounded flex-col overflow-hidden">
                    <form action="" onSubmit={handleSubmit} className="w-full">
                        <div className="flex gap-2 lg:gap-5 flex-col lg:flex-row w-full">
                            <div className="lg:w-2/3 w-full">
                                <label htmlFor="">Operario</label>
                                <input ref={refElement} onChange={(e) => {setName(e.target.value)}} 
                                type="text" name="floating_email" className="peer  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder=" Escribe el apellido " required />
                                    
                                    {lista.length > 0 ? 
                                        <div className="bg-slate-100 flex flex-col border-[1px] border-solid border-gray-50 max-h-40 overflow-auto rounded mt-2">
                                            {
                                                (lista).map((item, index) => (
                                                    <span onClick={()=> {choose(item)}} className="cursor-pointer text-start mx-[2px] hover:bg-black/15 rounded px-2">{item.nombre}, {item.apellido} | Id: {item.id}</span>
                                                ))
                                            }
                                        </div>
                                    :``}
                            </div>
                            <div className="lg:w-1/3 w-full">
                                <label htmlFor="">Edad</label>
                                <input type="email" name="floating_email" className="peer  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder=" Edad " required />
                            </div>
                        </div>
                        <div className="flex gap-2 lg:gap-5 flex-col lg:flex-row w-ful">
                            <div className="lg:w-1/6 w-full">
                                <label htmlFor="">Experiencia en Meses</label>
                                <input  
                                type="number" ref={experienciaRefElement} name="floating_email" className="peer  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder=" Experiencia " required />
                            </div>
                            <div className="flex gap-2 w-2/3">
                                <div className="lg:w-1/6 w-full">
                                    <label htmlFor="">Hombre</label>
                                    <input  type="checkbox" onClick={() => {setMen(true); setWomen(false)}} checked={men}  name="floating_email" className="peer  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder=" Edad " required />
                                </div>
                                <div className="lg:w-1/6 w-full">
                                    <label htmlFor="">Mujer</label>
                                    <input  type="checkbox" onClick={() => {setWomen(true); setMen(false)}} checked={women} name="floating_email" className="peer  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder=" Edad " required />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
        </section>
     );
}
 
export default NewformApp;