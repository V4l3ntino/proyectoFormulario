import ReorderGroup from "@/components/reorder-group";
import { fetchPuestoTrabajo } from "@/lib/data";

const Puesto = async() => {
    const puestoTrabajo = await fetchPuestoTrabajo()
    return ( 
        <div>
            <ReorderGroup opciones={puestoTrabajo? puestoTrabajo : []}/>
        </div>
     );
}
 
export default Puesto;