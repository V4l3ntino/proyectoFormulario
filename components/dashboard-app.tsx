"use client"
import { useEffect, useState } from "react"
import { Person } from "@/interfaces/interfaces"
import SearchForm from "./search-form"
import Wrapper from "./wrapper"
import { json } from "@/data"


type Props = {
    json: Person[]
}

const DashboardApp:React.FC<Props> = ({json}) => {
    const [data, setData] = useState<Person[]>(json)
    const [datafilter, setDatafilter] = useState<Person[]>([])
    const [error, setError] = useState(false)
    const filterText = (text:string) => {
        const filtered = data.filter(item => {
            return item.id.toString().toLowerCase().trim().startsWith(text.toLowerCase().trim())||item.nombre.toLowerCase().trim().startsWith(text.toLowerCase().trim()) || item.apellido.toLowerCase().trim().startsWith(text.toLowerCase().trim())
        })
        setError(false)
        if (filtered.length == 0) setError(true)
        setDatafilter(filtered)
    }
    
    return ( 
        <main>
            <SearchForm filter={filterText} error={error}/>
            <br />
            <hr />
            <br />
            <Wrapper personas={datafilter.length > 0 ? datafilter : data}/>
        </main>
     );
}
 
export default DashboardApp;