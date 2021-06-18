import { Box, Flex, Image, RadioGroup, Radio } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import './Banner.css'

function Banner() {
    const bannerImages = [
        'https://s3.ap-southeast-1.amazonaws.com/media.fictionlog/books/5fd709d7900071001bcde581/601ac5cfC1eQpr9s.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/media.fictionlog/books/60af441f9a6708001b77f801/60b5f00ftydKIffV.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/media.fictionlog/books/6093624ba7a2db001bf2d430/60b5f02fGTELPuj7.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/media.fictionlog/books/5d3595723d461bfa13252172/5f61d81fCMH2okCd_source.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/media.fictionlog/ebooks/609e3e77c58864001b9e93d0/adpc15p7hh3q9h1a.jpeg'
    ];

    const [radioNumber, setRadioNumber] = useState(0);

    const imageNumber = (radioNumber, number, maxNumber) => {
        if (+radioNumber + +number >= +maxNumber) {
            return +radioNumber + +number - +maxNumber
        } return +radioNumber + +number
    }

    const ChevronLeftChecker = (radioNumber, maxNumber) => {
        if (+radioNumber - 1 < 0) {
            return setRadioNumber(maxNumber - 1)
        } return setRadioNumber(+radioNumber - 1)
    }

    const ChevronRightChecker = (radioNumber, maxNumber) => {
        if (+radioNumber + 1 >= +maxNumber) {
            return setRadioNumber(0)
        } return setRadioNumber(+radioNumber + 1)
    }

    return (
        <Box>
            <Flex
                w='100vw'
                pt='24px'
                justify='center'
                align='center'
                overflow='hidden'
            >
                <Flex
                    w='40px'
                    h='40px'
                    justify='center'
                    align='center'
                    position='absolute'
                    left='3'
                    rounded='full'
                    bg='rgba(255,255,255,0.8)'
                    cursor='pointer'
                    onClick={() => ChevronLeftChecker(radioNumber, bannerImages.length)}
                    zIndex='1'
                >
                    <ChevronLeftIcon />
                </Flex>
                <Box
                    className='banner'
                    display={['none', 'none', 'block', 'block']}
                    minW='682px'
                    bg='gray.600'
                    userSelect='none'
                >
                    <Image
                        rouded='xl'
                        src={bannerImages[imageNumber(radioNumber, 0, bannerImages.length)]}
                    />
                </Box>
                <Box
                    className='banner'
                    display={['none', 'none', 'block', 'block']}
                    minW={['90%', '90%', '682px', '682px']}
                    bg='gray.600'
                    m='0 20px'
                    userSelect='none'
                >
                    <Image
                        rouded='xl'
                        src={bannerImages[imageNumber(radioNumber, 1, bannerImages.length)]}
                    />
                </Box>
                <Box
                    className='banner'
                    display={['none', 'none', 'block', 'block']}
                    minW='682px'
                    bg='gray.600'
                    userSelect='none'
                >
                    <Image
                        rouded='xl'
                        src={bannerImages[imageNumber(radioNumber, 2, bannerImages.length)]}
                    />
                </Box>
                <Flex
                    w='40px'
                    h='40px'
                    justify='center'
                    align='center'
                    position='absolute'
                    right='3'
                    rounded='full'
                    bg='rgba(255,255,255,0.8)'
                    cursor='pointer'
                    onClick={() => { ChevronRightChecker(radioNumber, bannerImages.length); }}
                    zIndex='1'
                >
                    <ChevronRightIcon />
                </Flex>
            </Flex>
            <RadioGroup
                align='center'
                value={radioNumber}
            >
                {bannerImages.map((item, i) => {
                    return (
                        <Radio
                            key={i}
                            value={i}
                            m='10px 5px 0 0'
                            onClick={() => setRadioNumber(i)}
                        >
                        </Radio>
                    )
                })}
            </RadioGroup>
        </Box >
    );
}

export default Banner;