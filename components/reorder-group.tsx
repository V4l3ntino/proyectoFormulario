"use client"
import * as React from "react";
import { useState, useEffect } from "react";
import { Reorder } from "framer-motion";
import { Item } from "./reorder-item";
import { selectJson } from "@/interfaces/interfaces";
import { updateSelector } from "@/lib/data";


type Props = {
  puestoTrabajo: selectJson[]
  lugarAccidente: selectJson[]
}

export default function ReorderGroup({puestoTrabajo, lugarAccidente}: Props) {
    const [initialItems, setInitialItems] = useState<string[]>([])
    const [tipo, setTipo] = useState<string|null>()
    useEffect(() => {
      const tipoRead:string|null = localStorage.getItem("tipo_selector")
      switch(tipoRead){
        case "puesto_trabajo":
          setInitialItems(puestoTrabajo.map((item) => item.nombre))
          break;
        case "lugar_accidente":
          setInitialItems(lugarAccidente.map((item) => item.nombre))
          break;
        default:
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
  return (
    <Reorder.Group axis="y" onReorder={setItems} values={items} className="flex flex-col gap-2">
      {items.map((item) => (
        <Item key={item} item={item} />
      ))}
    </Reorder.Group>
  );
}
