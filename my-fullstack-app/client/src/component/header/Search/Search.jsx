import React, { useState } from "react";
import "/src/styles/Search.css"
import Button from '@mui/material/Button';
import { IoSearch } from "react-icons/io5";

const Search = () => {
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchValue.trim()) {
            // TODO: Implement search functionality
            console.log("Searching for:", searchValue);
        }
    };

    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
    };

    return (
        <form className="searchBox" onSubmit={handleSearch} role="search">
            <input 
                className="input1" 
                type="text" 
                placeholder="Search for products..."
                value={searchValue}
                onChange={handleInputChange}
                aria-label="Search for products"
                autoComplete="off"
            />
            <Button 
                className="searchButton"
                type="submit"
                aria-label="Search"
            >
                <IoSearch className="searchIcon" aria-hidden="true" />
            </Button>
        </form>
    )
}

export default Search