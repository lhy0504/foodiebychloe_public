import React, {  useState, useEffect } from 'react';
import {
    
    RefreshControl,  ScrollView,  TouchableOpacity
} from 'react-native';
import {
    FlatList, HStack, IconButton, Text, Box,
    VStack, NativeBaseProvider, Button, Avatar
} from "native-base";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
    getLocation, getUser, getAllUsers
    , getAllRestaurants,getPublicPosts
} from '../utils/FirebaseUtil'
import Post from '../components/Post'
import LocationPreview from './../components/LocationPreview'
import UserPreview from './../components/UserPreview'

import NotificationButton from './../components/NotificationButton'

const Tab = createMaterialTopTabNavigator();

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
                style={{flex:1}}
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
function FriendList(props) {
    const [allusers, setAllusers] = useState([])
    const [myuser, setMyuser] = useState({ friends: [],requests:[] })
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
                {myuser.requests.length != 0 && <HStack px={3} py={1} backgroundColor='coolGray.200'>
                    <Text color='coolGray.400' fontWeight={'bold'}>{"追蹤請求"}</Text>
                </HStack>
                }
                {myuser.requests.map((item) => (
                    <UserPreview userid={item} navigation={props.navigation} />
                )
                )}

                <HStack px={3} py={1} backgroundColor='coolGray.200'>
                    <Text color='coolGray.400' fontWeight={'bold'}>{"熱門foodie"}</Text>
                </HStack>

                {allusers.map((item,index) => (
                   <UserPreview user={item} navigation={props.navigation} />
                )
                )}
                <HStack px={3} py={1} backgroundColor='coolGray.200'>
                    <Text color='coolGray.400' fontWeight={'bold'}>{"朋友"}</Text>
                </HStack>
                {myuser.friends.map((item) => (
                    <UserPreview userid={item} navigation={props.navigation} />
                )
                )}
                 <Box m={20} />
            </ScrollView>
        </VStack >

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
                    <Text color='coolGray.400' fontWeight={'bold'}>{"建議"}</Text>
                </HStack>

                {allrestaurants.map((item,index) => (
                     <LocationPreview location={item}  navigation={props.navigation} />
                )
                )}
                 <HStack px={3} py={1} backgroundColor='coolGray.200'>
                    <Text color='coolGray.400' fontWeight={'bold'}>{"書籤"}</Text>
                </HStack>
                {bookmarks.map((item) => (
                    <LocationPreview place_id={item}  navigation={props.navigation} />
                )
                )}
                <Box m={20} />
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
                        /* swipeEnabled:false */

                    }} />
                    <Tab.Screen name="朋友們" component={FriendList} />
                    <Tab.Screen name="找餐廳" component={RestaurantList} />
                </Tab.Navigator>
            </NativeBaseProvider>
        );
    }
}

