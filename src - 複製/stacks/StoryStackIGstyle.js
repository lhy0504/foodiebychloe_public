import React, { useState, useEffect, } from 'react';
import { Animated } from "react-native";

import {
    StyleSheet,
    View,
    Dimensions,
    TouchableOpacity,
    Image,
    BackHandler,
    StatusBar,
} from 'react-native';
import {
    HStack, IconButton, Text,
    VStack, NativeBaseProvider
} from "native-base";
import {
    getPublicPosts, getUser, getMyUid, unlikePost, likePost
    , getPostById
} from '../utils/FirebaseUtil'
import StarRating from 'react-native-star-rating';

import Gallery from 'react-native-image-gallery';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';



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
        navigation.navigate('CommentStack', {
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

            <View style={{
                zIndex: 1, // works on ios
                elevation: 1,
                position: 'absolute',
                top: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
            }}>

                <TouchableOpacity
                    onPress={() => {
                        close();
                    }}>
                    <Feather name="x" size={20} color="white" />
                </TouchableOpacity>
            </View >

        </NativeBaseProvider >
    );
}
