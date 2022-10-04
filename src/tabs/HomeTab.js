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

                <HStack mx={6} justifyContent={'space-between'} alignItems='center' my={5} mb={0} >
                    <VStack>
                        <Text fontSize='md' color='white' >ғᴏᴏᴅɪᴇ ʙʏ ᴄʜʟᴏᴇ🍺</Text>
                        <Text fontSize='xs' color='#ddd' fontWeight={'thin'}>選擇一間餐廳加入收藏吧！</Text>
                    </VStack>

                    <IconButton onPress={getData}
                        icon={<Feather name="refresh-cw" size={24} color='#EEECE3' />} />
                </HStack>
                <Box flex={1} justifyContent='center'>

                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                        }}  >

                        {data.map((post, index) => (
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
                        )


                        )}
                    </Animated.View>
                </Box>



            </View>


        </ImageBackground >

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


                <RandomView navigation={this.props.navigation} explode={this.explode} />
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