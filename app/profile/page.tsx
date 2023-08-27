"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfilePage from "components/profilepage/ProfilePage";

/**
 * This function fetches the user details from the database and displays them.
 *
 * @constructor - The user page
 * @returns - The user page
 */
const MyProfile = () => {
  useRouter();
  const { data: session } = useSession();
  const [myUserProfile, setMyUserProfile] = useState();

  const fetchMyDetails = async () => {
    const response = await fetch(`/api/user/${session?.user.id}`);
    const data = await response.json();
    setMyUserProfile(data);
  };

  useEffect(() => {
    if (session?.user.id) fetchMyDetails();
  }, [session?.user.id]);

  const handleEdit = () => {
    fetchMyDetails();
  };

  return <ProfilePage profileDetails={myUserProfile} handleEdit={handleEdit} />;
};

export default MyProfile;
