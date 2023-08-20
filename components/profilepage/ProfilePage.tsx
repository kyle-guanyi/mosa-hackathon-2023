import React from "react";
import Image from "next/image";

const ProfilePage = ({ profileDetails, handleEdit }) => {
  return (
    <section className="w-full h-full flex-col flex-1 items-center justify-center bg-slate-500">
      <div className="pt-4">
        <Image
          src={profileDetails?.googleProfileImage}
          alt="user_image"
          width={120}
          height={120}
          className="rounded-full object-contain"
        />
      </div>

      <h1 className="head_text text-left">
        {" "}
        {profileDetails?.firstName} {profileDetails?.lastName}
      </h1>
      <div className="pt-4">
        <h3>{profileDetails?.email}</h3>
      </div>
      {handleEdit && (
        <button type="button" onClick={handleEdit} className="blue_btn">
          Edit Profile
        </button>
      )}
    </section>
  );
};

export default ProfilePage;
