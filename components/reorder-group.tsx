"use client"
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Reorder } from "framer-motion";
import { Item } from "./reorder-item";
import { selectJson } from "@/interfaces/interfaces";
import { updateSelector,fetchSelectorNewValue, fetchSelectorDeleteValue, validarSiExisteOpcion } from "@/lib/data";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";


type Props = {
  puestoTrabajo: selectJson[]
  lugarAccidente: selectJson[]
  formasProducirseAccidenete: selectJson[]
}
const tipos:string[] = ["puesto_trabajo","lugar_accidente", "forma_producirse_accidente"]
const nombreTipos: string[] = ["Puesto de Trabajo", "Lugar del Accidente", "Tipos de Accidente"]
export default function ReorderGroup({puestoTrabajo, lugarAccidente, formasProducirseAccidenete}: Props) {
    const router = useRouter();
    const [initialItems, setInitialItems] = useState<string[]>([])
    const [tipo, setTipo] = useState<string|null>()
    const [menu, setMenu] = useState(false)
    const [newOption, setNewOption] = useState<string>("")
    const inputRefElement = useRef<HTMLInputElement>(null);
    useEffect(() => {
      setInitialItems([])
      cargaDatos()
    }, [])
    const [items, setItems] = useState(initialItems);

    useEffect(()=>{
      setItems(initialItems)
    },[initialItems])

    useEffect(() => {
      if(tipo){
        updateSelector(items, tipo)
        router.refresh()
      }
      console.log(initialItems)
    },[items])

    const cargaDatos = () => {
        const tipoRead:string|null = localStorage.getItem("tipo_selector")
        switch(tipoRead){
          case tipos[0]:
            setInitialItems(puestoTrabajo.map((item) => item.nombre))
            setMenu(false)
            break;
          case tipos[1]:
            setInitialItems(lugarAccidente.map((item) => item.nombre))
            setMenu(false)
            break;
          case tipos[2]:
            setInitialItems(formasProducirseAccidenete.map((item) => item.nombre))
            setMenu(false)
            break;
          default:
            setMenu(true)
            break;
        }  
        setTipo(tipoRead)
    }

    const choise = (index:number) => {
      localStorage.setItem("tipo_selector", tipos[index])
      cargaDatos()
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const opcion: selectJson = {
        id: items.length + 1,
        nombre: newOption
      }
      if(validarSiExisteOpcion(newOption, items)){
        alert("Esa opción ya está registrada")
        return
      }
      fetchSelectorNewValue(opcion, tipo!)
      router.refresh()
      setItems((prevItems) => [...prevItems, newOption]);
      inputRefElement.current!.value = ""

    }

    const deletOption = (nombre:string) => {
      const newList = items.filter((item) => item !== nombre)
      fetchSelectorDeleteValue(newList, tipo!)
      router.refresh()
      setItems(newList)
    }
  return (
    <>
      {
        menu ? (
          <>
            <h1>Menú</h1>
            <hr />
            <br />
          </>
        ) : (
          <>
            <h1>Opciones</h1>
            <hr />
            <br />
            <span className="cursor-pointer hover:underline flex gap-1 hover:gap-2 w-fit mb-5" onClick={() => {setMenu(true); localStorage.setItem("tipo_selector", "")}}>Volver <ArrowLeftCircleIcon className="w-6" /></span>
          </>
        )
      }
      {
        menu ? (
          <>
            <div className="w-full h-screen flex flex-wrap gap-2">
              {
                nombreTipos.map((item, index)=> (
                  <div key={index} onClick={() => choise(index)} className="bg-slate-100 w-full xl:w-1/4 xl:h-1/4 p-2 flex items-center justify-center rounded-3xl text-3xl hover:bg-slate-50 hover:cursor-pointer">{item}</div>
                ))
              }
            </div>
          </>
        ) : (
          <>
            <Reorder.Group axis="y" onReorder={setItems} values={items} className="flex flex-col gap-2">
              {items.map((item) => (
                <Item key={item} item={item} deletOption={deletOption}/>
              ))}
            </Reorder.Group>
            <br />
            <form onSubmit={(e) => handleSubmit(e)}>
              <input ref={inputRefElement} onChange={(e) => setNewOption(e.target.value)} type="text" className="p-5 rounded-lg bg-slate-200 flex justify-between items-center w-full" placeholder="Escribe un nuevo valor" name="" id="newOptionInput" />
            </form>
          </>
          )
      }
    </>
  );
}
