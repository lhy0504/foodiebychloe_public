import React, { useState, useEffect } from 'react';
import {
    View, Image, Dimensions, ImageBackground
} from 'react-native';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
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
import { saveToCache } from '../utils/AsyncStorageCache';
import { getTheme } from '../consts/themes';

var { width, height } = Dimensions.get('window')

/* 
Props
- postid
- navigation
(explode)
*/
export default function Post(props) {
    const [item, setItem] = useState({})
    const [liked, setLiked] = useState(false)
    const [randomViews, setRandomViews] = useState(Math.floor(Math.random() * 30) + 20
    )

    useEffect(() => {
        async function getData() {
            var p = await getPostById(props.postid)
            /* save post to cache */
            saveToCache('post:' + props.postid, p)



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
            setLiked(p.likes.includes(getMyUid()))


        }
        getData()


    }, [])

    const openStory = () => {
        props.navigation.push('StoryStack', {
            postid: props.postid, openedFromStory: false
        })
    }

    const openComment = () => {
        props.navigation.push('CommentStack', {
            item: { comment: item.comment, id: item.id, userid: item.userid, likes: item.likes }
        })
    }

    const doLike = async () => {

        if (liked) {
            setLiked(false)
            unlikePost(item.id)

            setItem({ ...item, likes: item.likes.slice(0, -1) })
        } else {

            setLiked(true)

            likePost(item.id, item.userid)
            setItem({ ...item, likes: item.likes.concat([getMyUid()]) })
            props.explode()
        }
        //refresh post
        /*  var newdata = await getPostById(item.id)
         setItem({ ...item, ...newdata }) */
    }

    const openProfile = () => {
        props.navigation.push('UserProfileStack', {
            userid: item.userid
        })
    }
    const ImageDesc = (props) => {
        return (
            <VStack backgroundColor='gray.600' pl={2} py={1}>
                <Text numberOfLines={1} px={0} fontSize='sm' color='white' textAlign={'center'}>{props.title}</Text>
                {props.yummystar > 0 &&
                    <HStack alignItems='center' justifyContent={'center'} pl={0.2}>
                        <StarRating disabled={true} halfStar={'star-half'}
                            starSize={10}
                            starStyle={{ marginRight: 2 }}
                            fullStarColor='#ff9636'
                            rating={props.yummystar}

                        />
                    </HStack>
                }
            </VStack>
        )
    }
    var theme = getTheme(item)

    return (
        item.hasOwnProperty('friends') &&
        (item.publicOrFriends == 'friends' && item.friends.includes(getMyUid())
            || item.userid == getMyUid()
            || item.publicOrFriends == 'public'
        ) && <TouchableHighlight activeOpacity={1} underlayColor="#e6e6e6" onPress={openStory}>
            <Box>

                <TouchableHighlight activeOpacity={1} underlayColor="#e6e6e6" onPress={openProfile}>
                    <HStack mt={0.5} alignItems='center' mx={5} ml={4}>
                        <Avatar m={2} size={10} source={{ uri: item.propic, }} />

                        <HStack alignItems='center' flex={1} my={.5}>
                            <Text fontSize='xs' color='coolGray.500' >{item.name}{" 給了  "}</Text>
                            {item.overallyummy != 0 && <StarRating
                                fullStarColor='#ff9636'
                                rating={item.overallscore || item.overallyummy}
                                starSize={16} disabled />}
                        </HStack>
                    </HStack>{/* '#f3f4f6' */}

                </TouchableHighlight>




                <VStack mx={6}>

                    {item.overalltitle != '' && <Text
                        fontSize={'lg'}
                        fontWeight={'bold'}
                        mb={2}
                        flexWrap='wrap'>{item.overalltitle.trim()}</Text>}

                    {item.overalldescription != '' && <Text fontSize='md'
                        numberOfLines={5} mb={2}>{item.overalldescription.trim()}</Text>}

                </VStack>
                <ImageBackground
                    style={{ height: '100%', width: width, flex: 1 }}
                    source={theme.image}

                    imageStyle={{ resizeMode: 'cover' }}
                >
                    <View style={{ flexDirection: 'row', marginTop: 8 }} >
                        {item.image.length > 1 ?
                            (<>
                                <View style={{ flex: 1, marginRight: 2, overflow: 'hidden', marginTop: 30 }}>
                                    <Image source={{ uri: item.image[0] }}
                                        style={{ height: width / 2, width: width / 2, overflow: 'hidden' }} />
                                    {/*  <ImageDesc yummystar={item.yummystar[0]} title={item.title[0]} /> */}
                                </View>

                                <View style={{ flex: 1, }}>
                                    <Image source={{ uri: item.image[1] }} style={{ height: width / 2, width: width / 2, }} />
                                    {/*   <ImageDesc yummystar={item.yummystar[1]} title={item.title[1]} /> */}

                                </View></>
                            )

                            :

                            <View style={{ flex: 1,margin:50, marginVertical:10 }}>
                                <Image source={{ uri: item.image[0] }} style={{ height: width-100, width: '100%', }} />
                              {/*   <ImageDesc yummystar={item.yummystar[0]} title={item.title[0]} /> */}
                            </View>
                        }
                    </View>
                    <HStack justifyContent='space-between' alignItems='center' px={6} my={3}>
                        <LocationButton
                            location={item.location}
                            place_id={item.place_id}
                            navigation={props.navigation} color={theme.color} />
                    </HStack>
                </ImageBackground>





                <HStack justifyContent='space-between' px={5} mb={2} mt={3}>
                    <HStack alignItems='center' mb={1}>
                        <TouchableOpacity onPress={doLike}>
                            <HStack p={1} w={16}>
                                <AntDesign name={liked ? "like1" : "like2"} size={22} color='#555' />
                                {item.likes.length != 0 &&
                                    <Text color='#555'>  {item.likes.length} </Text>}
                            </HStack>

                        </TouchableOpacity>


                        <TouchableOpacity onPress={openComment}>
                            <HStack p={1} w={16}>
                                <Ionicons name={"chatbox-outline"} size={22} color='#555' />
                                {item.comment.length != 0 &&
                                    <Text color='#555'>  {item.comment.length} </Text>}
                            </HStack>
                        </TouchableOpacity>

                        {/* Fake view */}
                        <HStack p={1} w={16}>
                            <Ionicons name={"eye-outline"} size={22} color='#555' />
                            <Text color='#555'>  {randomViews} </Text>
                        </HStack>

                    </HStack>
                    <HStack style={{ justifyContent: 'center' }}>

                        <Text color='coolGray.500' fontSize='xs' textAlign='center'>{"  "}{item.date}  {item.time}</Text>
                    </HStack>
                </HStack>



                <Box h={6} px={10} backgroundColor='#eee' />

            </Box>
        </TouchableHighlight>

    )
}
