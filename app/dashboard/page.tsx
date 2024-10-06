import DashboardApp from "@/components/dashboard-app";
import { ExpedienteJson, Person } from "@/interfaces/interfaces";

const fetchUsers = async (): Promise<Person[]|undefined> => {
    try {
        const response = await fetch('http://localhost:8000/api/trabajador/', {
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
    const response = await fetch('http://localhost:8000/api/expediente')
    if (!response.ok){
      throw new Error('Error al cargar los expedientes')
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
    
    return ( 
        <DashboardApp jsonTrabajadores={trabajadores? trabajadores : []} jsonExpedientes={expedientes ? expedientes : []}/>
     );
}
 
export default Dashboard;