"use client"

import Card from "./card";


interface Person {
    name: string;
    description: string;
}

type Props = {
    personas: Person[]
}
const Wrapper:React.FC<Props> = ({personas}) => {
    return ( 
        <div className="flex flex-wrap gap-3 w-full">
            {
                personas.map((item, key) => (
                    <Card key={key} name={item.name} description={item.description} index={key}/>
                ))
            }
        </div>
     );
}
 
export default Wrapper;