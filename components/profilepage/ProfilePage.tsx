import React from "react";
import Image from 'next/image';

const ProfilePage = ({
    profileDetails
}) => {
    console.log("This is the event info");
    console.log(profileDetails);

    return (
        <section className="w-full h-full flex-col flex-1 items-center justify-center bg-slate-500">
                <div className="pt-4">
                <Image 
                        src= {profileDetails?.image}
                        alt="user_image"
                        width={120}
                        height={120}
                        className="rounded-full object-contain"
                    />
                </div>
                
            <h1 className="head_text text-left"> {profileDetails.username}</h1>
            <div className="pt-4">
                <h3>{profileDetails.email}</h3>
            </div>
        </section>
    )
}

export default ProfilePage;