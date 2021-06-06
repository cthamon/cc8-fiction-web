import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import { Box, Flex } from '@chakra-ui/react';

function Home() {
    return (
        <Flex
            direction="column"
            align="center"
            maxW={{ xl: "1200px" }}
            m="0 auto"
        >
            <Navbar />
            <Banner />
        </Flex>
    );
}

export default Home;