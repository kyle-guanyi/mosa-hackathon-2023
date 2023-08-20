"use client";
import React from "react";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

const UserCard = ( {user} ) => { 
    console.log("This is the user for event")
    console.log(user)
    const router = useRouter();
    const handleUserClick = () => {
        router.push(`/user/${user._id}`)
    };

    return (
        <div className = "user_card cursor-pointer" onClick={handleUserClick} >
            <div className="flex justify-between items-start gap-5">
                <div className="flex-1 flex justify-start items-center gap-3">
                    <Image 
                        src= {user?.googleProfileImage}
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