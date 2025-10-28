import React from "react";
import "/src/styles/Search.css"
import Button from '@mui/material/Button';
import { IoSearch } from "react-icons/io5";
const Search = () => { 
    return (
        <div className="searchBox">
            <input className="input1" type="text" placeholder="Search for product"></input>
            <Button className="searchButton" ><IoSearch className="searchIcon"/></Button>
        </div>
    )
}

export default Search