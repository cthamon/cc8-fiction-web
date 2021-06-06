import React from "react";
import { Box, Text } from "@chakra-ui/react";

export default function Logo(props) {
    return (
        <Box cursor='pointer' {...props}>
            <Text>
                LOGO
            </Text>
        </Box>
    );
}