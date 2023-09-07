// @ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
import { useDisclosure, Modal, Grid, GridItem, Image, ModalOverlay, ModalContent, ModalCloseButton } from "@chakra-ui/react";

/**
 * This component is used to render a photo timeline.
 *
 * @param event - An event JSON
 * @constructor - Renders a photo timeline
 * @returns A photo timeline
 */
const PhotoTimeline = ({ event }) => {
  const [uploadedEventPictures, setUploadedEventPictures] = useState([]);

  const [pictureKeys, setPictureKeys] = useState([]);
  /**
   * This function is used to fetch uploaded event pictures.
   */
  
  useEffect(() => {
    const fetchUploadedEventPictures = async () => {
      try {
        const keysArray = pictureKeys;
        const response = await fetch(
          `/api/media?keys=${encodeURIComponent(JSON.stringify(keysArray))}`
        );
        const data = await response.json();
  
        if (response.ok) {
          setUploadedEventPictures(data.urls);
        } else {
          console.error("Error fetching event pictures");
        }
      } catch (error) {
        console.error("Error fetching event pictures: ", error);
      }
    };

    if (event.uploadedPictures?.length > 0) {
      fetchUploadedEventPictures();
    }

    if (event.uploadedPictures?.length == 0) {
      setUploadedEventPictures([]);
    }
  }, [event.uploadedPictures, event, pictureKeys]);


  useEffect(() => {
    const fetchUploadedEventPictureKeys = async () => {
      const keysArray = event.uploadedPictures;
      setPictureKeys(keysArray);
    }
    fetchUploadedEventPictureKeys();
  }, [event]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
    {uploadedEventPictures?.map((file, index) => (
      <GridItem pl="2" key={index} className="cursor-pointer">
        <Image
          src={file}
          alt={"Uploaded Message Image"}
          boxSize="150px"
          objectFit="cover"
          onLoad={() => {
            URL.revokeObjectURL(file);
          }}
          onClick={() => {
            setSelectedImageIndex(index);
            onOpen();
          }}
        />
        <Modal
          isOpen={isOpen && selectedImageIndex !== null}
          onClose={() => {
            setSelectedImageIndex(null);
            onClose();
          }}
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <Image
              src={uploadedEventPictures[selectedImageIndex]}
              alt={"Uploaded Message Image"}
              objectFit="cover"
              onLoad={() => {
                URL.revokeObjectURL(file);
              }}
            />
          </ModalContent>
        </Modal>
      </GridItem>
    ))}
  </Grid>
  );
};
export default PhotoTimeline;
