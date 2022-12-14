import React, { useState, useEffect, } from 'react';

import {
    StyleSheet,
    View, TextInput,
    Alert,
     FlatList, TouchableOpacity,
    BackHandler, useWindowDimensions, ImageBackground
} from 'react-native';
import {
    ScrollView, HStack, IconButton, Text, Box,
    VStack, NativeBaseProvider, Avatar, Spinner
} from "native-base";
import { Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {
    getUser, getMyUid, unlikePost, likePost
    , getPostById,
    commentPost,
    deletePost,
} from '../utils/FirebaseUtil'
import LocationButton from '../components/LocationButton'
import StarRating from 'react-native-star-rating';
import ConfettiCannon from 'react-native-confetti-cannon';
import { getTheme } from '../consts/themes';
import { getFromCache } from '../utils/AsyncStorageCache';
import Image from '../components/Image';

/* 
Props:
-  post  (whole post)

If post is undefined, will find from Cache first, then Web.
*/

export default function StoryStack({ navigation, route }) {

    const [content, setContent] = useState(route.params.hasOwnProperty('post') ? route.params.post : null)
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [liked, setLiked] = useState(route.params.hasOwnProperty('post') && route.params.post.likes.includes(getMyUid()))
    const input = React.createRef();

    const [commentUsers, setCommentUsers] = React.useState([])
    const [comment, setComment] = useState('');
    const [author, setAuthor] = React.useState({ propic: '', name: '' })

    const explosion = React.useRef(0) 

    useEffect(() => {

        // Override backbutton
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {

                navigation.goBack();
                return true;
            }
        );
        refreshPost()

        return () => backHandler.remove();


    }, []);
    const _openStory = (imgIndex) => {
        navigation.push('StoryStackIGstyle', {
            post: content, currImg: imgIndex, openedFromStory: true
        })
    }
    const openStory = _openStory.bind(this);

    async function refreshPost() {
        /* 
        Refresh logic:
        1. we load post from Cache
        2. We fetch again
        */
        var newdata
        if (route.params.hasOwnProperty('postid')) {
            newdata = await getFromCache('post:' + route.params.postid)
            setContent(newdata)
            setLiked(newdata.likes.includes(getMyUid())) 
        } else if (route.params.hasOwnProperty('post')) {
            newdata=route.params.post
            setContent(route.params.post)
            setLiked(newdata.likes.includes(getMyUid())) 
        }
        //get writer propic and name
        var u = await getUser(newdata.userid, false)
        setAuthor(u)

        // refresh up to date
       /*  newdata = await getPostById(route.params.hasOwnProperty('post') ? route.params.post.id : route.params.postid)
        setContent(newdata)
        setLiked(newdata.likes.includes(getMyUid())) */

        //get commenter propic and names
        var newStateArray = [];
        for (var i in newdata.comment) {
            var u = await getUser(newdata.comment[i].userid, false)
            newStateArray.push(u);
        }
        setCommentUsers(newStateArray);

    }
    const doComment = async () => {
        await commentPost(content.id, comment, content.userid)
        input.current.clear()
        refreshPost()
    }

    const doLike = async () => {
        if (liked) {
            unlikePost(content.id)
            setLiked(false)
        } else {
            setLiked(true)
            likePost(content.id, content.userid)
            explosion.current.start()
        }
        //refresh post
        var newdata = await getPostById(content.id)
        setContent({ ...content, ...newdata })
    }
    const openLiked = () => {
        navigation.push('LikedStack', {
            item: content
        })
    }
    const editPost = () => {
        /* 
        **** Note: drop items with timestamp to pass as params.
       
            Note: content.date is a string, no need drop
        */
        var newContent = content


        console.log(content)
        navigation.push('PostEditorStack', {
            images: content.image,
            post: newContent,
            reeditindex: 0
        });
    }
    const askConfirmDelPost = () =>
        Alert.alert(
            "????????????",
            "?????????????????????????",
            [
                {
                    text: "??????",
                    onPress: () => { },
                    style: "cancel",
                },
                {
                    text: "??????", onPress: () => {
                        deletePost(content.id)
                        navigation.goBack()
                    }
                }
            ],

        );
    const openProfile = (authorid) => {
        console.log(content)
        navigation.push('UserProfileStack', {
            userid: authorid || content.userid
        })
    }
    var { width, height } = useWindowDimensions()

    const report = () => {
        Alert.alert(
            "????????????",
            "???????????????????",
            [
                {
                    text: "??????", onPress: () => {
                        Alert.alert("????????????????????????", '?????????????????????????????????')
                    }
                },
                {
                    text: "??????",
                    onPress: () => { },
                    style: "cancel",
                },
            ],

        );
    }
    const SuggestedFoodiesView = () => {
        const [allusers, setAllusers] = useState([])
        async function getData() {
            var all = []
            for (var i of content.with) {
                var dat = await getUser(i)
                all.push(dat)
            }
            setAllusers(all)
        }
        React.useEffect(() => {
            getData()
        }, [])
        const openUserProfile = (id) => {
            navigation.push('UserProfileStack', {
                userid: id
            })
        }
        const renderUserItem = ({ item, index }) => {
            return (
                <TouchableOpacity activeOpacity={.8}
                    onPress={() => openUserProfile(item.uid)}>
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
            <Box mx={5}  >
                <HStack mt={4} justifyContent='space-between' alignItems='center' >
                    <Text fontWeight={'bold'} color={theme.color}  >?????????????????????Foodies</Text>
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

    var theme = getTheme(content)
    var isZlayout = content && content.hasOwnProperty('layout') && content.layout

    return content != null && author.name!='' ? (
        <NativeBaseProvider>
            
            {/*  Header Bar  */}
            <View style={{
                height: 50,


            }}>
                <HStack alignItems='center'
                    borderBottomWidth={2} borderBottomColor='#ff9636'
                    backgroundColor='white' height='50px' px={2}
                    justifyContent='space-between'
                >
                    <HStack alignItems='center'>
                        <IconButton onPress={() => navigation.goBack()}
                            icon={<Ionicons name="ios-chevron-back" size={24} color="black" />} />

                        <TouchableOpacity onPress={() => openProfile()}>
                            <HStack height='50px' alignItems='center'>
                                <Image source={{ uri: author.propic }} style={{ height: 40, width: 40, borderRadius: 20 }} />
                                <Text fontWeight='bold' color='black' fontSize='sm'>  {author.name}</Text>
                            </HStack>
                        </TouchableOpacity>
                    </HStack>
                    <IconButton onPress={report}
                        icon={<Ionicons name="flag-outline" size={24} color="black" />} />

                </HStack>
            </View>


            <ImageBackground
                style={{ height: '100%', width: width, flex: 1 }}
                source={theme.image}

                imageStyle={{ resizeMode: 'cover' }}
            >
                <ScrollView flex={1} >
                    {getMyUid() == content.userid &&
                        <HStack>
                            {/* Editor buttons */}
                            <TouchableOpacity style={{ flex: 1 }}
                                onPress={() => editPost()}
                            >
                                <Box style={{
                                    borderColor: "#ff9636", borderRadius: 5,
                                    borderWidth: 1, padding: 5, flex: 1, margin: 9

                                }}>
                                    <Text textAlign='center' fontSize='sm'
                                        color="#ff9636">??????</Text>
                                </Box>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex: 1 }} onPress={askConfirmDelPost}>
                                <Box style={{
                                    borderColor: "#ff9636", borderRadius: 5,
                                    borderWidth: 1, padding: 5, flex: 1, margin: 9

                                }}>
                                    <Text textAlign='center' fontSize='sm'
                                        style={{ flex: 1 }} color="#ff9636">??????</Text>
                                </Box>
                            </TouchableOpacity>

                        </HStack>
                    }
                    {/* Heading part */}
                    <HStack padding={2} mx={3} >

                        <VStack flex={1}>
                            <LocationButton disabled hideTags
                                location={content.location}
                                place_id={content.place_id}
                                navigation={navigation}
                                color={theme.color} />
                            {content.overalltitle != '' && <Text fontSize='lg' color={theme.color}
                                fontWeight={'bold'} >{content.overalltitle.trim()}</Text>}

                            {content.overalldescription != '' && <Text fontSize={'md'} color={theme.color}
                            >{content.overalldescription.trim()}</Text>}

                        </VStack>
                    </HStack>

                    {/* Every image part */}

                    {content.image.map((item, index) =>


                        <View key={index}
                            style={{
                                marginLeft: isZlayout && index % 2 == 1 ? 90 : 16,
                                marginRight: isZlayout && index % 2 == 0 ? 90 : 16,

                                marginVertical: 10
                            }}>
                            <TouchableWithoutFeedback onPress={() => openStory(index)} >
                                <View style={{
                                    width: '100%',
                                    backgroundColor: '#f0f0ed'
                                }}>
                                    <Image source={{ uri: item }} style={{
                                        width: '100%', height: width - 16 - isZlayout * 74, flex: 1,
                                    }} />
                                    {content.title.length > index && <Box width={'100%'}
                                        position='absolute'
                                        bottom={0}
                                        px={4} py={1} pb={2}
                                        backgroundColor='rgba(44,44,44,.6)'>
                                        <HStack pt={1} justifyContent='space-between' pb={1} alignItems='center'>
                                            {content.title[index] != '' &&
                                                <Text fontWeight='semibold' fontSize='lg' color='white'>{content.title[index]}</Text>
                                            }
                                            {content.price[index] > 0 &&
                                                <Text color='white'>{'$' + content.price[index]}</Text>
                                            }
                                        </HStack>

                                        {content.yummystar[index] > 0 &&
                                            <HStack alignItems='center' >
                                                <StarRating disabled={true} halfStar={'star-half'}
                                                    starSize={15}
                                                    starStyle={{ marginRight: 5 }}
                                                    fullStarColor='#ff9636'
                                                    rating={content.yummystar[index]}

                                                />
                                            </HStack>
                                        }
                                    </Box>
                                    }
                                </View>
                            </TouchableWithoutFeedback>

                            {content.description[index] != '' &&
                                <Text px={1} mt={1} mb={2} fontSize={'md'}
                                    color={theme.color}>{content.description[index]}</Text>
                            }

                        </View>

                    )}

                    <VStack mx={5} py={4} my={2} borderTopWidth={1} borderBottomWidth={1} borderColor='coolGray.300'>
                        {/* Rating */}
                        {(content.overallyummy > 0 ||
                            content.overallprice > 0 ||
                            content.overallenv > 0) &&
                            <HStack justifyContent='space-between' alignItems='center' mb={3} >
                                <LocationButton disabled
                                    location={content.location}
                                    place_id={content.place_id}
                                    navigation={navigation}
                                    color={theme.color} />

                                {/*   {content.overallyummy != 0 && <StarRating
                                fullStarColor='#ff9636'
                                rating={content.overallyummy}
                                starSize={20}
                            />} */}

                            </HStack>}
                        <HStack alignItems={'flex-end'}>
                            {content.overallscore > 0 && <VStack alignItems='center' flex={1.5} borderColor='coolGray.300'>
                                <Text fontWeight={'semibold'} color='#ff9636' fontSize={36}>{content.overallscore}</Text>
                                <Text fontWeight='bold' color='coolGray.500' >??????</Text>

                            </VStack>}
                            {content.overallyummy > 0 && <VStack alignItems='center' flex={1}>
                                <Text color='#ff9636' fontSize={28}>{content.overallyummy}</Text>
                                <Text fontWeight='bold' color='coolGray.500' >??????</Text>

                            </VStack>}

                            {content.overallyummy > 0 && <VStack alignItems='center' flex={1}>
                                <Text color='#ff9636' fontSize={28}>{content.overallenv}</Text>
                                <Text fontWeight='bold' color='coolGray.500' >??????</Text>

                            </VStack>}

                            {content.overallyummy > 0 && <VStack alignItems='center' flex={1}>
                                <Text color='#ff9636' fontSize={28}>{content.overallprice}</Text>
                                <Text fontWeight='bold' color='coolGray.500' >??????</Text>

                            </VStack>}


                        </HStack>



                    </VStack>

                    {content.with.length > 1 && <SuggestedFoodiesView />}

                    {/********** Footer part ********/}
                    <VStack px={5} pt={1}>
                        {content.likes.length != 0 &&
                            <TouchableOpacity onPress={() => openLiked} >
                                <Text mb={1} color={theme.color}
                                    fontWeight='bold'>{content.likes.length} ?????????</Text>
                            </TouchableOpacity>
                        }

                        {commentUsers.map((item, index) =>
                            <HStack key={index}>
                                <TouchableOpacity onPress={() => openProfile(item.uid)}>
                                    <Text fontWeight='bold' color={theme.color}>{item.name} </Text>
                                </TouchableOpacity>
                                <Text color={theme.color}>{content.comment[index].comment}</Text>
                            </HStack>

                        )
                        }
                        <Box mb={1} />
                        {content.hashtag.map((item, index) =>
                            <Text fontWeight='bold' key={index} fontSize='xs' color='blue.400'>
                                {item}
                            </Text>
                        )}
                        <Box mt={1} mb={4} >
                            <Text color='coolGray.500' fontSize='xs'>
                                <Feather name="calendar" size={12} color="#555555" />
                                {"  "}{content.date}  {content.time}
                            </Text>
                        </Box>

                    </VStack>
                </ScrollView>
            </ImageBackground>

            <ConfettiCannon
                count={80} fallSpeed={2000}
                origin={{ x: -10, y: 0 }}
                autoStart={false}
                fadeOut
                ref={explosion}
            />

            {/*  Footer Bar  */}

            <HStack alignItems='center' justifyContent='space-between'
                borderTopWidth='1px' borderTopColor='coolGray.300'
                backgroundColor='white' height={50}
                px={3}
            >
                <TouchableOpacity onPress={doLike} >
                    <AntDesign name={liked ? "like1" : "like2"} size={24}
                    color={liked ? "#ff9636" : "#555"}  />
                </TouchableOpacity>

                <TextInput
                    style={{ marginLeft: 6 }}
                    flex={1}
                    ref={input}
                    placeholder="????????????..."
                    defaultValue={''}
                    onChangeText={(text) => setComment(text)}
                />
                <IconButton onPress={doComment}
                    icon={<Feather name="send" size={24}
                        color={comment == '' ? "#dddddd" : 'black'} />} />
                {/*  <IconButton icon={<Feather name="share" size={24} color="black" />} /> */}

            </HStack>

          
        </NativeBaseProvider>
    ) :
        (
            <NativeBaseProvider>
                {/*  Header Bar  */}
                <View style={{
                    height: 50, 
                    position: 'absolute', top: 0

                }}>
                    <HStack alignItems='center'
                        borderBottomWidth={2} borderBottomColor='#ff9636'
                        backgroundColor='white' height='50px' px={2} width={width}

                    >

                        <IconButton onPress={() => navigation.goBack()}
                            icon={<Ionicons name="ios-chevron-back" size={24} color="black" />} />




                    </HStack>
                </View>
                <View style={{ alignItems: 'center', height: height, justifyContent: 'center' }}>

                    <Spinner />

                </View>
                {/* logo */}

            </NativeBaseProvider>

        )
}

//Styles for Modals only
const styles = StyleSheet.create({

    modal3: {
        justifyContent: 'center', //vertically
        height: 500,
        width: 300,
        borderRadius: 30,
        overflow: 'hidden',

    },



});
