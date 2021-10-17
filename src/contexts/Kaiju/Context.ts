import { createContext } from "react";
import { ContextValues } from "./types";

const Context = createContext<ContextValues>({
    selectedKaiju: null,
    ownedKaijus: [],
    numOfOwnedKaijus: null,
    isBreeding: false,
    selectKaiju: (kaiju) => {},
    breed: () => {}
});

export default Context;
