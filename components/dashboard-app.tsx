"use client"
import { useState } from "react"
import { Person } from "@/interfaces/persona"
import SearchForm from "./search-form"
import Wrapper from "./wrapper"
const DashboardApp = () => {
    const json:Person[] = [
        {
            name: 'Manolo',
            description: 'Soy polifacetico'
        },
        {
            name: 'Peralta',
            description: 'Soy polifacetico'
        },
        {
            name: 'Pedro',
            description: 'Soy polifacetico'
        },
        {
            name: 'Joselito',
            description: 'Soy polifacetico'
        },
        {
            name: 'Manuel',
            description: 'Soy polifacetico'
        },
        {
            name: 'Pancho',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
        {
            name: 'Paco',
            description: 'Soy polifacetico'
        },
    ] 
    const [data, setData] = useState(json)
    const [datafilter, setDatafilter] = useState<Person[]>([])
    const filterText = (text:string) => {
        const filtered = data.filter(item => {
            return item.name.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) != -1
        })
        setDatafilter(filtered)
    }

    return ( 
        <main>
            <SearchForm filter={filterText}/>
            <br />
            <hr />
            <br />
            <Wrapper personas={datafilter.length > 0 ? datafilter : data}/>
        </main>
     );
}
 
export default DashboardApp;