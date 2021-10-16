import { Button, Container, Flex, Input, SimpleGrid, Text, Image, VStack } from "@chakra-ui/react"
import styled from "styled-components";
import KaijuImg from "../../assets/kaijusanta.png";

const Home = () => {
    
    return (
        <>
            <VStack mt={8} spacing={1}>
                <Image src={KaijuImg} w="30vh"/>
                <Text fontSize="xl" py={1}>Breed with Kaiju #880?</Text>
                <Text fontSize="md" pb={7}>Cost: 750 $RWASTE + 0.1 ETH</Text>
                
                <Button colorScheme="green" onClick={() => {}}>Connect</Button>
            </VStack>
        </>
    );
};

export default Home;