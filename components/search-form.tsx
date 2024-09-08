"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
    filter: (text:string) => void
    error: boolean
}

const SearchForm:React.FC<Props> = ({filter, error}) => {
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
                {error && <label className="text-red-500 font-thin absolute -top-8">
                {('No se ha encontrado a nadie').split(" ").map((word, key) => (
                    <div className="inline-block mr-1">
                        {
                            (word).split("").map((char,index) => (
                                <motion.span
                                initial={{opacity:0, filter:'blur(15px)'}}
                                animate={{opacity:1, filter:'blur(0px)'}}
                                transition={{delay:((((index/20+key)*0.9)/2)/2)}}
                                >
                                    {char}
                                </motion.span>
                            ))
                        }
                    </div>
                ))}
                </label>}
                <input className="border-2 w-full  border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none" type="text" placeholder="Filtra por nombre" onChange={(e) => setFiltertext(e.target.value)} />
                <span className="absolute right-0 top-0 mt-3 mr-4">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </span>
            </div>
        </form>
     );
}
 
export default SearchForm;