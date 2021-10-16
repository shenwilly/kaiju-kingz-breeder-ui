import { Container, Flex, Button, Image } from "@chakra-ui/react"
import EtherscanLogo from "../../assets/etherscan.png";
import { CONTRACT_ETHERSCAN_URL } from "../../constants";

const Footer = () => {
    const openInNewTab = (url: string) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    return (
        <Container maxW="container.xl">
            <Flex align="right">
                <Button onClick={() => openInNewTab(CONTRACT_ETHERSCAN_URL)} 
                    p="2" size="md" variant="solid" colorScheme="green"
                >
                    <Image src={EtherscanLogo} fit="contain" width="24px" />
                </Button>
            </Flex>
        </Container>
    );
};

export default Footer;