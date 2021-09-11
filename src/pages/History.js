import Navbar from '../components/Navbar';
import { Flex, Box, Text, Divider } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import axios from "axios";
import localStorageService from '../services/localStorageService';
import { ActivityContext } from '../contexts/ActivityContextProvider';

function History() {
    const token = localStorageService.getToken();
    const history = useHistory();
    const { setEpisodeId } = useContext(ActivityContext);

    const [histories, setHistories] = useState([]);

    const fetchHistory = async () => {
        const res = await axios.get('http://localhost:8000/user/history', { headers: { 'Authorization': `Bearer ${token}` } });
        setHistories(res.data.histories);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <Flex
            direction='column'
            align='center'
            maxW={{ xl: '1200px' }}
            m='0 auto'
        >
            <Navbar />
            <Box m='20px 0' w='100%'>
                <Text
                    ml='70px'
                    fontSize='2xl'
                    fontWeight='semibold'
                    color='green.500'
                >
                    Read History
                </Text>
            </Box>
            <Box w='1050px'>
                <Flex justify='space-between' align='center'>
                    <Text w='30%' textAlign='center' fontWeight='semibold' color='secondary.600' fontSize='lg'>Novel</Text>
                    <Text w='30%' textAlign='center' fontWeight='semibold' color='secondary.600' fontSize='lg'>Episode</Text>
                    <Text w='15%' textAlign='center' fontWeight='semibold' color='secondary.600' fontSize='lg'>Date</Text>
                    <Text w='15%' textAlign='center' fontWeight='semibold' color='secondary.600' fontSize='lg'>Time</Text>
                    <Text w='10%' textAlign='center' fontWeight='semibold' color='secondary.600' fontSize='lg'>Read</Text>
                </Flex>
                <Divider mb='10px' />
            </Box>
            <Box w='1050px'>
                {histories.map((item, i) => {
                    return (
                        <Box key={i}>
                            <Flex justify='space-between' align='center'>
                                <Text w='30%' textAlign='center'>{item.novel}</Text>
                                <Text w='30%' textAlign='center'>{item.episodeTitle}</Text>
                                <Text w='15%' textAlign='center'>{item.updatedAt.split('T')[0]}</Text>
                                <Text w='15%' textAlign='center'>{item.updatedAt.split('T')[1].split('.')[0]}</Text>
                                <ExternalLinkIcon w='10%' textAlign='center' cursor='pointer' onClick={() => { history.push('/read'); setEpisodeId(item.episodeId); }} />
                            </Flex>
                        </Box>
                    );
                })}
            </Box>
        </Flex>
    );
}

export default History;