import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    RefreshControl, View, ScrollView, Image, TouchableOpacity
} from 'react-native';
import {
    FlatList, HStack, IconButton, Text, Box,
    VStack, NativeBaseProvider, Button, Avatar
} from "native-base";
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
    getLocation, getUser, getAllUsers
    , getAllRestaurants
} from '../utils/FirebaseUtil'
import Post from '../components/Post'
import { getBookmarks } from '../utils/Bookmark'

import NotificationButton from './../components/NotificationButton'

const Tab = createMaterialTopTabNavigator();

function Feed(props) {

    const [data, setData] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);

    async function getData() {
        setRefreshing(true);
        var dat = (await getUser()).feed
        console.log(dat)
        dat.reverse()
        setData(dat)
        setRefreshing(false);

    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <VStack backgroundColor='white' >
            <FlatList
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={getData}
                    />
                }
                showsVerticalScrollIndicator={false}
                data={data}
                renderItem={({ item, index }) => (
                    <Post postid={item.id} index={index} navigation={props.navigation} />
                )}
            />
        </VStack>

    );
}
function FriendTileFromID(props) {

    const [data, setData] = useState(null)

    async function getData() {
        var dat = await getUser(props.id)
        setData(dat)
    }

    useEffect(() => { getData() }, [])

    const openProfile = (id) => {
        props.navigation.navigate('UserProfileStack', {
            userid: id
        })
    }

    return data ? (
        <TouchableOpacity onPress={() => openProfile(props.id)}>
            <HStack height='55px' alignItems='center'
                borderBottomColor='coolGray.100' borderBottomWidth={1}>

                <Avatar ml='15px' mr='8px' size="35px" source={{ uri: data.propic, }} />

                <VStack>
                    <Text fontSize='sm' fontWeight='bold' color='coolGray.500'>{data.name}</Text>
                    <Text color='#FF9636'>{"Joined " + data.joined}</Text>
                </VStack>

            </HStack>
        </TouchableOpacity>
    ) : <></>
}
function FriendList(props) {
    const [allusers, setAllusers] = useState([])
    const [myuser, setMyuser] = useState({ friends: [] })
    const [refreshing, setRefreshing] = React.useState(false);

    async function getData() {
        setRefreshing(true);

        var dat = await getAllUsers()
        setAllusers(dat)

        var dat = await getUser()
        setMyuser(dat)
        setRefreshing(false);
    }

    useEffect(() => { getData() }, [])

    const openProfile = (id) => {
        props.navigation.navigate('UserProfileStack', {
            userid: id
        })
    }

    return (
        <VStack backgroundColor='white' >
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={getData}
                />
            }>
                <HStack px={3} py={1} backgroundColor='coolGray.200'>
                    <Text color='coolGray.400' fontWeight={'bold'}>{"朋友"}</Text>
                </HStack>
                {myuser.friends.map((item) => (
                    <FriendTileFromID id={item} navigation={props.navigation} />
                )
                )}

                <HStack px={3} py={1} backgroundColor='coolGray.200'>
                    <Text color='coolGray.400' fontWeight={'bold'}>{"建議"}</Text>
                </HStack>

                {allusers.map((item) => (
                    <TouchableOpacity onPress={() => openProfile(item.id)}>
                        <HStack height='55px' alignItems='center'
                            borderBottomColor='coolGray.100' borderBottomWidth={1}>

                            <Avatar ml='15px' mr='8px' size="35px" source={{ uri: item.propic, }} />

                            <VStack>
                                <Text fontSize='sm' fontWeight='bold' color='coolGray.500'>{item.name}</Text>
                                <Text color='#FF9636'>{"Joined " + item.joined}</Text>
                            </VStack>

                        </HStack>
                    </TouchableOpacity>
                )
                )}
            </ScrollView>
        </VStack >

    );
}
function RestaurantTileFromID(props) {

    const [data, setData] = useState(null)

    async function getData() {
        var dat = await getLocation(props.location, props.place_id)
        console.log(dat)
        setData(dat)
    }

    useEffect(() => { getData() }, [])

    const openProfile = (location, place_id) => {
        props.navigation.navigate('LocationProfileStack', {
            location: location,
            place_id: place_id
        })
    }

    return (data ? <TouchableOpacity onPress={() => openProfile(data.name, props.place_id)}>
        <HStack height='55px' alignItems='center'
            borderBottomColor='coolGray.100' borderBottomWidth={1}>

            <Avatar ml='15px' mr='8px' size="35px" source={{ uri: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/facebook/65/clinking-beer-mugs_1f37b.png' }} />

            <VStack>
                <Text fontSize='sm' fontWeight='bold' color='coolGray.500'>{data.name}</Text>
                <Text color='#FF9636'>{data.address}</Text>
            </VStack>

        </HStack>
    </TouchableOpacity>
        : <></>
    );
}
function RestaurantList(props) {
    const [allrestaurants, setAllrestaurants] = useState([])
    const [bookmarks, setBookmarks] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);

    async function getData() {
        setRefreshing(true);

        var dat = await getAllRestaurants()
        setAllrestaurants(dat)

        var dat = await getBookmarks()
        setBookmarks(dat)
        console.log(dat)
        setRefreshing(false);
    }

    useEffect(() => { getData() }, [])

    const openProfile = (restaurant) => {
        props.navigation.navigate('LocationProfileStack', {
            location: restaurant.name,
            place_id: restaurant.place_id
        })
    }

    return (
        <VStack backgroundColor='white' >
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={getData}
                />
            }>
                <HStack px={3} py={1} backgroundColor='coolGray.200'>
                    <Text color='coolGray.400' fontWeight={'bold'}>{"書籤"}</Text>
                </HStack>
                {bookmarks.map((item) => (
                    <RestaurantTileFromID place_id={item.place_id} location={item.location} navigation={props.navigation} />
                )
                )}

                <HStack px={3} py={1} backgroundColor='coolGray.200'>
                    <Text color='coolGray.400' fontWeight={'bold'}>{"建議"}</Text>
                </HStack>

                {allrestaurants.map((item) => (
                    <TouchableOpacity onPress={() => openProfile(item)}>
                        <HStack height='55px' alignItems='center'
                            borderBottomColor='coolGray.100' borderBottomWidth={1}>

                            <Avatar ml='15px' mr='8px' size="35px" source={{ uri: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/facebook/65/clinking-beer-mugs_1f37b.png' }} />

                            <VStack>
                                <Text fontSize='sm' fontWeight='bold' color='coolGray.500'>{item.name}</Text>
                                <Text color='#FF9636'>{item.address}</Text>
                            </VStack>

                        </HStack>
                    </TouchableOpacity>
                )
                )}
            </ScrollView>
        </VStack >

    );
}
export default class HomeTab extends React.Component {

   
    render() {
    
        return (
            <NativeBaseProvider>

                {/*  Header Bar  */}
                <HStack alignItems='center' justifyContent='space-between'
                    borderBottomWidth='1px' borderBottomColor='coolGray.300'
                    backgroundColor='#f3f4f6'
                >

                    <Text ml={5} fontSize='lg' color='coolGray.500' textAlign='center'>ғᴏᴏᴅɪᴇ ʙʏ ᴄʜʟᴏᴇ🍺</Text>
                    <NotificationButton navigation={this.props.navigation} />
                </HStack>

                <Tab.Navigator
                    swipeEnabled
                    screenOptions={{
                        lazy: true,
                        tabBarLabelStyle: { fontWeight: 'bold', textTransform: "none", marginTop: -9 },
                        tabBarIndicatorStyle: { backgroundColor: '#ff9636' },
                        tabBarStyle: {
                            height: 35
                        }

                    }}
                >
                    <Tab.Screen name="看一看" component={Feed} options={{
                        swipeEnabled:false

                    }} />
                    <Tab.Screen name="朋友們" component={FriendList} />
                    <Tab.Screen name="找餐廳" component={RestaurantList} />
                </Tab.Navigator>
            </NativeBaseProvider>
        );
    }
}

