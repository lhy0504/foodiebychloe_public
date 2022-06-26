import React, { Component, useState, useEffect } from 'react';
import { TouchableHighlight, View, Dimensions, RefreshControl } from 'react-native';
import {
    FlatList, HStack, IconButton, Text, Spinner, Box, Image,
    VStack, NativeBaseProvider, Avatar
} from "native-base";
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler'
import { getUserPosts, getUser, followUser, getMyUid } from '../utils/FirebaseUtil'
import Post from '../components/Post'
import { InfiniteMonthView } from '../components/InfiniteMonthView'


import * as Noti from '../utils/SaveNotifications'


export default function Feed({ navigation, route }) {
    const [noti, setNoti] = useState([])
    const [lastread, setLastread] = useState(new Date())
    const [refreshing, setRefreshing] = useState(true)

    async function getData() {
        setRefreshing(true)
        var lastread = new Date(await Noti.getNotificationsLastRead())
        var d = await Noti.getNotifications()
       

        setNoti(d.reverse())
        setLastread(lastread)
        setRefreshing(false)
    }

    useEffect(() => {
        getData()
    }, [])


    return (
        <NativeBaseProvider>
            <VStack backgroundColor='white' flex={1} >
                {/*  Header Bar  */}

                <HStack alignItems='center' justifyContent='space-between'
                    borderBottomWidth='1px' borderBottomColor='coolGray.300'
                    backgroundColor='white' height='50px' px={2} 
                >
                    <Box flex={1} justifyContent={'flex-start'}>
                        <IconButton  style={{ width: 50 }} onPress={() => navigation.goBack()}
                            icon={<Ionicons name="ios-chevron-back"  size={24} color="black" />} />
                    </Box>
                    <HStack alignItems='center'  >
                        <Ionicons name="notifications" size={16} color='#FF9636' />
                        <Text fontWeight='bold' ml={1} fontSize='sm'>{'通知'}</Text>
                    </HStack>
                    <Box flex={1}>
                    </Box>
                </HStack>

                <FlatList
                    contentContainerStyle={{ paddingBottom: 20 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={getData}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    data={noti}
                    renderItem={({ item, index }) => {

                        var data = item.request.content
                        var date = new Date(item.date)
                        console.log('noti',lastread , date)

                        return (

                            <TouchableOpacity onPress={() => navigation.navigate(data.data.screen, data.data)}>
                                <HStack py={4} alignItems='center'
                                    borderBottomColor='coolGray.100'
                                    borderBottomWidth={1}
                                    backgroundColor={lastread < date ? 'orange.100' : 'white'}
                                >

                                    <Avatar ml='15px' mr='8px' size="35px" source={{ uri: data.data.propic, }} />

                                    <VStack justifyContent='center'>
                                        <Text fontWeight='bold' color='coolGray.500'>{data.title}</Text>
                                        {data.body != '' && <Text >{data.body}</Text>}
                                        <Text fontSize='sm'>{date.toLocaleDateString('en-US')}</Text>
                                    </VStack>

                                </HStack>
                            </TouchableOpacity>
                        )
                    }}

                />
            </VStack>

        </NativeBaseProvider>


    );
}
