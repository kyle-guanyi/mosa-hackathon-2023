import Dropzone from "components/Dropzone";
import { useState } from "react";
import {
  Collapse,
  Image,
  Text,
  Card,
  CardHeader,
  CardBody,
  Button,
  Divider,
  Heading,
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

const CreateMessage = ({
  message,
  setMessage,
  handleMessageSubmit,
  handleKeysArray,
}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.content === "") {
      toast({
        title: "The message cannot be empty!",
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
          placeholder="Write your message here"
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
          Submit Message
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreateMessage;
