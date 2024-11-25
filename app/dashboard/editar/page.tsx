export const dynamic = "force-dynamic"
import ReorderGroup from "@/components/reorder-group";
import { fetchSelector } from "@/lib/data";

const Puesto = async() => {
    const puestoTrabajo = await fetchSelector("puesto_trabajo")
    const lugarAccidente = await fetchSelector("lugar_accidente")
    const formasProducirseAccidenete = await fetchSelector("forma_producirse_accidente")
    const causasAccidente = await fetchSelector("causas_accidente")
    const creador = await fetchSelector("creador")
    const parteCuerpo = await fetchSelector("parte_cuerpo")
    const agente = await fetchSelector("agente")
    const formaProducirse = await fetchSelector("forma_producirse")
    return ( 
        <div>
            <ReorderGroup 
            lugarAccidente={lugarAccidente? lugarAccidente : []} 
            puestoTrabajo={puestoTrabajo ? puestoTrabajo : []} 
            // formasProducirseAccidenete={formasProducirseAccidenete? formasProducirseAccidenete : []}
            // causasAccidente={causasAccidente? causasAccidente : []}
            creador={creador? creador : []}
            parteCuerpo={parteCuerpo? parteCuerpo : []}
            agente={agente? agente : []}
            formaProducirse={formaProducirse ? formaProducirse : []}
            
            />
        </div>
     );
}
 
export default Puesto;