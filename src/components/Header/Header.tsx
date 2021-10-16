import { Container, Flex, Spacer, Text } from "@chakra-ui/react"
import styled from "styled-components";

const Header = () => {
    return (
        <StyledHeader maxW="container.xl">
            <StyledRow align="center">
                <Spacer />
                <Text textStyle="appTitle">KaijuKingz Fusion Santa</Text>
                <Spacer />
            </StyledRow>
        </StyledHeader>
    );
};

const StyledHeader = styled(Container)``

const StyledRow = styled(Flex)`
    height: ${props => props.theme.headerHeight};
`

export default Header;