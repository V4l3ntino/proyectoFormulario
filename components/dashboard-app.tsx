"use client"
import { useState } from "react"
import { Person } from "@/interfaces/interfaces"
import SearchForm from "./search-form"
import Wrapper from "./wrapper"
import { json } from "@/data"
const DashboardApp = () => {
    const [data, setData] = useState(json)
    const [datafilter, setDatafilter] = useState<Person[]>([])
    const [error, setError] = useState(false)
    const filterText = (text:string) => {
        const filtered = data.filter(item => {
            return item.name.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) != -1
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