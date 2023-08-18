"use client";
import axios from "axios";
import React, {useMemo} from 'react';
import { useEffect, useState, FormEvent } from "react";
import { useDropzone } from "react-dropzone";

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

export default function FileUpload() {
  const [file, setFile] = useState<any>(null);
  const [uploadingStatus, setUploadingStatus] = useState<boolean>(false);

  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  };

  const uploadFile = async () => {
    setUploadingStatus(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", file.type);

      let { data } = await axios.post("/api/media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
      });

      console.log(data);

      setUploadingStatus(false);
      setFile(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (file) {
      uploadFile();
    }
  }, [file]);

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/jpg': [],
    },
    onDrop,
  });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        <em>(Only *.jpeg and *.png images will be accepted)</em>
      </div>
      <aside>
        <h4>Accepted files</h4>
        <ul>{acceptedFileItems}</ul>
        <h4>Rejected files</h4>
        <ul>{fileRejectionItems}</ul>
      </aside>
    </section>
  );
}
