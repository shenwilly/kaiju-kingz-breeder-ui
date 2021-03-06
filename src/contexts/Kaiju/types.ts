import { Kaiju } from "../../types";

export interface ContextValues {
    selectedKaiju: Kaiju | null,
    ownedKaijus: Kaiju[],
    numOfOwnedKaijus: number | null,
    isBreeding: boolean,
    isWhitelisted: boolean,
    selectKaiju: (kaiju: Kaiju) => void,
    breed: () => Promise<void>,
}
