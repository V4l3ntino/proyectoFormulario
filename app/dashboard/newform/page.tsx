"use client"

import { useEffect, useRef, useState } from "react";
import { json } from "@/data"
import { Person } from "@/interfaces/interfaces";
const newform = () => {
    const [name, setName] = useState('');
    const refElement = useRef<HTMLInputElement>(null);
    const [lista, setLista] = useState<Person[]>([])
    useEffect(() => {
        filter()
    },[name])
    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }
    const filter = async() => {
        // new Promise((resolve) => {
        //     setTimeout(resolve, 1000)
        // })
        const listaFiltrada = json.filter((item,index) => {
            return item.name.toLowerCase().startsWith(name.toLowerCase())
        })
        setLista(name.length > 0 ? listaFiltrada : [])
    }
    const choose = (text:string) => {
        refElement.current!.value = text
        setLista([])
    }
    return ( 
        <main>
            <h1>New Form</h1>
            <br />
            <hr />
            <br />
            <section>
                
                <div className="bg-slate-200 p-2 lg:p-5 rounded flex-col overflow-hidden">
                    <form action="" onSubmit={handleSubmit} className="w-full">
                        <div className="flex gap-2 lg:gap-5 flex-col lg:flex-row w-full">
                            <div className="lg:w-2/3 w-full">
                                <label htmlFor="">Nombre</label>
                                <input ref={refElement} onChange={(e) => {setName(e.target.value)}} 
                                type="text" name="floating_email" className="peer  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder=" Nombre " required />
                                    
                                    {lista.length > 0 ? 
                                        <div className="bg-slate-100 flex flex-col border-[1px] border-solid border-gray-50 max-h-40 overflow-auto rounded mt-2">
                                            {
                                                (lista).map((item, index) => (
                                                    <span onClick={()=> {choose(item.name)}} className="cursor-pointer text-start mx-[2px] hover:bg-black/15 rounded px-2">{item.name}</span>
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
                    </form>
                </div>
            </section>
        </main>
     );
}
 
export default newform;