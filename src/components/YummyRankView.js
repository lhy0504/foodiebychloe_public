import React, { useState, useEffect } from 'react';

import {
    FlatList, HStack, IconButton, Text, Box,
    VStack, NativeBaseProvider, Button, Avatar, Image
} from "native-base";

import { yummyRank } from '../consts/dishes';
/* 
props:
overallyummy
*/
const colors = [
    'red.600',
    'yellow.300',
    'green.500',
    'green.600',
    'blue.500'
]
export default function YummyRankView(props) {

    /*  
    0-1  C
    1-2  B-
    2-3  B+
    3-4
    4-5
    
    */
 var score = Math.floor(props.overallyummy)
console.log(score)
    return <Box
       
        w={16}
        py={.5}
       
        borderRadius={3}
        backgroundColor={colors[score-1]}
 
        justifyContent={'center'}
        alignItems='center'>
        <Text
         color='white'
            fontWeight='bold' fontSize={'md'}>{yummyRank[5 - score].name}</Text>
    </Box>

}
/*  return <Box
       
        w={16}
        py={.2}
       
        borderRadius={3}
        borderWidth={2}
        borderColor={colors[score-1]}
 
        justifyContent={'center'}
        alignItems='center'>
        <Text
        color={colors[score-1]}
            fontWeight='bold' fontSize={'lg'}>{yummyRank[5 - score].name}</Text>
    </Box> */