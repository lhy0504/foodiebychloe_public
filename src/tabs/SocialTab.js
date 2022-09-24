import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Image,  Button, RefreshControl, ImageBackground } from 'react-native';
import {
    Text, Spinner, IconButton, Avatar,
    VStack, NativeBaseProvider, Box, HStack, ScrollView, FlatList
} from "native-base";
import { Feather, AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

import { getUser, getMyUid, getFoodieScore, } from '../utils/FirebaseUtil'
import * as Noti from '../utils/SaveNotifications'
import NotificationButton from '../components/NotificationButton'

import { TouchableOpacity } from 'react-native-gesture-handler';

var { width, height } = Dimensions.get('window')

export default function Maptab({ navigation, route }) {

    const [noti, setNoti] = useState([])
    const [fdlist, setFdlist] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);

    const [fdMostFols, setFdMostFols] = useState(null)
    const [fdMostFavs, setFdMostFavs] = useState(null)
    const [fdMostPosts, setFdMostPosts] = useState(null)

    async function getData() {
        setRefreshing(true)
        var d = await Noti.getNotifications()
        setNoti(d.reverse())

        // get foodie rank
        var foodieScore = await getFoodieScore()
        let entries = Object.entries(foodieScore);
        let sorted = entries.sort((a, b) => b[1] - a[1]);
        // [["bar",15],["me",75],["you",100],["foo",116]]
        var list = []
        for (var i of sorted) {
            console.log(i)
            if (i[0] == getMyUid()) continue
            try {
                var u = await getUser(i[0])
                if (u) list.push({ ...u, score: i[1] })
            } catch (e) { console.log(e) }
        }
        setFdlist(list)

        var myuser = await getUser()
        var maxFols = 0, maxFavs = 0, maxPosts = 0
        for (var i of myuser.friends) {

            let u = await getUser(i)
            console.log('id', i, u.post.length)
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
        setRefreshing(false)
    }

    useEffect(() => {
        getData()
    }, [])


    const openProfile = (u) => {
        navigation.push('UserProfileStack', {
            userid: u
        })
    }

 const openFriendship = (u, score, rank) => {
        navigation.push('FriendshipStack', {
            userid: u,
            score:score,
            rank:rank
        })
    }
    return (
        <NativeBaseProvider>
            <ImageBackground

                style={{ width: width, height: height, backgroundColor: '#EEECE3' }}
            >

                <HStack mx={6} mt={4} justifyContent='space-between' alignItems='center' >
                    <Text fontSize={24} fontWeight='bold'  >動態</Text>
                    <NotificationButton navigation={navigation} />
                </HStack>
                <FlatList
                    mx={6} borderColor={'coolGray.200'}
                    style={{
                        backgroundColor: 'white', borderRadius: 15
                        , borderWidth: 1
                    }}
                    flexGrow={0}
                    showsVerticalScrollIndicator={false}
                    data={noti}
                    ListEmptyComponent={
                        <Text width={'100%'} textAlign='center' my={10} key={999}>沒有最近動態</Text>
                    }
                    renderItem={({ item, index }) => {
                        var data = item.request.content
                        var date = new Date(item.date)

                        return (

                            <TouchableOpacity onPress={() => navigation.push(data.data.screen, data.data)} key={index}>
                                <HStack py={2} alignItems='center'
                                    borderBottomColor='coolGray.100'
                                    borderBottomWidth={1}

                                >

                                    <Avatar ml='15px' mr='8px' size="35px" source={{ uri: data.data.propic, }} />

                                    <VStack justifyContent='center'>
                                        <Text  >{data.title}</Text>
                                        <Text color='coolGray.500'>{date.toLocaleDateString('en-US')}</Text>
                                    </VStack>

                                </HStack>
                            </TouchableOpacity>
                        )
                    }}

                />
                <HStack mx={6} my={4} alignItems='center' >
                    <Text fontSize={24} fontWeight='bold'  >關係分數 ♛</Text>
                    <Text fontSize={'xs'} color='coolGray.400'
                        mx={3} flexWrap='wrap' flex={1}>{"foodieScore 統計您和好友的互動。透過在帖文標記、回應、讚好，來增加你和對方的分數，成為最好的foodies吧"}</Text>
                </HStack>
                <FlatList mx={6} flexGrow={0} borderColor={'coolGray.200'}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={getData}
                        />
                    }
                    ListEmptyComponent={<Text textAlign={'center'} flex={1} key={888}>快去加好友！</Text>}
                    style={{
                        backgroundColor: 'rgba(255,255,255,1)', borderRadius: 15
                        , borderWidth: 1
                    }}
                    
                    data={fdlist}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => openFriendship(item.uid,item.score,index+1)} key={index}>
                            <VStack py={3} alignItems='flex-end' borderColor='coolGray.200'
                                mx={6} borderBottomWidth={1} >
                                <HStack alignItems={'center'} justifyContent='space-between' width='100%'>
                                    <HStack alignItems={'center'}>
                                        <Text width={8} fontSize='lg' fontWeight={'bold'}>{index + 1}</Text>
                                        <Avatar ml={3} size={21} source={{ uri: item.propic }} />
                                        <Text ml={2} fontWeight='bold' mr={1}>{item.name}</Text>
                                    </HStack>
                                    <Text >{item.score}</Text>
                                </HStack>
                                {index == 0 &&
                                    <Button style={{ margin:5, padding:5}} title='🎉慶祝您們的友誼' />
                                }
                            </VStack>


                        </TouchableOpacity>
                    )}
                />

                <HStack mx={6} my={6} alignItems='center' >

                    <Text fontSize={24} fontWeight='bold'  >活躍朋友 ♛</Text>
                </HStack>
                {fdMostFols &&
                    <TouchableOpacity onPress={() => openProfile(fdMostFols.uid)} key={1}>
                        <HStack py={4} alignItems='center' borderColor='coolGray.300'
                            borderWidth={1} borderTopRadius={15} backgroundColor='white' px={5}
                            borderBottomWidth={0}
                            justifyContent='space-between' mx={6}>
                            <Text fontWeight={'bold'}>最多粉絲</Text>
                            <HStack alignItems={'center'}>
                                <Text mr={1}>{fdMostFols.name}</Text>
                                <Avatar size={19} source={{ uri: fdMostFols.propic }} />
                            </HStack>
                        </HStack>
                    </TouchableOpacity>}
                {fdMostFavs &&
                    <TouchableOpacity onPress={() => openProfile(fdMostFavs.uid)} key={2}>
                        <HStack py={4} alignItems='center' borderColor='coolGray.300'
                            borderWidth={1} backgroundColor='white' px={5}
                            borderBottomWidth={0}
                            justifyContent='space-between' mx={6}>
                            <Text fontWeight={'bold'}>最多收藏</Text>
                            <HStack alignItems={'center'}>
                                <Text mr={1}>{fdMostFavs.name}</Text>
                                <Avatar size={19} source={{ uri: fdMostFavs.propic }} />
                            </HStack>
                        </HStack>
                    </TouchableOpacity>}
                {fdMostPosts &&
                    <TouchableOpacity onPress={() => openProfile(fdMostPosts.uid)} key={3}>
                        <HStack py={4} alignItems='center' borderColor='coolGray.300'
                            borderWidth={1} borderBottomRadius={15} backgroundColor='white' px={5}

                            justifyContent='space-between' mx={6}>
                            <Text fontWeight={'bold'}>最多帖文</Text>
                            <HStack alignItems={'center'}>
                                <Text mr={1}>{fdMostPosts.name}</Text>
                                <Avatar size={19} source={{ uri: fdMostPosts.propic }} />
                            </HStack>
                        </HStack>
                    </TouchableOpacity>}
                <Text textAlign={'center'} m={10}>🍺</Text>

            </ImageBackground>
        </NativeBaseProvider >
    );
}

