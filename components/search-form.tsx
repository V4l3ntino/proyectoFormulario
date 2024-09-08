"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

type Props = {
    filter: (text:string) => void
}

const SearchForm:React.FC<Props> = ({filter}) => {
    const [filtertext, setFiltertext] = useState("")
    useEffect(() => {
        filter(filtertext)
    },[filtertext])
    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }
    return ( 
        <form className="flex flex-row w-[100%]" onSubmit={handleSubmit}>
            <div className="relative w-full md:w-80">
                <input className="border-2 w-full  border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none" type="text" placeholder="Filtra por nombre" onChange={(e) => setFiltertext(e.target.value)} />
                <span className="absolute right-0 top-0 mt-3 mr-4">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </span>
            </div>
        </form>
     );
}
 
export default SearchForm;