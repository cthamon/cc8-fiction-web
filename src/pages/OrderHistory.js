import Navbar from '../components/Navbar';
import { Flex, Box, Text, Table, Thead, Tbody, Tr, Th, Td, Image } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import localStorageService from '../services/localStorageService';
import { ActivityContext } from '../contexts/ActivityContextProvider';

function OrderHistory() {
    const token = localStorageService.getToken();

    const [orderHistory, setOrderHistory] = useState([]);
    const [toggleDetail, setToggleDetail] = useState([]);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            const res = await axios.get('http://localhost:8000/order/', { headers: { 'Authorization': `Bearer ${token}` } });
            setOrderHistory(res.data.orders.sort((a, b) => b.id - a.id));
        };
        fetchOrderHistory();
        setToggleDetail(orderHistory.map(item => false));
    }, []);

    const changeToggleDetail = (index) => {
        const array = [...toggleDetail];
        array[index] = !array[index];
        return array;
    };

    return (
        <Flex
            direction='column'
            align='center'
            maxW={{ xl: '1200px' }}
            m='0 auto'
        >
            <Navbar />
            <Box m='20px' w='85%'>
                <Text textAlign='left' fontSize='xl' fontWeight='semibold' mb='20px'>Order History</Text>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Order #</Th>
                            <Th>Order Date</Th>
                            <Th>Billing Address</Th>
                            <Th>Items</Th>
                            <Th>Total Amount</Th>
                            <Th>Order Detail</Th>
                        </Tr>
                    </Thead>
                    {orderHistory.map((item, i) =>
                        <Tbody key={i}>
                            <Tr>
                                <Td>{item.id}</Td>
                                <Td>{item.createdAt.split('-')[1] + '-' + item.createdAt.split('-')[2].split('T')[0] + '-' + item.createdAt.split('-')[0]}</Td>
                                <Td>{item.address}</Td>
                                <Td>{item.orderItems.length}</Td>
                                <Td>{item.orderItems.reduce((acc, cv) => cv.episodePrice + cv.novelPrice + acc, 0) - item.discount === 0 ? 'FREE' : 'THB ' + (item.orderItems.reduce((acc, cv) => cv.episodePrice + cv.novelPrice + acc, 0) - item.discount)}</Td>
                                <Td onClick={() => { setToggleDetail(changeToggleDetail(i)); }} cursor='pointer'>
                                    {!toggleDetail[i] && <ChevronDownIcon />}{toggleDetail[i] && <ChevronUpIcon />}
                                </Td>
                            </Tr>
                            {item.orderItems.sort((a, b) => b.novelPrice - a.novelPrice).map((orderItem, j) =>
                                toggleDetail[i] &&
                                <Tr key={j}>
                                    <Td></Td>
                                    <Td colSpan='4'>
                                        <Flex justify='space-between'>
                                            <Flex>
                                                <Image src={orderItem.cover} h='70px' mr='15px' rounded='sm' />
                                                <Box>
                                                    <Text fontWeight='semibold'>{orderItem.novelTitle}</Text>
                                                    <Text>{orderItem.episodePrice === 0 ? '(All Episode)' : orderItem.episodeTitle}</Text>
                                                </Box>
                                            </Flex>
                                        </Flex>
                                    </Td>
                                    <Td>
                                        <Text>THB {orderItem.episodePrice === 0 ? orderItem.novelPrice : orderItem.episodePrice}</Text>
                                        <Text fontSize='x-small' color='secondary.600'>{item.discount === 0 ? '' : 'discount THB ' + item.discount}</Text>
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    )}
                </Table>
            </Box>
        </Flex >
    );
}

export default OrderHistory;