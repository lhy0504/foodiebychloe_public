import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Image, Button, RefreshControl, ImageBackground } from 'react-native';
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
            score: score,
            rank: rank
        })
    }
    return (
        <NativeBaseProvider>
            <ImageBackground

                style={{ width: width, height: height, backgroundColor: '#EEECE3' }}
            >


                <HStack mx={6} mt={4} justifyContent='space-between' alignItems='center' >
                    <Text fontSize={24} fontWeight='bold'  >???????????? ???</Text>
                    <HStack alignItems={'center'}>
                       
                        <IconButton onPress={() => navigation.goBack()}
                            ml={1} icon={<Feather name='x' size={24} />} />
                    </HStack>

                </HStack>

                <HStack mx={6} my={4} alignItems='center' >

                    <Text fontSize={'xs'} color='coolGray.400'
                        mx={3} flexWrap='wrap' flex={1}>{"foodieScore ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????foodies???"}</Text>
                </HStack>
                <FlatList mx={6} borderColor={'coolGray.200'}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={getData}
                        />
                    }
                    ListEmptyComponent={<Text textAlign={'center'} flex={1} key={888}>??????????????????</Text>}
                    style={{
                        backgroundColor: 'rgba(255,255,255,1)', borderRadius: 15
                        , borderWidth: 1
                    }}

                    data={fdlist}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => openFriendship(item.uid, item.score, index + 1)} key={index}>
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
                                    <Button style={{ margin: 5, padding: 5 }} title='?????????????????????????' />
                                }
                            </VStack>


                        </TouchableOpacity>
                    )}
                />

                <View style={{ marginBottom: 48 }}>
                    <Text textAlign={'center'} m={5} >????</Text>
                </View>
            </ImageBackground>
        </NativeBaseProvider >
    );
}

