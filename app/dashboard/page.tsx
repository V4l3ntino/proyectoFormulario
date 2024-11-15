import DashboardApp from "@/components/dashboard-app";
import { ExpedienteJson, ImagenJson, Person } from "@/interfaces/interfaces";
import { fetchSelector } from "@/lib/data";
export const dynamic = "force-dynamic"
const fetchUsers = async (): Promise<Person[]|undefined> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/trabajador/`, {
          next: { revalidate: 60 } // Opcional: puedes configurar la revalidación para que los datos se actualicen periódicamente
        });
      
        if (!response.ok) {
          throw new Error('Error al obtener los trabajadores');
        }
      
        return response.json();
    } catch (error) {
        console.log(error)
    }
  };

const fechExpedientes = async(): Promise<ExpedienteJson[]|undefined> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expediente/`)
    if (!response.ok){
      throw new Error('Error al cargar los expedientes')
    }
    return await response.json()
  } catch (error) {
    console.log(error)
  }
}

const fetchImagenes = async(): Promise<ImagenJson[]|undefined> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/imagenes/`)
    if(!response.ok){
      throw new Error('Error al cargar las imágenes')
    }
    return await response.json()
  } catch (error) {
    console.log(error)    
  }
}

const Dashboard = async() => {
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    const trabajadores = await fetchUsers()
    const expedientes = await fechExpedientes()
    const imagenes = await fetchImagenes()
    const puestoTrabajo = await fetchSelector("puesto_trabajo")
    const lugarAccidente = await fetchSelector("lugar_accidente")
    const jsonFormasProducirseAccidente = await fetchSelector("forma_producirse_accidente")
    const jsonCausasAccidente = await fetchSelector("causas_accidente")
    const jsonCreador = await fetchSelector("creador")
    const jsonParteCuerpo = await fetchSelector('parte_cuerpo')

    const errorServidor = trabajadores && expedientes && imagenes ? false : true
    
    return ( 
        <DashboardApp 
        jsonTrabajadores={trabajadores? trabajadores : []} 
        jsonExpedientes={expedientes ? expedientes : []} 
        jsonImagenes={imagenes ? imagenes : []}
        jsonPuestoTrabajo={puestoTrabajo? puestoTrabajo : []}
        jsonLugarAccidente={lugarAccidente? lugarAccidente : []}
        jsonFormasProducirseAccidente={jsonFormasProducirseAccidente? jsonFormasProducirseAccidente : []}
        errorServidor={errorServidor}
        jsonCausasAccidente={jsonCausasAccidente ? jsonCausasAccidente : []}
        jsonCreador={jsonCreador ? jsonCreador : []}
        jsonParteCuerpo={jsonParteCuerpo ? jsonParteCuerpo : []}
        />
     );
}
 
export default Dashboard;