import { BigNumber, ethers } from "ethers";
import React, { useCallback, useState, useEffect } from "react";
import useEthereum from "../../hooks/useEthereum";
import KaijuKingzAbi from "../../constants/abis/KaijuKingz.json";
import { KaijuKingz } from '../../types/eth/KaijuKingz';
import { Kaiju } from "../../types";
import Context from "./Context";
import { KAIJUKINGZ_ADDRESS, KAIJUKINGZ_URI } from "../../constants";
import { getHttp } from "../../utils/api";

const Provider: React.FC = ({ children }) => {
    const { accountAddress, ethAccount, injectedProvider } = useEthereum();
    const [selectedKaiju, setSelectedKaiju] = useState<Kaiju | null>(null);
    const [ownedKaijus, setOwnedKaijus] = useState<Kaiju[]>([]);
    const [numOfOwnedKaijus, setNumOfOwnedKaijus] = useState<number | null>(null);

    const selectKaiju = useCallback(async (kaiju: Kaiju) => {
        setSelectedKaiju(kaiju);
    }, [setSelectedKaiju]);

    const breed = useCallback(async () => {
        // 
    }, []);

    useEffect(() => {
        async function fetchOwnedKaijus() {
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
        fetchOwnedKaijus()
    }, [ethAccount, accountAddress])

    return (
        <Context.Provider
            value={{
                ownedKaijus,
                selectedKaiju,
                numOfOwnedKaijus,
                selectKaiju,
                breed
            }}>
            {children}
        </Context.Provider>
    );
};

export default Provider;