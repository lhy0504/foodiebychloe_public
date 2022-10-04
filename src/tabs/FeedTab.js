import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Animated,
    RefreshControl, ImageBackground, Dimensions, Image,
} from 'react-native';
import {
    FlatList, HStack, IconButton, Text, Box,
    VStack, NativeBaseProvider, Button, Avatar, View
} from "native-base";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
    getLocation, getUser, getAllUsers
    , getAllRestaurants, getPublicPosts
} from '../utils/FirebaseUtil'
import Post from '../components/Post'
import { Feather, Ionicons, } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

import NotificationButton from './../components/NotificationButton'
import LocationButton from '../components/LocationButton';
import * as Bookmark from '../utils/Bookmark'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { saveToCache } from '../utils/AsyncStorageCache';

import ConfettiCannon from 'react-native-confetti-cannon';

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
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.2,
                        shadowRadius: 3.84,
                        elevation: 8,
                        backgroundColor: '#fff',
                        overflow: 'visible',
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
        var publicPosts = await getPublicPosts()//(await getUser()).feed
        var feed = (await getUser()).feed

        // combine sort by dates
        for (var i of feed) {
            i.postDate = i.timestamp
        }
        var combined = feed.concat(publicPosts)
        combined.sort((a, b) => b.postDate.seconds - a.postDate.seconds)

        setData(combined)
        setRefreshing(false);
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <VStack backgroundColor='white' flex={1} >
            <FlatList
                maxToRenderPerBatch={5}
                updateCellsBatchingPeriod={1000}
                initialNumToRender={2}

                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 45 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={getData}
                    />
                }
                showsVerticalScrollIndicator={false}
                data={data}
                renderItem={({ item, index }) => (
                    <Post postid={item.id} index={index} navigation={props.navigation} explode={props.explode} />
                )}
                ListHeaderComponent={
                    <SuggestedFoodiesView navigation={props.navigation} />
                }
            />
        </VStack>

    );
}


export default class HomeTab extends React.Component {
    constructor(props) {
        super(props)
        this.explosion = React.createRef(null);
    }
    explode = () => {
        this.explosion.current.start();
    };

    render() {

        return (
            <NativeBaseProvider>

                {/*  Header Bar  */}
                <HStack alignItems='center' justifyContent='space-between'
                    h={60}
                    backgroundColor='white'
                    py={2}borderBottomWidth={2} borderBottomColor='#ff9636'
                >
                    <Text ml={5} fontSize='lg' color='coolGray.600' fontWeight={'semibold'} textAlign='center'>ғᴏᴏᴅɪᴇ ʙʏ ᴄʜʟᴏᴇ🍺</Text>

                    <HStack alignItems={'center'}>
                        <Ionicons
                            name="add-circle-outline" size={24} color="black"
                            onPress={() => this.props.navigation.push('AddMediaStack')} />
                        <Box mx={4}><NotificationButton navigation={this.props.navigation} /></Box>

                    </HStack>
                </HStack>
                <Feed navigation={this.props.navigation} explode={this.explode} />
                <ConfettiCannon fadeOut
                    count={80} fallSpeed={2000}
                    origin={{ x: -10, y: 0 }}
                    autoStart={false}
                    ref={this.explosion}
                />
            </NativeBaseProvider>
        );
    }
}

const styles = StyleSheet.create({

    boxshadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 8,
        backgroundColor: '#fff',
        overflow: 'visible',
    }
});