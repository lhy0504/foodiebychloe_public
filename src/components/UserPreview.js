import React, {  useState, useEffect } from 'react';

import {
    FlatList, HStack, IconButton, Text, Box,
    VStack, NativeBaseProvider, Button, Avatar
} from "native-base";
import {
     getUser
  
} from '../utils/FirebaseUtil'
import {  TouchableHighlight } from 'react-native-gesture-handler';


/* 
props:
user (real data)
OR
userid,

navigation
*/
export default function RestaurantTileFromID(props) {

    const [data, setData] = React.useState(props.hasOwnProperty('user') ? props.user : null)

    async function getData() {
        console.log(props.userid)
        var dat = await getUser(props.userid, false)
        setData(dat)
    }

    React.useEffect(() => {
        if (props.hasOwnProperty('userid')) getData()
    }, [props.user])

    const openProfile = () => {
        props.navigation.push('UserProfileStack', {
            userid:props.userid
        })
    }

    return data ? (
        <TouchableHighlight activeOpacity={0.6} underlayColor="#e6e6e6" onPress={() => openProfile()}>
            <HStack alignItems='center'
                borderBottomColor='coolGray.100' borderBottomWidth={1}>

                <Avatar ml='15px' mr='8px' size={45} source={{ uri: data.propic, }} />

                <VStack>
                    <Text fontSize='sm' fontWeight='bold' >{data.name}</Text>
                    <Text color='coolGray.500'>
                        {data.friends.length + data.requests.length + ' 追蹤者  '}
                    </Text>
                    <Text color='#ff9636'>{data.status}</Text>
                   
                </VStack>

            </HStack>
        </TouchableHighlight>
    ) : <></>
}