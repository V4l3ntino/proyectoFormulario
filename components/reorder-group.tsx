"use client"
import * as React from "react";
import { useState, useEffect } from "react";
import { Reorder } from "framer-motion";
import { Item } from "./reorder-item";
import { selectJson } from "@/interfaces/interfaces";
import { updateSelector } from "@/lib/data";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";


type Props = {
  puestoTrabajo: selectJson[]
  lugarAccidente: selectJson[]
}
const tipos:string[] = ["puesto_trabajo","lugar_accidente"]
export default function ReorderGroup({puestoTrabajo, lugarAccidente}: Props) {
    const [initialItems, setInitialItems] = useState<string[]>([])
    const [tipo, setTipo] = useState<string|null>()
    const [menu, setMenu] = useState(false)
    useEffect(() => {
      const tipoRead:string|null = localStorage.getItem("tipo_selector")
      switch(tipoRead){
        case tipos[0]:
          setInitialItems(puestoTrabajo.map((item) => item.nombre))
          break;
        case tipos[1]:
          setInitialItems(lugarAccidente.map((item) => item.nombre))
          break;
        default:
          setMenu(true)
          break;
      }  
      setTipo(tipoRead)
    }, [])
    const [items, setItems] = useState(initialItems);

    useEffect(()=>{
      setItems(initialItems)
    },[initialItems])
    useEffect(() => {
      if(tipo){
        updateSelector(items, tipo)
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
          default:
            setMenu(true)
            break;
        }  
        setTipo(tipoRead)
    }

    const choise = (value:string) => {
      localStorage.setItem("tipo_selector", value)
      cargaDatos()
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
            <span className="cursor-pointer hover:underline flex gap-1 hover:gap-2 w-fit mb-5" onClick={() => {setMenu(true)}}>Volver <ArrowLeftCircleIcon className="w-6" /></span>
          </>
        )
      }
      {
        menu ? (
          <>
            <div className="w-full h-screen flex flex-wrap gap-2">
              {
                tipos.map((item, index)=> (
                  <div key={index} onClick={() => choise(item)} className="bg-slate-100 w-1/4 h-1/4 p-2 flex items-center justify-center rounded-3xl text-3xl hover:bg-slate-50 hover:cursor-pointer">{item}</div>
                ))
              }
            </div>
          </>
        ) : (
          <Reorder.Group axis="y" onReorder={setItems} values={items} className="flex flex-col gap-2">
            {items.map((item) => (
              <Item key={item} item={item} />
            ))}
          </Reorder.Group>
          )
      }
    </>
  );
}
