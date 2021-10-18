import { Button, Text, Image, VStack, useDisclosure, Box, HStack, Flex } from "@chakra-ui/react"
import { parseUnits } from "@ethersproject/units";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useCallback, useMemo } from "react";
import KaijuImg from "../../assets/kaijusanta.png";
import ModalSelectKaiju from "../../components/ModalSelect";
import { FUSION_COST, KAIJUKINGZ_ADDRESS, KAIJUKINGZ_BREEDER_ADDRESS, RWASTE_ADDRESS } from "../../constants";
import { useAllowance } from "../../hooks/useAllowance";
import { useApproveKaiju } from "../../hooks/useApproveKaiju";
import { useBalance } from "../../hooks/useBalance";
import useEthereum from "../../hooks/useEthereum";
import useKaiju from "../../hooks/useKaiju";

const Home = () => {
    const { web3Modal, loadWeb3Modal, injectedProvider } = useEthereum()
    const { selectedKaiju, breed, isBreeding } = useKaiju()
    const { 
        allowance, allowanceIsLoading, approve:approveRWaste, approveIsLoading:approveRWasteIsLoading
    } = useAllowance(RWASTE_ADDRESS, KAIJUKINGZ_BREEDER_ADDRESS);
    const { 
        approval, approvalIsLoading, approve:approveKaiju, approveIsLoading:approveKaijuIsLoading
    } = useApproveKaiju(KAIJUKINGZ_ADDRESS, KAIJUKINGZ_BREEDER_ADDRESS);
    const { isOpen, onOpen, onClose } = useDisclosure()
    
    const isLoading = useMemo(() => {
        return allowanceIsLoading || approvalIsLoading || approveRWasteIsLoading || approveKaijuIsLoading || isBreeding;
    }, [allowanceIsLoading, approvalIsLoading, approveRWasteIsLoading, approveKaijuIsLoading, isBreeding])
    const { balance, balanceIsLoading } = useBalance(RWASTE_ADDRESS);
    
    const handleClick = useCallback(async () => {
        if (allowance.lt(parseUnits(FUSION_COST.toString(), "18"))) {
            await approveRWaste(ethers.constants.MaxUint256);
        } else if (!approval) {
            await approveKaiju();
        } else if (balance.lt(parseUnits(FUSION_COST.toString(), "18"))) {
            
        } else {
            try {
                await breed();
            } catch (error) {
                console.log(error, "??");
            }
        }
    }, [approval, allowance, approveRWaste, approveKaiju, breed, balance]);

    const buttonLabel = useMemo(() => {
        let label = "Fuse";

        if (!approval) label = "Approve Kaiju";
        if (allowance.lt(parseUnits(FUSION_COST.toString(), "18"))) label = "Approve RWaste";
        if (!selectedKaiju) label = "Select Kaiju first"
        if (balance.lt(parseUnits(FUSION_COST.toString(), "18"))) label = "Not enough RWaste"
        
        return label;
    }, [approval, allowance, selectedKaiju, balance]);

    const buttonDisabled = useMemo(() => {
        if (!selectedKaiju) return true;
        if (balance.lt(parseUnits(FUSION_COST.toString(), "18"))) return true;
        return false;
    }, [selectedKaiju, balance])

    const fuseLabel = useMemo(() => {
        let label;
        if (!selectedKaiju) {
            label = "Fuse with Kaijuz #880?"
        } else {
            label = `Fuse Kaijuz #880 and Kaijuz #${selectedKaiju.id}?`
        }
        
        return label;
    }, [selectedKaiju])
    
    return (
        <>
            <VStack mt={8} spacing={1}>
                <HStack>
                    <Image src={KaijuImg} w="30vh" borderRadius={8} border={"2px"} borderColor="gray.200"/>
                    <Text fontSize="3em" px={5}>+</Text>
                    <Box w="30vh" h="30vh" borderRadius={8} border={"2px"} borderColor="gray.200" cursor="pointer"
                        onClick={() => {injectedProvider ? onOpen() : loadWeb3Modal()}}>
                        {selectedKaiju &&
                            <Image src={selectedKaiju.uri} borderRadius={8} fit="contain"/>}
                        {!selectedKaiju && 
                            <Flex align="center" height="100%">
                                <Text mx="auto">Select Kaiju</Text>
                            </Flex>}
                    </Box>
                </HStack>
                <Text fontSize="xl" pt={4}>{fuseLabel}</Text>
                <Text fontSize="lg" py={2}>Cost: 750 $RWASTE + 0.1 ETH</Text>
                <Text fontSize="md" pb={5}>Your balance: {balanceIsLoading ? '-' : formatUnits(balance, "18")} $RWaste</Text>
                
                {web3Modal && !web3Modal.cachedProvider &&
                    <Button minW="200px" colorScheme="green" onClick={loadWeb3Modal}>Connect</Button>}

                {injectedProvider &&
                    <Button minW="200px" colorScheme="green" isDisabled={buttonDisabled} isLoading={isLoading} onClick={handleClick}>
                        {buttonLabel}
                    </Button>}
            </VStack>
            <ModalSelectKaiju isOpen={isOpen} onClose={onClose}/>
        </>
    );
};

export default Home;