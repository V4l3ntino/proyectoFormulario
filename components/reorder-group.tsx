"use client"
import * as React from "react";
import { useState, useEffect } from "react";
import { Reorder } from "framer-motion";
import { Item } from "./reorder-item";
import { PuestoTrabajoJson } from "@/interfaces/interfaces";
import { updatePuestoTrabajo } from "@/lib/data";


type Props = {
    opciones: PuestoTrabajoJson[]
}

export default function ReorderGroup({opciones}: Props) {
    const initialItems = opciones.map((item) => item.nombre);
    const [items, setItems] = useState(initialItems);

    useEffect(()=>{
        updatePuestoTrabajo(items)
    },[initialItems])

  return (
    <Reorder.Group axis="y" onReorder={setItems} values={items} className="flex flex-col gap-2">
      {items.map((item) => (
        <Item key={item} item={item} />
      ))}
    </Reorder.Group>
  );
}
