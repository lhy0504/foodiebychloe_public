import React, { useState, useEffect } from 'react';
import {
    View, Image, TouchableHighlight, TouchableOpacity, Dimensions
} from 'react-native';
import {
    HStack, Text, Box,
    VStack, Avatar
} from "native-base";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import {
    getUser, getMyUid, unlikePost, likePost
    , getPostById
} from '../utils/FirebaseUtil'
import LocationButton from '../components/LocationButton'
import StarRating from 'react-native-star-rating';

import Swiper from 'react-native-swiper/src';


var { width, height } = Dimensions.get('window')
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

            var u = await getUser(p.userid, false)
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
        ) && <><TouchableHighlight activeOpacity={1} underlayColor="#e6e6e6" onPress={openStory}>
            <Box>
                <HStack mt={2}>
                    <TouchableOpacity onPress={openProfile}>
                        <Avatar m={2} ml={3} size={10} source={{ uri: item.propic, }} />
                    </TouchableOpacity>

                    <View style={{ flexShrink: 1 }}>

                        <HStack alignItems='center' flex={1}>
                            <TouchableHighlight activeOpacity={1} underlayColor="#e6e6e6" onPress={openProfile}>
                                <Text fontSize='xs' color='coolGray.500' mr={1}>{item.name}{" 給了 "}</Text>
                            </TouchableHighlight>

                            {item.overallyummy != 0 && <StarRating
                                fullStarColor='#ff9636'
                                rating={item.overallyummy}
                                starSize={16} />}

                        </HStack>

                        {item.overalltitle != '' && <Text
                            fontSize={'lg'}
                            fontWeight={'bold'}
                            flex={1}
                            flexWrap='wrap'>{item.overalltitle}</Text>}


                    </View>

                </HStack>{/* '#f3f4f6' */}

                {item.overalldescription != '' && <Text  fontSize='sm'
                    numberOfLines={3} mx={3} mb={2}>{item.overalldescription}</Text>}


                <View style={{ flexWrap: 'wrap', flexDirection: 'row' , margin:-2}} >
                    {item.image.length > 2 ?
                        item.image.map(
                            img => (<View style={{ flexBasis: '33%', padding: 2 }}>
                                <Image source={{ uri: img }} style={{ height: width / 3, width: '100%', }} />
                            </View>
                            )
                        )
                        :
                        item.image.map(
                            img => (<View style={{ flex:1 , padding: 2 }}>
                                <Image source={{ uri: img }} style={{ height: width / item.image.length , width: '100%', }} />
                            </View>
                            )
                        )}
                </View>

                <HStack justifyContent='space-between' alignItems='center' px={4} mt={2}>
                    <LocationButton
                        location={item.location}
                        place_id={item.place_id}
                        navigation={props.navigation} />
                </HStack>

                <Box>

                    <Box px={5} mb={2} mt={4}>
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

                                <Text color='coolGray.500' fontSize='xs' textAlign='center'>{"  "}{item.date}  {item.time}</Text>
                            </HStack>
                        </HStack>




                    </Box>

                    {/* divider
      */}

                    <Box h={6} px={10} backgroundColor='#eee' />
                </Box>
            </Box>
        </TouchableHighlight>
        </>
    )
}
