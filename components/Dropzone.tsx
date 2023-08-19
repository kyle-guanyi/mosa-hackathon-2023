"use client";
import axios from "axios";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState, FormEvent } from "react";
import { useDropzone } from "react-dropzone";
import { BsUpload, BsXCircleFill } from "react-icons/bs";

const baseStyle = {
  width: "100vh",
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

export default function FileUpload() {
  const [files, setFiles] = useState<any>([]);
  const [rejected, setRejected] = useState<any>([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) => {
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
      ]);
    }

    if (rejectedFiles?.length) {
      setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
    }
  }, []);

  const {
    acceptedFiles,
    fileRejections,
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

  const removeFile = (name) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  const removeAll = () => {
    setFiles([]);
    setRejected([]);
  };

  const removeRejected = (name) => {
    setRejected((files) => files.filter(({ file }) => file.name !== name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files?.length) {
      return;
    }

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file);
        formData.append("type", file.type);
      });

      let { data } = await axios.post("/api/media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
      });

      console.log(data);

      setFiles([]);
    } catch (err) {
      console.log(err);
    }
  };

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

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
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="title text-3xl font-semibold">Preview Files</h2>
          <div className="flex gap-4">
            <button type="button" onClick={removeAll} className="red_btn">
              Remove all files
            </button>
            <button type="submit" className="blue_btn">
              Submit Images
            </button>
          </div>
        </div>

        {/* Accepted files */}
        <h3 className="title text-lg font-semibold text-neutral-600 mt-10 border-b pb-3">
          Accepted Files
        </h3>
        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10">
          {files.map((file) => (
            <li key={file.name} className="relative h-32 rounded-md shadow-lg">
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

        {/* Rejected Files */}
        <h3 className="title text-lg font-semibold text-neutral-600 mt-24 border-b pb-3">
          Rejected Files
        </h3>
        <ul className="mt-6 flex flex-col">
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
