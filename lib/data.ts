import { ImagenJson, selectJson } from "@/interfaces/interfaces"

export const saveInStorage = (tipo: string, value: any) => {
    localStorage.setItem(tipo, JSON.stringify(value))
}
export const fetchUpdateLocalImages = async(id:string): Promise<void> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/imagenes/${id}`)
        if(!response.ok){
            throw new Error(`Error al buscar la imagen ${id} en la base de datos`)
        }
        const foto = await response.json() as ImagenJson
        let imagenesStorage = localStorage.getItem("imagenes")
        let fotosGuardados = imagenesStorage ? JSON.parse(imagenesStorage) as ImagenJson[] : []
        fotosGuardados.push(foto)
        saveInStorage("imagenes", fotosGuardados)
    } catch (error) {
        console.log(error)
    }
}

export const fetchDeleteImage = async(id:string): Promise<void> => {
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
 
 export const fetchSelector = async(tipo: string): Promise<selectJson[]|undefined> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${tipo}`,{cache: 'no-store'})
      if(!response){
        throw new Error('Error al cargar las imágenes')
      }
      return await response.json() as selectJson[]
    } catch (error) {
      console.log(error)
    }
  }

export const updateSelector = async(opciones: string[], tipo: string): Promise<void> =>{

    try {
        let contador = 1
        for (const nombre of opciones) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${tipo}/${contador}/`, {
                method: "PUT",
                body: JSON.stringify({ id: contador,nombre: nombre }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error(`Error al crear el puesto -> ${nombre}`);
            }
            contador++;
        }  

    } catch (error) {
        console.log(error)
    }

}

export const fetchSelectorNewValue = async(opcion: selectJson, tipo: string): Promise<void> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${tipo}/`, {
            method: "POST",
            body: JSON.stringify(opcion),
            headers: {
                "Content-Type": "application/json",
            },
        })
        if (!response.ok){
            throw new Error(`Error al crear la nueva opción > ${opcion.nombre}`)
        }
    } catch (error) {
        console.log(error)
    }
}

export const fetchSelectorDeleteValue = async(opciones: string[], tipo: string): Promise<void> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${tipo}/deleteall/`, {method: "DELETE"})
        if(!response.ok){
            throw new Error(`Error al borrar opciones`)
        }
    } catch (error) {
        console.log(error)
    }
    try {
        let contador = 1
        for (const nombre of opciones) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${tipo}/`, {
                method: "POST",
                body: JSON.stringify({ id: contador,nombre: nombre }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error(`Error al crear el puesto -> ${nombre}`);
            }
            contador++;
        }  

    } catch (error) {
        console.log(error)
    }

} 

export const redirectToEdit = (tipo:string) => {
    localStorage.setItem("tipo_selector", tipo)
    window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard/editar/`
}
  

export const validarSiExisteOpcion = (nombre: string, lista:string[]): boolean => {
    let found = false
    if (lista.find((item) => item == nombre)){
        found = true
    }
    return found
}