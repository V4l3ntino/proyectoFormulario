import { ImagenJson } from "@/interfaces/interfaces"

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
 
