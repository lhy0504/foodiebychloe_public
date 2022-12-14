import React, { useState, useEffect, } from 'react';
import { Animated } from "react-native";

import {
    StyleSheet,
    View,
    Dimensions,
    TouchableOpacity,
    
    BackHandler,
    StatusBar,
} from 'react-native';
import Image from '../components/Image';

import {
    HStack, IconButton, Text, Box,
    VStack, NativeBaseProvider
} from "native-base";
import {
    getPublicPosts, getUser, getMyUid, unlikePost, likePost
    , getPostById
} from '../utils/FirebaseUtil'
import StarRating from 'react-native-star-rating';

import Gallery from 'react-native-image-gallery';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
const { width } = Dimensions.get('window');


export default function StoryStack({ navigation, route }) {

    const [content, setContent] = useState(route.params.post)
    const [currImgId, setCurrImgId] = useState(route.params.currImg)
    const [liked, setLiked] = useState(route.params.post.likes.includes(getMyUid()))


    const [visibility, setVisibility] = useState(new Animated.Value(0))
    const [isMenuVisible, setIsMenuVisible] = useState(1)// 0 or 1
    const toggleDescription = () => {
        setIsMenuVisible(1 - isMenuVisible)// toggle 0 or 1

        Animated.timing(
            visibility,
            {
                useNativeDriver: true,
                toValue: isMenuVisible,
                duration: 250,
            }
        ).start();
    }

    useEffect(() => {
        // Fade in animation
        toggleDescription();

        // Preload images
        let preFetchTasks = [];
        content.image.forEach((p) => {
            console.log(p)
            preFetchTasks.push(Image.prefetch(p));
        });
        Promise.all(preFetchTasks)


        // Override backbutton
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                navigation.goBack();
                return true;
            }
        );
        return () => backHandler.remove();


    }, []);

    const _openStory = () => {
        if (route.params.openedFromStory) {
            navigation.goBack()
        } else {
            navigation.replace('StoryStack', { post: content, currImg: 0 })
        }
    }
    const openStory = _openStory.bind(this);

    function close() {
        navigation.goBack();
    }

    const openComment = () => {
        navigation.push('CommentStack', {
            item: content
        })
    }

    const doLike = async () => {
        if (liked) {
            unlikePost(content.id)
            setLiked(false)
        } else {
            setLiked(true)
            likePost(content.id)
        }
        //no need refresh
    }

    return (
        <NativeBaseProvider>
            <StatusBar backgroundColor="#000000" barStyle="light-content" />
            <Gallery
                initialPage={route.params.currImg}
                onPageSelected={(e) => {
                    setCurrImgId(e)
                }}
                style={{
                    flex: 1,
                    backgroundColor: 'black',
                }}
                images={content.image.map((item) => { return { source: { uri: item } } })}
                onSingleTapConfirmed={() => toggleDescription()}
            >

            </Gallery>

            <Animated.View style={{
                zIndex: 1, // works on ios
                elevation: 1,
                width: width,
                position: 'absolute',
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                opacity: visibility,
            }}>

                {/********** Start of Description Pane ********/}
                <VStack padding={2} mx={2} mt={1}>




                    <HStack justifyContent='space-between'>
                        <Text fontWeight='semibold' color='white' fontSize={'md'}>{content.title[currImgId]}    {content.price[currImgId] != 0 &&
                            content.price[currImgId] > 0 && '$' + content.price[currImgId]}</Text>
                    </HStack>
                    <VStack>

                        {content.yummystar[currImgId] != 0 &&

                            <HStack alignItems='center' >

                                <StarRating disabled={true} iconSet='FontAwesome' halfStar={'star-half'}
                                    emptyStar={''}
                                    starSize={15}
                                    starStyle={{ marginRight: 5 }}
                                    fullStarColor='#ff9636'
                                    rating={content.yummystar[currImgId]}
                                    containerStyle={{ marginTop: 6, marginBottom: 6 }}
                                />
                            </HStack>
                        }

                    </VStack>

                </VStack>
                <HStack mt={1} mx={3} borderTopWidth={1} borderTopColor='coolGray.500' />
                <HStack py={2} >
                    <TouchableOpacity
                        style={{ alignItems: 'center', flex: 1, }}
                        onPress={doLike}
                    >

                        <HStack alignItems='center' h={30}>
                            <AntDesign name={liked ? "like1" : "like2"}
                                size={16}
                                color={liked ? "#ff9636" : "white"} />
                            <Text ml={2} color={liked ? "#ff9636" : "white"} >
                                {"??????"}</Text>
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{  alignItems: 'center', flex: 1, }}

                        onPress={openComment}>

                        <HStack alignItems='center' h={30}>
                            <Feather name="message-square" size={16} color="white" />
                            <Text ml={1} color="white"  >
                                ??????</Text>
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{  alignItems: 'center', flex: 1, }}
                        onPress={() => openStory()}>
                        {route.params.openedFromStory ?
                            <HStack alignItems='center' h={30}>
                                <Ionicons name="ios-return-up-back" size={16} color="white" />
                                <Text ml={1} color="white" fontSize='xs' >
                                    ????????????</Text>
                            </HStack>
                            :
                            <HStack alignItems='center'>
                                <Feather name="align-left" size={16} color="white" />
                                <Text ml={1} color="white" fontSize='xs' >
                                    ????????????</Text>
                            </HStack>
                        }

                    </TouchableOpacity>

                </HStack>

                {/********** End of Description Pane ********/}

            </Animated.View >
            <Box position='absolute' right={5} top={5}>
                <TouchableOpacity
                    onPress={() => {
                        close();
                    }}>

                    <Feather name="x" size={40} color="white" />

                </TouchableOpacity>
            </Box>
        </NativeBaseProvider >
    );
}
