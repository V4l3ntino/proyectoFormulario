"use client"
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Reorder } from "framer-motion";
import { Item } from "./reorder-item";
import { selectJson } from "@/interfaces/interfaces";
import { updateSelector,fetchSelectorNewValue, fetchSelectorDeleteValue, validarSiExisteOpcion, redirectToDashboard } from "@/lib/data";
import { ArrowLeftCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";


type Props = {
  puestoTrabajo: selectJson[]
  lugarAccidente: selectJson[]
  // formasProducirseAccidenete: selectJson[]
  // causasAccidente: selectJson[]
  creador: selectJson[]
  parteCuerpo: selectJson[]
  agente: selectJson[]
  formaProducirse: selectJson[]
}
const tipos:string[] = ["puesto_trabajo","lugar_accidente","creador", 'parte_cuerpo', 'agente', 'forma_producirse']
const nombreTipos: string[] = ["Puesto de Trabajo", "Lugar del Accidente", "Creador", 'Partes del Cuerpo', 'Agente', 'Formas de producirse']
export default function ReorderGroup({puestoTrabajo, lugarAccidente,  creador, parteCuerpo, agente, formaProducirse}: Props) {
    const router = useRouter();
    const [initialItems, setInitialItems] = useState<string[]>([])
    const [tipo, setTipo] = useState<string|null>()
    const [menu, setMenu] = useState(false)
    const [optionDelete, setOptionDelete] = useState<boolean>(true)
    const [reorderOption, setReorderOption] = useState<boolean>(true)
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
            setReorderOption(true)
            break;
          case tipos[1]:
            setInitialItems(lugarAccidente.map((item) => item.nombre))
            setMenu(false)
            setReorderOption(true)
            break;
          case tipos[2]:
            setInitialItems(creador.map((item) => item.nombre))
            setMenu(false)
            setReorderOption(false)
            break;
          case tipos[3]:
            setInitialItems(parteCuerpo.map((item) => item.nombre))
            setMenu(false)
            setReorderOption(true)
            break;
          case tipos[4]:
            setInitialItems(agente.map((item) => item.nombre))
            setMenu(false)
            setReorderOption(true)
            break;
          case tipos[5]:
            setInitialItems(formaProducirse.map((item) => item.nombre))
            setMenu(false)
            setReorderOption(true)
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
      let confirmacion = confirm("Está seguro de borrar esta opción? Ten en cuenta que puede haber sido seleccionada en algún expediente")
      if(confirmacion){
        const newList = items.filter((item) => item !== nombre)
        fetchSelectorDeleteValue(newList, tipo!)
        router.refresh()
        setItems(newList)  
      }
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
            <div className="flex flex-row w-full justify-between gap-10">
              <span className="cursor-pointer hover:underline flex gap-1 hover:gap-2 w-fit mb-5" onClick={() => {redirectToDashboard()}}>Volver <ArrowLeftCircleIcon className="w-6" /></span>
              <span className="cursor-pointer hover:underline flex gap-1 hover:gap-2 w-fit mb-5" onClick={() => {setMenu(true); localStorage.setItem("tipo_selector", ""); setOptionDelete(true)}}>Ir al Menu</span>
            </div>
          </>
        )
      }
      {
        menu ? (
          <>
            <div className="w-full h-screen flex flex-wrap gap-2">
              {
                nombreTipos.map((item, index)=> (
                  <div key={index} onClick={() => choise(index)} className="bg-slate-100 w-full p-5 flex items-center justify-center rounded-3xl text-3xl hover:bg-slate-50 hover:cursor-pointer text-center">{item}</div>
                ))
              }
            </div>
          </>
        ) : (
          <>
            {
              reorderOption ? (
                <Reorder.Group axis="y" onReorder={setItems} values={items} className="flex flex-col gap-2">
                  {items.map((item) => (
                    <Item key={item} item={item} deletOption={deletOption} optionDelete={optionDelete}/>
                  ))}
                </Reorder.Group>
              ) : (
                <div className="flex gap-2 w-full flex-wrap">
                  {items.map((item, key) => (
                    <div key={key} className="p-5 rounded-lg bg-slate-200 flex justify-between items-center">
                      {
                        optionDelete? (
                          <TrashIcon  className="w-5 h-5 hover:cursor-pointer" onClick={() => deletOption(item)}/>
                        ) : (``)
                      }
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )
            }
            <br />
            {
              optionDelete? (
                <form onSubmit={(e) => handleSubmit(e)}>
                  <input ref={inputRefElement} onChange={(e) => setNewOption(e.target.value)} type="text" className="p-5 rounded-lg bg-slate-200 flex justify-between items-center w-full" placeholder="Escribe un nuevo valor" name="" id="newOptionInput" />
                </form>
              ) : (``)
            }
          </>
          )
      }
    </>
  );
}
