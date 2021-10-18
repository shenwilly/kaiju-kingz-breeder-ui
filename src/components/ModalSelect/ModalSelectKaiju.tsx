import { 
  Modal, ModalContent, ModalOverlay, ModalHeader, ModalBody, 
  Button, Text, Center, SimpleGrid, Box, Image
} from "@chakra-ui/react"
import useKaiju from "../../hooks/useKaiju";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalSelectKaiju: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { ownedKaijus, numOfOwnedKaijus, selectKaiju } = useKaiju();

  return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text>
              Select Kaiju
            </Text>
          </ModalHeader>
          <ModalBody pb={8}>
            {numOfOwnedKaijus === null && <Box mx="auto">
              <Text>Fetching your KaijuKingz ...</Text>
            </Box>}
            {numOfOwnedKaijus === 0 && <Box mx="auto">
              <Text>You have no KaijuKingz</Text>
            </Box>}
            <SimpleGrid columns={3} spacing={4}>
              {ownedKaijus !== null && ownedKaijus.map((kaiju) => {
                return (
                  <Box p={1} cursor="pointer" border="2px" borderColor="gray.200">
                    <Image src={kaiju.uri} objectFit="contain" borderRadius={5}/>
                  </Box>
                );
              })}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
  );
};

export default ModalSelectKaiju;