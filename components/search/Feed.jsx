'use client';

import {useState, useEffect} from 'react'

import Card from '../eventfeed/Card';

const Feed = () => {
    const [seaerchText, setSearchText] = useState('');

    const handleSearchChange = (e) => {

    }
    return (
        <section className ="feed">
            <form className = "releative w-full flex-center">
                <input
                    type ="text"
                    placeholder="Search for events"
                    value={searchText}
                    onChange={handleSearchChange}
                    required
                    className="search_input peer"
                />

            </form>
        </section>
    )
}

export default Feed;