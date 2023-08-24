"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const PhotoTimeline = ({ event }) => {
  const [uploadedEventPictures, setUploadedEventPictures] = useState([]);

  const fetchUploadedEventPictures = async () => {
    try {
      console.log("Entered fetch pictures")
      const keysArray = event.uploadedPictures;
      const response = await fetch(
        `/api/media?keys=${encodeURIComponent(JSON.stringify(keysArray))}`
      );
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setUploadedEventPictures(data.urls);
      } else {
        console.error("Error fetching event pictures");
      }
    } catch (error) {
      console.error("Error fetching event pictures: ", error);
    }
  };

  useEffect(() => {
    if (event.uploadedPictures?.length > 0) {
      fetchUploadedEventPictures();
    }
  }, [event]);

  return (
    <ul className="mt-6 grid grid-cols-2 sm:grid-cols-1 gap-10">
      {uploadedEventPictures.map((file, index) => (
        <li key={index} className="relative h-32 rounded-md shadow-lg">
          <Image
            className="h-full w-full object-contain rounded-md"
            src={file}
            alt={"Uploaded Message Image"}
            width={100}
            height={100}
            onLoad={() => {
              URL.revokeObjectURL(file);
            }}
          />
        </li>
      ))}
    </ul>
  );
};
export default PhotoTimeline;
