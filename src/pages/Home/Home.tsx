import { Button, Text, Image, VStack } from "@chakra-ui/react"
import { parseUnits } from "@ethersproject/units";
import { ethers } from "ethers";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import KaijuImg from "../../assets/kaijusanta.png";
import { FUSION_COST, KAIJUKINGZ_ADDRESS, KAIJUKINGZ_BREEDER_ADDRESS, RWASTE_ADDRESS } from "../../constants";
import { useAllowance } from "../../hooks/useAllowance";
import { useApproveKaiju } from "../../hooks/useApproveKaiju";
import useEthereum from "../../hooks/useEthereum";
import useKaiju from "../../hooks/useKaiju";

const Home = () => {
    const { web3Modal, loadWeb3Modal, injectedProvider } = useEthereum()
    const { ownedKaijus } = useKaiju();
    const { 
        allowance, allowanceIsLoading, approve:approveRWaste, approveIsLoading:approveRWasteIsLoading
    } = useAllowance(RWASTE_ADDRESS, KAIJUKINGZ_BREEDER_ADDRESS);
    const { 
        approval, approvalIsLoading, approve:approveKaiju, approveIsLoading:approveKaijuIsLoading
    } = useApproveKaiju(KAIJUKINGZ_ADDRESS, KAIJUKINGZ_BREEDER_ADDRESS);
    
    const isLoading = useMemo(() => {
        return allowanceIsLoading || approvalIsLoading;
    }, [allowanceIsLoading, approvalIsLoading])
    
    const handleClick = useCallback(async () => {
        if (allowance.lt(parseUnits(FUSION_COST.toString(), "18"))) {
            await approveRWaste(ethers.constants.MaxUint256);
        } else if (!approval) {
            await approveKaiju();
        } else {
            // await 
        }
    }, [approval, allowance]);

    const buttonLabel = useMemo(() => {
        let label = "Confirm Fusion";

        if (!approval) label = "Approve Kaiju";
        if (allowance.lt(parseUnits(FUSION_COST.toString(), "18"))) label = "Approve RWaste";
        
        return label;
    }, [approval, allowance]);
    
    return (
        <>
            <VStack mt={8} spacing={1}>
                <Image src={KaijuImg} w="30vh"/>
                <Text fontSize="xl" py={1}>Breed with Kaiju #880?</Text>
                <Text fontSize="md" pb={6}>Cost: 750 $RWASTE + 0.1 ETH</Text>
                
                {web3Modal && !web3Modal.cachedProvider &&
                    <Button minW="200px" colorScheme="green" onClick={loadWeb3Modal}>Connect</Button>}

                {injectedProvider && 
                    <Button minW="200px" colorScheme="green" onClick={() => {}}>Select Kaiju</Button>}

                {injectedProvider &&
                    <Button minW="200px" colorScheme="green" isLoading={isLoading} onClick={handleClick}>
                        {buttonLabel}
                    </Button>}
            </VStack>
        </>
    );
};

export default Home;