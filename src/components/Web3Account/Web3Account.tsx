import { Button, Box, Flex, Text, useDisclosure } from "@chakra-ui/react"
import Web3AccountModal from "../Web3AccountModal";
import useEthereum from "../../hooks/useEthereum";
import styled from "styled-components";

const Web3Account = () => {
    const { web3Modal, loadWeb3Modal, logoutOfWeb3Modal, injectedProvider, accountAddress } = useEthereum()
    const { isOpen, onClose, onOpen } = useDisclosure()

    return (
        <Flex align="center">
            {injectedProvider &&
                (<Box display="flex" p="2" borderRadius="8">
                    <Box px="2" py="1" border="1px" borderColor="black.200" cursor="pointer"
                        borderRadius={15} 
                        onClick={onOpen}>
                        <Flex>
                            <Text pl={1}>
                                {accountAddress}
                            </Text>
                        </Flex>
                    </Box>
                </Box>)
            }
            <Box ml="2">
                {web3Modal && !web3Modal.cachedProvider &&
                    <Button onClick={loadWeb3Modal} colorScheme="green">Connect 🦊</Button>}
            </Box>
            <Web3AccountModal 
                isOpen={isOpen} 
                onClose={onClose}
                logoutOfWeb3Modal={logoutOfWeb3Modal}
                address={accountAddress} />
        </Flex>
    );
};

const StyledBlockies = styled.div`
    border-radius: 15px;
    overflow: hidden;
`;

export default Web3Account;