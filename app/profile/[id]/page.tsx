"use client";

import ProfilePage from "components/profilepage/ProfilePage";
import { useState, useEffect } from "react";

const Profile = ({ params }) => {
    const [userDetails, setUserDetails] = useState([]);

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