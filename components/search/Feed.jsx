'use client';


/**
 * Feed component
 *
 * @returns {JSX.Element} - Feed component
 * @constructor - Feed
 */
const Feed = () => {
    const handleSearchChange = () => {

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