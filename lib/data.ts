import { ImagenJson, PuestoTrabajoJson } from "@/interfaces/interfaces"

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
 
 export const fetchPuestoTrabajo = async(): Promise<PuestoTrabajoJson[]|undefined> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/puesto_trabajo/`)
      if(!response){
        throw new Error('Error al cargar las imágenes')
      }
      return await response.json() as PuestoTrabajoJson[]
    } catch (error) {
      console.log(error)
    }
  }

export const updatePuestoTrabajo = async(puestos: string[]): Promise<void> =>{

    try {
        let contador = 1
        for (const nombre of puestos) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/puesto_trabajo/${contador}/`, {
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
  