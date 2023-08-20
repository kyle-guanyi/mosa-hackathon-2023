"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ProfileForm from "components/ProfileForm";

const UpdateProfile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  console.log("This is the USER ID")
  console.log(userId)

  const [user, setUser] = useState({ firstName: "", lastName: "", closestMainCity: "", timeZone: "", gender: "", bio: "", classesTaken:[], fieldOfInterest: [], userUpdatedProfileImage: "" });
  const [submitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getUserDetails = async () => {
      const response = await fetch(`/api/user/${userId}`);
      const data = await response.json();
      console.log(data);

      setUser({
        firstName: data.firstName,
        lastName: data.lastName,
        closestMainCity: data.closestMainCity,
        timeZone: data.timeZone,
        gender: data.gender,
        bio: data.bio,
        classesTaken: data.classesTaken,
        fieldOfInterest: data.fieldOfInterest,
        userUpdatedProfileImage: data.userUpdatedProfileImage,
      });
    };

    if (userId) getUserDetails();
  }, [userId]);

  const updateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!userId) return alert("Missing User Id!");

    try {
      const response = await fetch(`/api/prompt/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          closestMainCity: user.closestMainCity,
          timeZone: user.timeZone,
          gender: user.gender,
          bio: user.bio,
          classesTaken: user.classesTaken,
          fieldOfInterest: user.fieldOfInterest,
          userUpdatedProfileImage: user.userUpdatedProfileImage,
        }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <ProfileForm
          type='Edit'
          user={user}
          setUser={setUser}
          submitting={submitting}
          handleSubmit={updateUser}
      />
  );
};

export default UpdateProfile;