import React, { useState, useEffect } from 'react';
import {

    RefreshControl, ScrollView, ImageBackground, Dimensions,
} from 'react-native';
import {
    FlatList, HStack, IconButton, Text, Box,
    VStack, NativeBaseProvider, Button, Avatar
} from "native-base";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
    getLocation, getUser, getAllUsers
    , getAllRestaurants, getPublicPosts
} from '../utils/FirebaseUtil'
import Post from '../components/Post'
import LocationPreview from './../components/LocationPreview'
import UserPreview from './../components/UserPreview'
import { Feather, Ionicons, } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

import NotificationButton from './../components/NotificationButton'

const Tab = createMaterialTopTabNavigator();
var { width, height } = Dimensions.get('window')

function SuggestedFoodiesView(props) {
    const [allusers, setAllusers] = useState([])
    async function getData() {

        var dat = await getAllUsers()
        setAllusers(dat)

    }
    React.useEffect(() => {
        getData()
    }, [])
    const openUserProfile = (id) => {
        props.navigation.push('UserProfileStack', {
            userid: id
        })
    }
    const renderUserItem = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={.8}
                onPress={() => openUserProfile(item.id)}>
                <VStack width={140} h={200} borderRadius={15} overflow='hidden' mx={3.5} mr={1} my={5} px={2}
                    borderColor='#d9d9d9' borderWidth={1} alignItems='center' pt={25}
                    style={{
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 8,
                            height: 8,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 8,
                        backgroundColor: '#fff'
                    }}
                >

                    <Avatar ml='15px' mr='8px' size={45} source={{ uri: item.propic, }} />

                    <Text fontSize='md' fontWeight='bold' textAlign={'center'}>{item.name}</Text>
                    <Text fontSize={12} color='#888' mb={1}>{"("}{item.friends.length + item.requests.length}{")"}</Text>
                    <Text fontSize={12} color='#888' textAlign={'center'}>{item.status}</Text>


                </VStack>
            </TouchableOpacity>
        )
    }
    return (
        <Box backgroundColor={'coolGray.200'}>
            <HStack ml={6} mt={4} justifyContent='space-between' alignItems='center' >
                <Text fontSize={20} fontWeight={'bold'} color='#ff9639'  >為您推薦的熱門Foodies</Text>
            </HStack>

            <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                data={allusers}
                renderItem={renderUserItem}
            />
        </Box>
    )
}
function Feed(props) {

    const [data, setData] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);

    async function getData() {
        setRefreshing(true);
        var dat = await getPublicPosts()//(await getUser()).feed
        setData(dat)
        setRefreshing(false);
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <VStack backgroundColor='white' flex={1} >
            <FlatList
                style={{ flex: 1 }}
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
                ListHeaderComponent={
                    <SuggestedFoodiesView navigation={props.navigation} />
                }
            />
        </VStack>

    );
}
function FriendList(props) {
    const [allusers, setAllusers] = useState([])
    const [myuser, setMyuser] = useState({ friends: [], requests: [] })
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
        props.navigation.push('UserProfileStack', {
            userid: id
        })
    }

    return (
        <ImageBackground
            source={require("./../../assets/gallery_bg.png")}
            style={{ width: width, height: height }}
        >
            <VStack flex={1} >
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={getData}
                    />
                }>
                    {myuser.requests.length != 0 &&
                        <HStack m={5}>
                            <Text fontSize={'xl'} color='white' fontWeight={'bold'}>{"追蹤請求"}</Text>
                        </HStack>
                    }
                    {myuser.requests.map((item) => (
                        <Box borderRadius={9} m={5} my={2} py={2} overflow='hidden' backgroundColor={'#EEECE3'}>
                            <UserPreview userid={item} navigation={props.navigation} /></Box>
                    )
                    )}
                    <HStack m={5}>
                        <Text fontSize={'xl'} color='white' fontWeight={'bold'}>{"熱門foodie"}</Text>
                    </HStack>


                    {allusers.map((item, index) => (
                        <Box borderRadius={9} m={5} my={2} py={2} overflow='hidden' backgroundColor={'#EEECE3'}>
                            <UserPreview user={item} navigation={props.navigation} /></Box>
                    )
                    )}
                    <HStack m={5}>
                        <Text fontSize={'xl'} color='white' fontWeight={'bold'}>{"朋友"}</Text>
                    </HStack>

                    {myuser.friends.map((item) => (
                        <Box borderRadius={9} m={5} my={2} py={2} overflow='hidden' backgroundColor={'#EEECE3'}>
                            <UserPreview userid={item} navigation={props.navigation} /></Box>
                    )
                    )}
                    <Box m={20} />
                </ScrollView>
            </VStack >
        </ImageBackground>
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

        var dat = await getUser()
        setBookmarks(dat.bookmarks)
        setRefreshing(false);
    }

    useEffect(() => { getData() }, [])

    return (
        <ImageBackground
            source={require("./../../assets/gallery_bg.png")}
            style={{ width: width, height: height }}
        >
            <VStack flex={1}>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={getData}
                    />
                }>

                    <HStack m={5}>
                        <Text fontSize={'xl'} color='white' fontWeight={'bold'}>{"排名"}</Text>
                    </HStack>

                    {allrestaurants.map((item, index) => (
                        <Box borderRadius={9} m={5} my={2} overflow='hidden' backgroundColor={'#EEECE3'}>
                            <LocationPreview location={item} navigation={props.navigation} />
                        </Box>
                    )
                    )}
                    <HStack m={5}>
                        <Text fontSize={'xl'} color='white' fontWeight={'bold'}>{"書籤"}</Text>
                    </HStack>

                    {bookmarks.map((item) => (
                        <Box borderRadius={9} m={5} my={2} overflow='hidden' backgroundColor={'#EEECE3'}>
                            <LocationPreview place_id={item} navigation={props.navigation} />
                        </Box>
                    )
                    )}
                    <Box m={20} />
                </ScrollView>
            </VStack ></ImageBackground>

    );
}
export default class HomeTab extends React.Component {


    render() {

        return (
            <NativeBaseProvider>

                {/*  Header Bar  */}
                <HStack alignItems='center' justifyContent='space-between'
                    borderBottomWidth={2} borderBottomColor='#ff9636'
                    backgroundColor='white'
                    py={2}
                >
                    <Text ml={5} fontSize='lg' color='coolGray.600' fontWeight={'semibold'} textAlign='center'>ғᴏᴏᴅɪᴇ ʙʏ ᴄʜʟᴏᴇ🍺</Text>

                    <HStack alignItems={'center'}>
                        <Ionicons
                            name="add-circle-outline" size={24} color="black"
                            onPress={() => this.props.navigation.push('AddMediaStack')} />
                        <NotificationButton navigation={this.props.navigation} />
                    </HStack>
                </HStack>

                <Feed navigation={this.props.navigation} />
            </NativeBaseProvider>
        );
    }
}

