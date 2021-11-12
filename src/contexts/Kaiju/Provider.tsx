import { ethers } from "ethers";
import React, { useCallback, useState, useEffect } from "react";
import useEthereum from "../../hooks/useEthereum";
import KaijuKingzAbi from "../../constants/abis/KaijuKingz.json";
import KaijuBreederAbi from "../../constants/abis/KaijuBreeder.json";
import { KaijuKingz } from '../../types/eth/KaijuKingz';
import { Kaiju } from "../../types";
import Context from "./Context";
import { KAIJUKINGZ_ADDRESS, KAIJUKINGZ_BREEDER_ADDRESS, KAIJUKINGZ_URI } from "../../constants";
import { getHttp } from "../../utils/api";
import { KaijuBreeder } from "../../types/eth";

const Provider: React.FC = ({ children }) => {
    const { accountAddress, ethAccount, injectedProvider } = useEthereum();
    const [selectedKaiju, setSelectedKaiju] = useState<Kaiju | null>(null);
    const [ownedKaijus, setOwnedKaijus] = useState<Kaiju[]>([]);
    const [numOfOwnedKaijus, setNumOfOwnedKaijus] = useState<number | null>(null);
    const [isBreeding, setIsBreeding] = useState<boolean>(false);
    const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false);

    const selectKaiju = useCallback(async (kaiju: Kaiju) => {
        setSelectedKaiju(kaiju);
    }, [setSelectedKaiju]);

    const breed = useCallback(async () => {
      if (!ethAccount || !injectedProvider || !selectedKaiju) {
        return;
      }

      setIsBreeding(true);
      try {
        const breeder = (new ethers.Contract(KAIJUKINGZ_BREEDER_ADDRESS, KaijuBreederAbi, ethAccount)) as KaijuBreeder;
        if (isWhitelisted) {
            const tx = await breeder.breedFree(selectedKaiju.id, 1);
            await tx.wait();
        } else {
            const tx = await breeder.breed(selectedKaiju.id, 1);
            await tx.wait();
        }
        
        setIsBreeding(false);
      } catch (e) {
        setIsBreeding(false);
        return;
      }

    }, [ethAccount, injectedProvider, selectedKaiju, isWhitelisted]);

    useEffect(() => {
        async function fetchOwnedKaijus() {
            if (!ethAccount || !accountAddress) {
                return;
            }
            
            const breeder = (new ethers.Contract(KAIJUKINGZ_BREEDER_ADDRESS, KaijuBreederAbi, ethAccount)) as KaijuBreeder;
            const whitelisted = await breeder.whitelist(accountAddress);
            setIsWhitelisted(whitelisted);
        }
        fetchOwnedKaijus()
    }, [ethAccount, accountAddress])

    useEffect(() => {
        async function fetchWhitelist() {
            if (!ethAccount || !accountAddress) {
                return;
            }
            
            const kaijuKingz = (new ethers.Contract(KAIJUKINGZ_ADDRESS, KaijuKingzAbi, ethAccount)) as KaijuKingz;
            const numOfKaijus = await kaijuKingz.balanceOf(accountAddress);
            setNumOfOwnedKaijus(numOfKaijus.toNumber());

            for (let i=0; i < numOfKaijus.toNumber(); i++) {
                const kaijuId = await kaijuKingz.tokenOfOwnerByIndex(accountAddress, i);
                const kaijuData = await getHttp(KAIJUKINGZ_URI+kaijuId);
                const kaiju:Kaiju = {
                    id: kaijuId,
                    uri: kaijuData.image
                }
                setOwnedKaijus(oldArray => [...oldArray, kaiju]);
            }
        }
        fetchWhitelist()
    }, [ethAccount, accountAddress])

    return (
        <Context.Provider
            value={{
                ownedKaijus,
                selectedKaiju,
                numOfOwnedKaijus,
                isBreeding,
                isWhitelisted,
                selectKaiju,
                breed
            }}>
            {children}
        </Context.Provider>
    );
};

export default Provider;