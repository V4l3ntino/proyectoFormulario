import DashboardApp from "@/components/dashboard-app";
import { Person } from "@/interfaces/interfaces";

const fetchUsers = async (): Promise<Person[]> => {
    const response = await fetch('http://localhost:8000/api/trabajador/', {
      next: { revalidate: 60 } // Opcional: puedes configurar la revalidación para que los datos se actualicen periódicamente
    });
  
    if (!response.ok) {
      throw new Error('Error al obtener el trabajador');
    }
  
    return response.json();
  };

const Dashboard = async() => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const json = await fetchUsers()
    return ( 
        <DashboardApp json={json}/>
     );
}
 
export default Dashboard;