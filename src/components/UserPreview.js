import React, {  useState, useEffect } from 'react';
import {
     TouchableOpacity,TouchableHighlight
} from 'react-native';
import {
    FlatList, HStack, IconButton, Text, Box,
    VStack, NativeBaseProvider, Button, Avatar
} from "native-base";
import {
     getUser
  
} from '../utils/FirebaseUtil'


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
        var dat = await getUser(props.userid, false)
        setData(dat)
    }

    React.useEffect(() => {
        if (!props.hasOwnProperty('user')) getData()
    }, [])

    const openProfile = () => {
        props.navigation.navigate('UserProfileStack', {
            userid: data.uid
        })
    }

    return data ? (
        <TouchableHighlight activeOpacity={0.6} underlayColor="#e6e6e6" onPress={() => openProfile()}>
            <HStack alignItems='center'
                borderBottomColor='coolGray.100' borderBottomWidth={1}>

                <Avatar ml='15px' mr='8px' size={45} source={{ uri: data.propic, }} />

                <VStack>
                    <Text fontSize='sm' fontWeight='bold' >{data.name}</Text>
                    <Text color='coolGray.500'>{"加入於 " + data.joined}</Text>
                    <Text color='#FF9636'>
                        {data.friends.length + data.requests.length + ' 追蹤者 • '}
                        {data.following.length + ' 追蹤中'}
                        {data.hasOwnProperty('bookmarks') && ' • '+data.bookmarks.length + ' 個收藏'}
                    </Text>
                </VStack>

            </HStack>
        </TouchableHighlight>
    ) : <></>
}