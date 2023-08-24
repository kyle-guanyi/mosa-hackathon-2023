"use client";
import React from "react";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ProfilePage from "components/profilepage/ProfilePage";

const UserCard = ( {user} ) => { 

    const { data: session } = useSession();

    const router = useRouter();
    // fetch profilepic for user
    const [profilePicture, setProfilePicture] = useState("");
    const fetchProfilePicture = async () => {
        try {
          const keysArray = [user.userUpdatedProfileImage]; // Convert to an array
          const response = await fetch(`/api/media?keys=${encodeURIComponent(JSON.stringify(keysArray))}`);
          const data = await response.json();
          console.log(data)
    
          if (response.ok) {
            setProfilePicture(data.urls[0]); // Assuming the data structure is { success: true, urls: [profilePictureUrl] }
          } else {
            console.error("Error fetching profile picture");
          }
        } catch (error) {
          console.error("Error fetching profile picture:", error);
        }
      };
    
      useEffect(() => {
        if (user?.userUpdatedProfileImage) {
          fetchProfilePicture();
        }
      }, [user?.userUpdatedProfileImage]);

    // routes to profile page
    const handleProfileClick = () => {
        if (user?._id === session?.user.id) return router.push("/profile");

        router.push(`/profile/${user?._id}`)
    };

    return (
        <div className = "user_card cursor-pointer" onClick={handleProfileClick} >
            <div className="flex justify-between items-start gap-5">
                <div className="flex-1 flex justify-start items-center gap-3">
                    <Image 
                        src= {profilePicture || user?.googleProfileImage}
                        alt="user_image"
                        width={40}
                        height={40}
                        className="rounded-full object-contain"
                    />

                    <div className="flex flex-col">
                        <h3>{user?.firstName} {user?.lastName}</h3>
                    </div>
                </div>

            </div>
        </div>
    )





}
export default UserCard