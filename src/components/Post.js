import React, { useState, useEffect } from 'react';
import {
    View,  Image,  TouchableHighlight ,TouchableOpacity
} from 'react-native';
import {
    HStack, Text, Box,
    VStack, Avatar
} from "native-base";
import {  AntDesign, Ionicons } from '@expo/vector-icons';
import {
    getUser, getMyUid, unlikePost, likePost
    , getPostById
} from '../utils/FirebaseUtil'
import LocationButton from '../components/LocationButton'
import StarRating from 'react-native-star-rating';

import Swiper from 'react-native-swiper/src';


const delayPressIn = 200

export default function Post(props) {
    const [currIndex, setCurrIndex] = useState(0) //imageindex
    const [item, setItem] = useState(null)
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        async function getData() {
            var p = await getPostById(props.postid)
            setLiked(p.likes.includes(getMyUid()))

            /* Check block */
            var me = await getUser(undefined, false)
            if (me.block.includes(p.userid)) return
            /* check block end */
                
            var u = await getUser(p.userid,false)
            setItem({
                ...p,
                propic: u.propic,
                name: u.name,
                friends: u.friends
            });
        }
        getData()
    }, [])

    const openStory = () => {
        props.navigation.navigate('StoryStack', {
            post: item, openedFromStory: false
        })
    }

    const openComment = () => {
        props.navigation.navigate('CommentStack', {
            item: item
        })
    }

    const doLike = async () => {
        if (liked) {
            unlikePost(item.id)
            setLiked(false)
        } else {
            setLiked(true)
            likePost(item.id, item.userid)
        }
        //refresh post
        var newdata = await getPostById(item.id)
        setItem({ ...item, ...newdata })
    }

    const openProfile = () => {
        props.navigation.navigate('UserProfileStack', {
            userid: item.userid
        })
    }
    return (
        item &&
        (item.publicOrFriends == 'friends' && item.friends.includes(getMyUid())
            || item.userid == getMyUid()
            || item.publicOrFriends == 'public'
        ) && <><TouchableHighlight activeOpacity={1}underlayColor="#e6e6e6" onPress={openStory}>
            <Box>
                <HStack height='50px' alignItems='center'>
                    <TouchableOpacity onPress={openProfile}>
                        <Avatar ml='15px' mr='8px' size="35px" source={{ uri: item.propic, }} />
                    </TouchableOpacity>

                    <View style={{ justifyContent: 'center' }}>
                        <VStack>

                            {item.overalltitle != '' && <Text
                                fontWeight={'bold'}
                                numberOfLines={1}>{item.overalltitle}</Text>}
                            <HStack justifyContent='space-between' alignItems='center'>
                                <LocationButton
                                    location={item.location}
                                    place_id={item.place_id}
                                    navigation={props.navigation} />
                                <Text>{"  "}</Text>
                                {item.overallyummy != 0 && <StarRating
                                    fullStarColor='#ff9636'
                                    rating={item.overallyummy}
                                    starSize={16} />}

                            </HStack>

                        </VStack>
                    </View>

                </HStack>{/* '#f3f4f6' */}

                {item.overalldescription != '' && <Text numberOfLines={3} mx={4} mb={1}>{item.overalldescription}</Text>}
            </Box>
        </TouchableHighlight>
            <Swiper loop={false} style={{ height: 300, backgroundColor: '#f0f0ed', }}
                activeDotColor='#ff9636' showsButtons
                onIndexChanged={(indexS) => setCurrIndex(indexS)}>
                {item.image.map((itemI, indexI) => {
                    return (
                        <TouchableHighlight activeOpacity={1}underlayColor="#e6e6e6" onPress={openStory} delayPressIn={delayPressIn}>
                            <View style={{
                                height: 300, width: null
                            }}>

                                <Image source={{ uri: itemI }} style={{
                                    height: 300, width: null, flex: 1, resizeMode: 'contain'
                                }} />

                            </View>
                        </TouchableHighlight>
                    );
                })}
            </Swiper>

            <TouchableHighlight activeOpacity={1}underlayColor="#e6e6e6" onPress={openStory} >
                <Box>
                    <Box px={5} backgroundColor='#f0f0ed'>

                        {item.title[currIndex] != '' && item.title[currIndex] != undefined
                            && item.price[currIndex] > 0 && item.yummystar[currIndex] > 0 &&
                            <HStack pt={2} alignItems='center'>
                                <Text fontWeight='bold' color='black'>{item.title[currIndex]}</Text>

                                {item.price[currIndex] > 0 &&
                                    <Text fontWeight='normal' color='black'>{"   "}
                                        {"$"}
                                        {item.price[currIndex]}
                                        {"   "}
                                    </Text>}
                                {item.yummystar[currIndex] > 0 && <StarRating
                                    fullStarColor='#ff9636'
                                    rating={item.yummystar[currIndex]}
                                    starSize={16} />}
                            </HStack>}
                        {item.description[currIndex] != '' && item.description[currIndex] != undefined &&
                            <HStack ml={-1} pl={1}>
                                <Box flex={1} pl={3} mb={2} py={1} borderColor="#ff9636" borderLeftWidth={1.5}>
                                    <Text numberOfLines={6}>{item.description[currIndex]}</Text>
                                </Box>
                            </HStack>}

                    </Box>
                    <Box px={5} mb={4} mt={3}>
                        <HStack justifyContent='space-between'>
                            <HStack alignContent='center' mb={1}>
                                <TouchableOpacity onPress={doLike}>
                                    <HStack>
                                        <AntDesign name={liked ? "like1" : "like2"} size={22} color='#555' />
                                        {item.likes.length != 0 &&
                                            <Text color='#555'>  {item.likes.length} </Text>}
                                    </HStack>

                                </TouchableOpacity>

                                <Text>{"         "}</Text>
                                <TouchableOpacity onPress={() => {
                                    openComment();
                                }}>
                                    <HStack>
                                        <Ionicons name={"chatbox-outline"} size={22} color='#555' />
                                        {item.comment.length != 0 &&
                                            <Text color='#555'>  {item.comment.length} </Text>}
                                    </HStack>
                                </TouchableOpacity>

                            </HStack>
                            <HStack style={{ justifyContent: 'center' }}>
                                <TouchableHighlight activeOpacity={1}underlayColor="#e6e6e6" onPress={openProfile}>
                                    <Text fontSize='xs' color='coolGray.500' textAlign='center'>{item.name}</Text>
                                </TouchableHighlight>
                                <Text color='coolGray.500' fontSize='xs' textAlign='center'>{"  "}{item.date}  {item.time}</Text>
                            </HStack>
                        </HStack>




                    </Box>

                    {/* divider
      */}
                    <Box mt={2} mx={10} />
                    <Box mb={2} mx={10} />
                </Box>
            </TouchableHighlight>
        </>
    )
}
