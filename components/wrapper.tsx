"use client"

import { Person } from "@/interfaces/interfaces";
import Card from "./card";



type Props = {
    personas: Person[]
}
const Wrapper:React.FC<Props> = ({personas}) => {
    return ( 
        <div className="flex flex-wrap gap-3 w-full">
            {
                personas.map((item, key) => (
                    <Card key={key} operario={item}/>
                ))
            }
        </div>
     );
}
 
export default Wrapper;