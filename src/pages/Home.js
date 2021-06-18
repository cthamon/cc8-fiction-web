import Navbar from '../components/Navbar';
import Banner from '../components/Banner/Banner';
import Novels from '../components/Novels'
import { Flex } from '@chakra-ui/react';

function Home() {
    return (
        <Flex
            direction='column'
            align='center'
            maxW={{ xl: '1200px' }}
            m='0 auto'
        >
            <Navbar />
            <Banner />
            <Novels />
        </Flex>
    );
}

export default Home;