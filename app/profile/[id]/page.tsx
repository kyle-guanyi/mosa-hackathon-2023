// @ts-nocheck
"use client";

import ProfilePage from "components/profilepage/ProfilePage";
import { useState, useEffect } from "react";

/**
 * This is the page for a specific user. It fetches the user details from the database and displays them.
 *
 * @param params - The user id
 * @constructor - The user page
 * @returns - The user page
 */
const Profile = ({ params }) => {
    const [userDetails, setUserDetails] = useState([]);
    // Fetches the user details from the database
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch (`/api/user/${params?.id}`);
                const userData = await response.json();
                setUserDetails(userData);

            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        if (params?.id) {
            fetchUserDetails();
        }
    }, [params.id]);
    return (
        <ProfilePage
            profileDetails={userDetails}
        />
    );
};
export default Profile;