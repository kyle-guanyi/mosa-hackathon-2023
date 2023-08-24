"use client"

import React from "react";
import Image from "next/image";

import { useEffect, useState } from "react"

const ProfilePage = ({ profileDetails, handleEdit }) => {

  const [profilePicture, setProfilePicture] = useState("");

  const fetchProfilePicture = async () => {
    try {
      const keysArray = [profileDetails.userUpdatedProfileImage];
      const response = await fetch(`/api/media?keys=${encodeURIComponent(JSON.stringify(keysArray))}`);
      const data = await response.json();
      console.log(data)

      if (response.ok) {
        setProfilePicture(data.urls[0]);
      } else {
        console.error("Error fetching profile picture");
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  useEffect(() => {
    if (profileDetails?.userUpdatedProfileImage) {
      fetchProfilePicture();
    }
  }, [profileDetails?.userUpdatedProfileImage]);

  return (
    <section className="w-full flex-col flex-1 text-center bg-slate-500">
      <div className="pt-4">
      {profileDetails?.userUpdatedProfileImage ? (
      <Image
        src={profilePicture}
        alt="user_image"
        width={120}
        height={120}
        className="mx-auto rounded-full object-contain"
      />
    ) : (
      profileDetails?.googleProfileImage && (
        <Image
          src={profileDetails.googleProfileImage}
          alt="user_image"
          width={120}
          height={120}
          className="mx-auto rounded-full object-contain"
        />
      )
    )}
      </div>

      <h1 className="head_text">
        {profileDetails?.firstName} {profileDetails?.lastName}
      </h1>
      <div className="pt-4">
        <h3>{profileDetails?.email}</h3>
      </div>
      <div className="pt-4">
        {handleEdit && (
          <button
            type="button"
            onClick={handleEdit}
            className="mx-auto blue_btn"
          >
            Edit Profile
          </button>
        )}
      </div>
    </section>
  );
};

export default ProfilePage;
