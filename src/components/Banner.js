import { Box, Flex, Image, RadioGroup, Radio } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useState } from 'react';

function Banner() {
    const bannerImages = [
        'https://s3.ap-southeast-1.amazonaws.com/media.fictionlog/books/5fd709d7900071001bcde581/601ac5cfC1eQpr9s.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/media.fictionlog/books/60af441f9a6708001b77f801/60b5f00ftydKIffV.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/media.fictionlog/books/6093624ba7a2db001bf2d430/60b5f02fGTELPuj7.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/media.fictionlog/books/5d3595723d461bfa13252172/5f61d81fCMH2okCd_source.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/media.fictionlog/ebooks/609e3e77c58864001b9e93d0/adpc15p7hh3q9h1a.jpeg'
    ];

    const [radioValue, setRadioValue] = useState(1);

    return (
        <Box>
            <Flex
                w='100vw'
                pt='24px'
                justify='center'
                align='center'
                overflow='hidden'
            >
                {/* {bannerImages.map((item, i) => {
                return (
                    <Image
                        key={i}
                        w='682px'
                        rounded='md'
                        src={item}
                        alt='banner'
                    />
                );
            })} */}
                <Box
                    w='546px'
                    h='256px'
                    bg='red.500'
                >

                </Box>
                <Box
                    w='682px'
                    h='320px'
                    m='0 30px'
                    bg='green.500'
                >

                </Box>
                <Box
                    w='546px'
                    h='256px'
                    bg='blue.500'
                >

                </Box>
            </Flex>
            <RadioGroup
                align='center'
                value={radioValue}
                onChange={setRadioValue}
            >
                <Radio value='1' />
                <Radio value='2' />
                <Radio value='3' />
                <Radio value='4' />
                <Radio value='5' />
            </RadioGroup>
        </Box>
    );
}

export default Banner;