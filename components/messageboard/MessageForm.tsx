import Dropzone from "components/Dropzone";
import { useState, useEffect } from "react";
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
  ModalFooter
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
  message,
  setMessage,
  handleMessageSubmit,
  handleKeysArray,
  existingFiles,
  type,
}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()

  /**
   * This function is used to submit a message.
   *
   * @param e - An event
   * @returns A message
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.content === "") {
      toast({
        title: "The post cannot be empty!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setInitialFiles(null);
      handleMessageSubmit(e);
    }
  };

  const [initialFiles, setInitialFiles] = useState(message.uploadedMessagePictures);

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

  return (
    <Card align="center">
      <CardBody>
        <Textarea
          id="bio"
          value={message.content}
          onChange={(e) => setMessage({ ...message, content: e.target.value })}
          placeholder="Write your post here"
          required
        />
      </CardBody>
      <CardFooter>
      <>
      <Button onClick={onOpen}>Attach Images</Button>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload your images</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Dropzone handleKeysArray={handleKeysArray} maxUploads={5} initialFiles={initialFiles}
          updateInitialFiles={updateInitialFiles} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
        <Button
          colorScheme="facebook"
          isActive={true}
          className="hover:opacity-80"
          onClick={handleSubmit}
        >
          {type === "Submit" ? ("Submit Post") : ("Confirm Edits") }
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreateMessage;
