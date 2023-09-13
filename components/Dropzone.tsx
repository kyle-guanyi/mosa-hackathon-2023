// @ts-nocheck
"use client";
import axios from "axios";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BsUpload, BsXCircleFill } from "react-icons/bs";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

const baseStyle = {
  width: "100%",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#a3a2a2",
  outline: "none",
  transition: "border .24s ease-in-out",
  cursor: "pointer",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

/**
 * This component is used to render a file upload.
 *
 * @param handleKeysArray - A function to handle an array of keys
 * @param maxUploads - A number
 * @param initialFiles - An array of initial files
 * @param updateInitialFiles - A function to update the initial files
 * @constructor - Renders a file upload
 * @returns A file upload
 */
export default function FileUpload({
  handleKeysArray,
  maxUploads,
  initialFiles,
  updateInitialFiles,
}) {
  const [files, setFiles] = useState<any>([]);
  const [rejected, setRejected] = useState<any>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles?.length) {
        const filesToAdd = acceptedFiles.slice(0, maxUploads - files.length); // Limit based on remaining slots
        const remainingSlots = maxUploads - files.length;

        if (acceptedFiles.length > remainingSlots) {
          toast({
            title: "Too many files!",
            description: `You can only upload up to ${remainingSlots} more file(s).`,
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          return;
        }

        setFiles((previousFiles) => [
          ...previousFiles,
          ...filesToAdd.map((file) => {
            let count = 1;
            let originalName = file.name;
            let baseName = originalName.replace(/\.[^/.]+$/, ""); // Remove file extension
            let extension = originalName.split(".").pop(); // Get file extension
            while (
              [...previousFiles].some(
                (existingFile) => existingFile.name === file.name
              )
            ) {
              const newName = `${baseName} (${count}).${extension}`;
              count++;
              file = new File([file], newName, { type: file.type });
            }
            return Object.assign(file, { preview: URL.createObjectURL(file) });
          }),
          // ...acceptedFiles.map((file) => ({
          //   name: file.name,
          //   preview: URL.createObjectURL(file),
          // })),
        ]);
      }

      if (rejectedFiles?.length) {
        setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
      }
    },
    [maxUploads, files]
  );

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    isDragActive,
  } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
    },
    onDrop,
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  /**
   * This function is used to remove a file.
   *
   * @param name - A string
   * @returns A file
   */
  const removeFile = (name) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  /**
   * This function is used to remove all files.
   */
  const removeAll = () => {
    setFiles([]);
    setRejected([]);
  };

  /**
   * This function is used to remove a rejected file.
   *
   * @param name - A string
   * @returns A file
   */
  const removeRejected = (name) => {
    setRejected((files) => files.filter(({ file }) => file.name !== name));
  };

  const toast = useToast();

  /**
   * This function is used to handle a submit.
   *
   * @param e - An event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there are any files
    if (files?.length === 0) {
      toast({
        title: "Please upload at least one valid image before submitting",
        description: "Supported image types are .png, .jpg, and .jpeg",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
      onReplaceClose();
      return;
    }

    // Check if there are any rejected files
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
      files.forEach((file) => {
        formData.append("file", file);
        formData.append("type", file.type);
      });

      // Send files to backend
      let { data } = await axios.post("/api/media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
      });


      // Handle keys array
      handleKeysArray(data.keysArray);

      // Update initial files
      if (updateInitialFiles) {
        updateInitialFiles(data.keysArray);
      }

      // Reset files
      setFiles([]);
      onReplaceClose();
    } catch (err) {
      // console.log(err);
    } finally {
      toast({
        title: "File(s) successfully uploaded",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setIsSubmitting(false);
    }
  };

  // Styling
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const [initialPictures, setInitialPictures] = useState([]);

  /**
   * This function is used to fetch initial pictures.
   */
  const fetchInitialPictures = async () => {
    try {
      const response = await fetch(
        `/api/media?keys=${encodeURIComponent(JSON.stringify(initialFiles))}`
      );
      const data = await response.json();

      if (response.ok) {
        setInitialPictures(data.urls);
      } else {
        console.error("Error fetching initial pictures");
      }
    } catch (error) {
      console.error("Error fetching initial pictures: ", error);
    }
  };

  useEffect(() => {
    if (initialFiles?.length > 0) {
      fetchInitialPictures();
    }
  }, [initialFiles]);

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isReplaceOpen,
    onOpen: onReplaceOpen,
    onClose: onReplaceClose,
  } = useDisclosure();
  const cancelRef = React.useRef();

  return (
    <form onSubmit={handleSubmit}>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <BsUpload className="w-5 h-5 fill-current" />
        {isDragActive ? (
          <p className="select-none">Drop files here</p>
        ) : (
          <p className="select-none">
            Drag & drop files here, or click to select files
          </p>
        )}

        <em className="select-none">
          (Only *.jpeg, *jpg, and *.png images will be accepted)
        </em>
      </div>

      {/* Preview */}
      <section className="mt-5">
        <div className="flex items-center justify-center">
          <div className="flex">
            <>
              <Button
                colorScheme="red"
                isActive={true}
                className="hover:opacity-80"
                onClick={onDeleteOpen}
                ml={3}
              >
                Delete all accepted image(s)
              </Button>
              <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
                isOpen={isDeleteOpen}
                isCentered
              >
                <AlertDialogOverlay />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    Delete all accepted images?
                  </AlertDialogHeader>
                  <AlertDialogCloseButton className="hover:opacity-50" />
                  <AlertDialogBody>
                    Are you sure you want to delete all accepted image(s)?{" "}
                    <br /> <br />
                    <em>This cannot be undone.</em>
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onDeleteClose}>
                      No
                    </Button>
                    <Button
                      colorScheme="red"
                      variant={"solid"}
                      isActive={true}
                      className="hover:opacity-80"
                      ml={3}
                      onClick={() => {
                        if (files.length == 0) {
                          toast({
                            title: "No file(s) had been uploaded for deletion",
                            status: "error",
                            duration: 4000,
                            isClosable: true,
                          });
                          onDeleteClose();
                        } else {
                          removeAll();
                          toast({
                            title: "All accepted images have been deleted",
                            status: "success",
                            duration: 4000,
                            isClosable: true,
                          });
                          onDeleteClose();
                        }
                      }}
                    >
                      Yes
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
            {initialFiles &&
            initialFiles.length > 0 &&
            initialFiles[0] !== null ? (
              <>
                <Button
                  colorScheme="facebook"
                  variant={"solid"}
                  isActive={true}
                  className="hover:opacity-80"
                  ml={3}
                  onClick={() => {
                    // console.log(initialFiles);
                    onReplaceOpen();
                  }}
                >
                  {maxUploads !== 1
                    ? "Overwrite your selected image(s)"
                    : "Overwrite your selected image"}
                </Button>
                <AlertDialog
                  motionPreset="slideInBottom"
                  leastDestructiveRef={cancelRef}
                  onClose={onReplaceClose}
                  isOpen={isReplaceOpen}
                  isCentered
                >
                  <AlertDialogOverlay />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      Overwrite currently uploaded image(s)
                    </AlertDialogHeader>
                    <AlertDialogCloseButton className="hover:opacity-50" />
                    <AlertDialogBody>
                      {maxUploads !== 1
                        ? "Are you sure you want to overwrite your current uploaded image(s) with your new image(s)?"
                        : "Are you sure you want to overwrite your current uploaded image with your new image?"}
                      <br /> <br />
                      <em>This cannot be undone.</em>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onReplaceClose}>
                        No
                      </Button>
                      {isSubmitting ? (
                        <Button
                          colorScheme="facebook"
                          isLoading
                          loadingText="Overwriting image(s)..."
                          isActive={true}
                        >
                          Submit
                        </Button>
                      ) : (
                        <Button
                          colorScheme="facebook"
                          isActive={true}
                          className="hover:opacity-80 ml-3"
                          onClick={handleSubmit}
                        >
                          Submit
                        </Button>
                      )}
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : isSubmitting ? (
              <Button
                colorScheme="facebook"
                isLoading
                loadingText={
                  maxUploads !== 1
                    ? "Uploading your selected image(s)"
                    : "Uploading your selected image"
                }
                className="ml-3"
                isActive={true}
              >
                {maxUploads !== 1
                  ? "Upload your selected image(s)"
                  : "Upload your selected image"}
              </Button>
            ) : (
              <Button
                colorScheme="facebook"
                isActive={true}
                className="hover:opacity-80 ml-3"
                type="submit"
              >
                {maxUploads !== 1
                  ? "Upload your selected image(s)"
                  : "Upload your selected image"}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {/* Initial Files */}
          {initialPictures?.length > 0 && (
            <div>
              <h3 className="title text-lg font-semibold text-neutral-600 mb-3">
                Currently Uploaded Image(s)
              </h3>
              <ul className="grid grid-cols-1 gap-4">
                {initialPictures?.map((file, index) => (
                  <li
                    key={index}
                    className="relative h-32 rounded-md shadow-lg"
                  >
                    <Image
                      className="h-full w-full object-contain rounded-md"
                      src={file}
                      alt={"Initial Image"}
                      width={100}
                      height={100}
                      onLoad={() => {
                        URL.revokeObjectURL(file);
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Accepted Files */}
          <div>
            <h3 className="title text-lg font-semibold text-neutral-600 mb-3">
              Accepted Image(s)
            </h3>
            <ul className="grid grid-cols-1 gap-8">
              {files.map((file) => (
                <li
                  key={file.name}
                  className="relative h-32 rounded-md shadow-lg"
                >
                  <Image
                    className="h-full w-full object-contain rounded-md"
                    src={file.preview}
                    alt={file.name}
                    width={100}
                    height={100}
                    onLoad={() => {
                      URL.revokeObjectURL(file.preview);
                    }}
                  />
                  <button
                    type="button"
                    // w-7 h-7 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors
                    className="absolute -top-3 -right-3"
                    onClick={() => removeFile(file.name)}
                  >
                    <BsXCircleFill className="w-7 h-7 rounded-full bg-white hover:fill-upenn-red transition-colors" />
                  </button>
                  <p className="mt-2 text-neutral-500 text-[14px] font-medium break-words">
                    {file.name}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Rejected Files */}
        <h3 className="title text-lg font-semibold text-neutral-600 mt-12 border-b pb-3">
          Rejected Files
        </h3>
        <ul className="mt-3 flex flex-col">
          {rejected.map(({ file, errors }) => (
            <li key={file.name} className="flex items-start justify-between">
              <div>
                <p className="mt-2 text-neutral-500 text-sm font-medium">
                  {file.name}
                </p>
                <ul className="text-[12px] text-red-400">
                  {errors.map((error) => (
                    <li key={error.code}>{error.message}</li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                className="mt-1 py-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-white transition-colors"
                onClick={() => removeRejected(file.name)}
              >
                remove
              </button>
            </li>
          ))}
        </ul>
      </section>
    </form>
  );
}
