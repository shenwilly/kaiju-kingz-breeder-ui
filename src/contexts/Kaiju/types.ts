import { Kaiju } from "../../types";

export interface ContextValues {
    selectedKaiju: Kaiju | null,
    ownedKaijus: Kaiju[],
    numOfOwnedKaijus: number | null,
    selectKaiju: (kaiju: Kaiju) => void,
    breed: () => void,
}
