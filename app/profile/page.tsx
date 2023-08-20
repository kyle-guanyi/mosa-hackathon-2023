"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProfilePage from "components/profilepage/ProfilePage";

const MyProfile = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [myUserProfile, setMyUserProfile] = useState();


    console.log("SUCCESS ENTERED PROFILE")
    console.log(session?.user.id)


    useEffect(() => {
        const fetchMyDetails = async () => {
            const response = await fetch(`/api/user/${session?.user.id}`);
            const data = await response.json();
            console.log("this is my data")
            console.log(data)
            setMyUserProfile(data);
        };

        if (session?.user.id) fetchMyDetails();
    }, [session?.user.id]);

    const handleEdit = (myUserProfile) => {
        router.push(`/update-profile?id=${session?.user.id}`);
    };

    return (
        <ProfilePage
            profileDetails={myUserProfile}
            handleEdit={handleEdit}
        />
    );
};

export default MyProfile;