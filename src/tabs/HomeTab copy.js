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
                    <Post postid={item.id} index={index} navigation={props.navigation} explode={props.explode}/>
                )}
                ListHeaderComponent={
                    <SuggestedFoodiesView navigation={props.navigation} />
                }
            />
        </VStack>

    );
}
function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}
function RandomView(props) {

    const [data, setData] = useState([])
    const [bookmarkedArray, setBookmarkedArray] = useState([0, 0, 0])
    const [refreshing, setRefreshing] = React.useState(false);
    const explosion = useRef()
    const [fadeAnim] = useState(new Animated.Value(0));


    const tabBarHeight = useBottomTabBarHeight();
    async function getData() {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500, useNativeDriver: true
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500, useNativeDriver: true
            })]).start();
        setRefreshing(true);
        var dat = getRandom(await getPublicPosts(), 3)//(await getUser()).feed
        setData(dat)
        setBookmarkedArray([0, 0, 0])

        /* save to cache for smooth navigation */
        for (var i of dat) {
            /* save post to cache */
            saveToCache('post:' + i.id, i)
        }
        setRefreshing(false);

    }
    const addBookmark = (name, id, index) => {
        props.explode()
        setTimeout(getData, 1400)

        Bookmark.addBookmark(name, id)
        var newarr = [...bookmarkedArray]
        newarr[index] = 1
        setBookmarkedArray(newarr)


    }
   
    useEffect(() => {
        getData()
    }, [])

    return (

        <ImageBackground
            source={require("./../../assets/gallery_bg.png")}
            style={{ flex: 1 }}
        >


            <View style={{ flex: 1, paddingBottom: tabBarHeight }}>
                <HStack mx={5} justifyContent={'space-between'} alignItems='center'>
                    <Text fontSize={18} color='white' textAlign={'center'}
                        my={5} mb={3} >選擇一間餐廳加入收藏吧！</Text>
                    <IconButton onPress={getData}
                        icon={<Feather name="refresh-cw" size={24} color='#EEECE3' />} />
                </HStack>
                <Animated.View
                    style={{
                        flex: 1,
                        opacity: fadeAnim,
                    }}  >


                    <FlatList
                        data={data}
                        renderItem={({ item: post, index }) => (
                            <TouchableOpacity activeOpacity={.7}
                                onPress={() => props.navigation.push('StoryStack', { postid: post.id, currImg: 0 })} >
                                <VStack
                                    borderRadius={9} m={5} my={2} overflow='hidden' 
                                 backgroundColor={'#EEECE3'}>
                                    <HStack p={3} pointerEvents="none" >
                                        <Image source={{ uri: post.image[0] }} style={{ height: 85, width: 85, }} resizeMode='cover' />

                                        <VStack ml={3} flex={1}>

                                            <HStack justifyContent='space-between' alignItems='center' >
                                                {post.overalltitle != '' ?
                                                    <Text fontSize={'md'} fontWeight={'bold'}
                                                        flexWrap='wrap' flex={1}
                                                        numberOfLines={2}
                                                    >{post.overalltitle.trim()}</Text>
                                                    :
                                                    <View />
                                                }
                                            </HStack>
                                            <LocationButton disabled
                                                fontSize='sm'
                                                location={post.location}
                                                place_id={post.place_id}
                                                navigation={props.navigation}
                                                color={'black'} />
                                        </VStack>
                                    </HStack>

                                    <TouchableOpacity onPress={() => addBookmark(post.location, post.place_id, index)}>
                                        <HStack alignItems={'center'} pl={5}
                                            borderTopWidth={1} borderColor='coolGray.400' p={3} py={2}
                                            backgroundColor={bookmarkedArray[index] ? "#3cb043" : "transparent"}
                                            borderBottomRadius={9}>
                                            <Ionicons
                                                name={bookmarkedArray[index] ? "ios-checkmark" : "bookmark-outline"} size={24}
                                                color={bookmarkedArray[index] ? "white" : "black"}
                                            />
                                            <Text color={bookmarkedArray[index] ? "white" : "coolGray.800"}> 加入我的收藏</Text>
                                        </HStack>
                                    </TouchableOpacity>
                                </VStack>
                            </TouchableOpacity>
                        )}


                    />


                </Animated.View>

            </View>

           
        </ImageBackground >

    );
}
export default class HomeTab extends React.Component {
constructor(props){
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
                    h={50}
                    backgroundColor='white'
                    py={2}
                >
                    <Text ml={5} fontSize='lg' color='coolGray.600' fontWeight={'semibold'} textAlign='center'>ғᴏᴏᴅɪᴇ ʙʏ ᴄʜʟᴏᴇ🍺</Text>

                    <HStack alignItems={'center'}>
                        <Ionicons
                            name="add-circle-outline" size={24} color="black"
                            onPress={() => this.props.navigation.push('AddMediaStack')} />
                        <Box mx={4}><NotificationButton navigation={this.props.navigation} /></Box>

                    </HStack>
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
                    <Tab.Screen name="看一看" children={()=><RandomView navigation={this.props.navigation} explode={this.explode}/>}
                   />
                    <Tab.Screen name="朋友們" children={()=><Feed navigation={this.props.navigation} explode={this.explode}/>} />
                </Tab.Navigator>

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