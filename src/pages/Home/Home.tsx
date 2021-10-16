import { Button, Container, Flex, Input, SimpleGrid, Text, Image, VStack, Box } from "@chakra-ui/react"
import styled from "styled-components";
import KaijuImg from "../../assets/kaijusanta.png";
import Web3Account from "../../components/Web3Account";
import useEthereum from "../../hooks/useEthereum";

const Home = () => {
    const { web3Modal, loadWeb3Modal, logoutOfWeb3Modal, injectedProvider, accountAddress } = useEthereum()
    
    return (
        <>
            <VStack mt={8} spacing={1}>
                <Image src={KaijuImg} w="30vh"/>
                <Text fontSize="xl" py={1}>Breed with Kaiju #880?</Text>
                <Text fontSize="md" pb={6}>Cost: 750 $RWASTE + 0.1 ETH</Text>
                
                {web3Modal && !web3Modal.cachedProvider &&
                    <Button minW="200px" colorScheme="green" onClick={loadWeb3Modal}>Connect</Button>}

                {injectedProvider &&
                    <Button minW="200px" colorScheme="green" onClick={() => {}}>Approve Kaiju</Button>}
            </VStack>
        </>
    );
};

export default Home;