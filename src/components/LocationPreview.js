import React, { useState, useEffect } from 'react';
import {
    TouchableHighlight
} from 'react-native';
import {
    FlatList, HStack, IconButton, Text, Box,
    VStack, NativeBaseProvider, Button, Avatar, Image
} from "native-base";
import {
    getLocation,

} from '../utils/FirebaseUtil'
import { Feather, Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

/* 
props:
location (real data)
OR
place_id,

navigation
*/
export default function RestaurantTileFromID(props) {

    const [data, setData] = React.useState(props.hasOwnProperty('location') ? props.location : null)

    async function getData() {
        var dat = await getLocation(props.location, props.place_id)
        setData(dat)
    }

    React.useEffect(() => {
        if (!props.hasOwnProperty('location')) getData()
    }, [])

    const openProfile = (location, place_id) => {
        props.navigation.push('LocationProfileStack', {
            location: location,
            place_id: place_id
        })
    }

    return (data ? <TouchableHighlight activeOpacity={0.6} underlayColor="#e6e6e6" onPress={() => openProfile(data.name, data.place_id)}>
        <HStack alignItems='center' 
            borderBottomColor='coolGray.100' borderBottomWidth={1} borderRadius={10}>

            <Box m={3} borderRadius={5} overflow='hidden'>
              
                <Image style={{ height: 90, width: 90, }} source={{
                    uri: data.pic ||
                        'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/facebook/65/clinking-beer-mugs_1f37b.png'

                }} />

            </Box>

            <VStack mr={3}>
                <Text fontSize='md' fontWeight='bold' >{data.name}</Text>
                {data.hasOwnProperty('tag') && data.tag.length > 0 &&
                    <Text >{data.tag.join(' / ')}
                        {data.hasOwnProperty('price') && " / $" + data.price}
                    </Text>
                }
                {data.hasOwnProperty('average') &&
                    <HStack>
                        <Feather name='star' style={{ marginRight: 8 }} size={20} />
                        <Text fontWeight='bold'>{(data.average).toFixed(1)}</Text>
                        <Text>{"  (" + data.total + ")"}</Text>
                    </HStack>}
                <Text color='#bbb'>{data.address}</Text>
            </VStack>

        </HStack>
    </TouchableHighlight>
        : <></>
    );
}