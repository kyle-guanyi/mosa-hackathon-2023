"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProfilePage from "components/profilepage/ProfilePage";

const MyProfile = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [myUserProfile, setMyUserProfile] = useState();

    useEffect(() => {
        const fetchMyDetails = async () => {
            const response = await fetch(`/api/user/${session?.user.id}`);
            const data = await response.json();
            setMyUserProfile(data);
        };

        if (session?.user.id) fetchMyDetails();
    }, [session?.user.id]);

    const handleEdit = (myUserProfile) => {
        router.push(`/update-profile`);
    };

    return (
        <ProfilePage
            profileDetails={myUserProfile}
            handleEdit={handleEdit}
        />
    );
};

export default MyProfile;