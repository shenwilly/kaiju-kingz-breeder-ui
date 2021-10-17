import { useContext } from "react";
import { KaijuContext } from "../contexts/Kaiju";

const useKaiju = () => {
  return { ...useContext(KaijuContext) };
};

export default useKaiju;
