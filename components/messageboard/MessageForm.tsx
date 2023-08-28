import Dropzone from "components/Dropzone";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardBody,
  Button,
  useToast,
  Textarea,
  CardFooter,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Avatar,
} from "@chakra-ui/react";

/**
 * This component is used to create a message.
 *
 * @param message - A message JSON
 * @param setMessage - A function to set a message
 * @param handleMessageSubmit - A function to submit a message
 * @param handleKeysArray - A function to handle an array of keys
 * @param existingFiles - An array of existing files
 * @param type - A string
 * @constructor - Renders a message
 * @returns A message
 */
const CreateMessage = ({
  submitting,
  message,
  setMessage,
  handleMessageSubmit,
  handleKeysArray,
  existingFiles,
  setExistingFiles,
  type,
}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  /**
   * This function is used to submit a message.
   *
   * @param e - An event
   * @returns A message
   */
  const handleSubmit = () => {
    if (message.content === "") {
      toast({
        title: "The post cannot be empty!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setInitialFiles(null);
      handleMessageSubmit();
    }
  };

  const [initialFiles, setInitialFiles] = useState(
    message.uploadedMessagePictures
  );

  useEffect(() => {
    if (existingFiles) {
      setInitialFiles(existingFiles);
    }
  }, [existingFiles]);

  /**
   * This function is used to update the initial files.
   *
   * @param newFiles - An array of files
   * @returns An array of files
   */
  const updateInitialFiles = (newFiles) => {
    setInitialFiles(newFiles);
  };

  const { data: session } = useSession();

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    googleProfileImage: "",
    userUpdatedProfileImage: "",
  });

  const fetchUserInfo = async () => {
    const response = await fetch(`/api/user/${session?.user.id}`);
    const data = await response.json();
    setUserInfo({
      firstName: data.firstName,
      lastName: data.lastName,
      googleProfileImage: data.googleProfileImage,
      userUpdatedProfileImage: data.userUpdatedProfileImage,
    });

    // Fetch the user's updated profile image
    if (data.userUpdatedProfileImage) {
      const userUpdatedProfileImageResponse = await fetch(
        `/api/media?keys=${encodeURIComponent(
          JSON.stringify([data.userUpdatedProfileImage])
        )}`
      );
      const userUpdatedProfileImageData =
        await userUpdatedProfileImageResponse.json();

      // If the response is ok, set the user's updated profile image
      if (userUpdatedProfileImageResponse.ok) {
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          userUpdatedProfileImage: userUpdatedProfileImageData.urls[0],
        }));
      }
    }
  };

  useEffect(() => {
    if (session?.user.id) {
      fetchUserInfo();
    }
  }, [session?.user.id]);

  return (
    <Card align="center" variant="outline">
      <CardBody style={{ display: "flex", alignItems: "start", width: "100%" }}>
        <Avatar
          size="md"
          src={userInfo.userUpdatedProfileImage || userInfo.googleProfileImage}
          mr={3}
        />

        <Textarea
          id="bio"
          value={message.content}
          onChange={(e) => setMessage({ ...message, content: e.target.value })}
          placeholder="Write your post here"
          required
          style={{ width: "100%" }}
        />
      </CardBody>
      <CardFooter
        style={{
          display: "flex",
          justifyContent: "right",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <>
            <Button onClick={onOpen} mr="4">
              Attach Images
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="2xl">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Upload your images</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Dropzone
                    handleKeysArray={handleKeysArray}
                    maxUploads={5}
                    initialFiles={initialFiles}
                    updateInitialFiles={updateInitialFiles}
                  />
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="red"
                    isActive={true}
                    className="hover:opacity-80"
                    mr={3}
                    onClick={() => {
                      if (setExistingFiles) {
                        setExistingFiles(initialFiles);
                      }
                      onClose();
                    }}
                  >
                    Done Attaching Images
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
          {submitting ? (
            <Button
              colorScheme="facebook"
              isLoading
              loadingText="Submitting..."
              isActive={true}
            >
              Submit
            </Button>
          ) : (
            <Button
              colorScheme="facebook"
              isActive={true}
              className="hover:opacity-80"
              onClick={handleSubmit}
            >
              {type === "Submit" ? "Submit Post" : "Confirm Edits"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CreateMessage;
