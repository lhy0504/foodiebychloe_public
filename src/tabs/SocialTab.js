import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Image, TextInput, Button, RefreshControl, ImageBackground } from 'react-native';
import {
    Text, Spinner, IconButton, Avatar,
    VStack, NativeBaseProvider, Box, HStack, ScrollView, FlatList
} from "native-base";
import { Feather, AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

import { getUser, getMyUid, } from '../utils/FirebaseUtil'
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Noti from '../utils/SaveNotifications'
import NotificationButton from '../components/NotificationButton'



var { width, height } = Dimensions.get('window')

export default function Maptab({ navigation, route }) {

    const [noti, setNoti] = useState([])
    const [fdMostFols, setFdMostFols] = useState(null)
    const [fdMostFavs, setFdMostFavs] = useState(null)
    const [fdMostPosts, setFdMostPosts] = useState(null)

    async function getData() {

        var d = await Noti.getNotifications()
        setNoti(d.reverse())

        var myuser = await getUser()
        var maxFols = 0, maxFavs = 0, maxPosts = 0
        for (var i of myuser.friends) {
            console.log('id', i)
            var u = await getUser(i)
            console.log(u)
            if (u.followerCount > maxFols) {
                maxFols = u.followerCount
                setFdMostFols(u)
            }
            if (u.bookmarks.length > maxFavs) {
                maxFavs = u.bookmarks.length
                setFdMostFavs(u)
            }
            if (u.post.length > maxPosts) {
                maxPosts = u.post.length
                setFdMostPosts(u)
            }
        }
        console.log(maxFols)
    }

    useEffect(() => {
        getData()
    }, [])


    const openProfile = (u) => {
        navigation.push('UserProfileStack', {
            userid: u
        })
    }


    return (
        <NativeBaseProvider>
            <ImageBackground
                source={require("./../../assets/social_bg.png")}
                style={{ width: width, height: height }}
            >

                <HStack mx={6} mt={4} justifyContent='space-between' alignItems='center' >
                    <Text fontSize={24} fontWeight='bold'  >動態</Text>
                    <NotificationButton navigation={navigation} />
                </HStack>
                <FlatList
                    h={200} flexGrow={0} 
                   showsVerticalScrollIndicator={false}
                    data={noti}
                    ListEmptyComponent={
                        <Text width={'100%'} textAlign='center' my={10}>沒有最近動態</Text>
                    }
                    renderItem={({ item, index }) => {
                        var data = item.request.content
                        var date = new Date(item.date)

                        return (

                            <TouchableOpacity onPress={() => navigation.push(data.data.screen, data.data)}>
                                <HStack py={4} alignItems='center'
                                    borderBottomColor='coolGray.100'
                                    borderBottomWidth={1}
                                    backgroundColor={'white'}
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
                <HStack mx={6} my={4}  alignItems='center' >
                    
                    <Text fontSize={24} fontWeight='bold'  >朋友 ♛</Text>
                </HStack>
                {fdMostFols &&
                    <TouchableOpacity onPress={() => openProfile(fdMostFols.uid)}>
                        <HStack py={4} alignItems='center' borderColor='coolGray.300'
                            justifyContent='space-between' mx={6}>
                            <Text fontWeight={'bold'}>最多粉絲</Text>
                            <HStack alignItems={'center'}>
                                <Text mr={1}>{fdMostFols.name}</Text>
                                <Avatar size={19} source={{ uri: fdMostFols.propic }} />
                            </HStack>
                        </HStack>
                    </TouchableOpacity>}
                {fdMostFavs &&
                    <TouchableOpacity onPress={() => openProfile(fdMostFavs.uid)}>
                        <HStack py={4} mt={2} alignItems='center' borderColor='coolGray.300'
                           justifyContent='space-between' mx={6}>
                            <Text fontWeight={'bold'}>最多收藏</Text>
                            <HStack alignItems={'center'}>
                                <Text mr={1}>{fdMostFavs.name}</Text>
                                <Avatar size={19} source={{ uri: fdMostFavs.propic }} />
                            </HStack>
                        </HStack>
                    </TouchableOpacity>}
                {fdMostPosts &&
                    <TouchableOpacity onPress={() => openProfile(fdMostPosts.uid)}>
                        <HStack py={4} mt={2} alignItems='center' borderColor='coolGray.300'
                            
                           justifyContent='space-between' mx={6}>
                            <Text fontWeight={'bold'}>最多帖文</Text>
                            <HStack alignItems={'center'}>
                                <Text mr={1}>{fdMostPosts.name}</Text>
                                <Avatar size={19} source={{ uri: fdMostPosts.propic }} />
                            </HStack>
                        </HStack>
                    </TouchableOpacity>}

                <Box h={50} />

            </ImageBackground>
        </NativeBaseProvider>
    );
}

