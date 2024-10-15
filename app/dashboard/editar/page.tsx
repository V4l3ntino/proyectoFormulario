export const dynamic = "force-dynamic"
import ReorderGroup from "@/components/reorder-group";
import { fetchSelector } from "@/lib/data";

const Puesto = async() => {
    const puestoTrabajo = await fetchSelector("puesto_trabajo")
    const lugarAccidente = await fetchSelector("lugar_accidente")
    return ( 
        <div>
            <ReorderGroup lugarAccidente={lugarAccidente? lugarAccidente : []} puestoTrabajo={puestoTrabajo ? puestoTrabajo : []}/>
        </div>
     );
}
 
export default Puesto;