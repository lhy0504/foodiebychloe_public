import React, { useState, useEffect, } from 'react';

import {
    StyleSheet,
    View, TextInput,
    Alert, TouchableOpacity,
    Image,
    BackHandler, useWindowDimensions
} from 'react-native';
import {
    ScrollView, HStack, IconButton, Text, Box,
    VStack, NativeBaseProvider, Avatar, Spinner
} from "native-base";
import Modal from 'react-native-modalbox';
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


/* 
Props:
-  post  (whole post)
*/

export default function StoryStack({ navigation, route }) {

    const [content, setContent] = useState(route.params.hasOwnProperty('post') ? route.params.post : null)
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [liked, setLiked] = useState(route.params.hasOwnProperty('post') && route.params.post.likes.includes(getMyUid()))
    const input = React.createRef();

    const [commentUsers, setCommentUsers] = React.useState([])
    const [comment, setComment] = useState('');
    const [author, setAuthor] = React.useState({ propic: '', name: '' })


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
        /*   navigation.navigate('StoryStackIGstyle', {
              post: content, currImg: imgIndex, openedFromStory: true
          }) */
    }
    const openStory = _openStory.bind(this);

    async function refreshPost() {
        //refresh post
        var newdata = await getPostById(route.params.hasOwnProperty('post') ? route.params.post.id : route.params.postid)
        setContent(newdata)
        setLiked(newdata.likes.includes(getMyUid()))

        console.log(newdata)

        //get writer propic and name
        var u = await getUser(newdata.userid)
        setAuthor(u)


        //get commenter propic and names
        var newStateArray = [];
        for (var i in newdata.comment) {
            var u = await getUser(newdata.comment[i].userid)
            newStateArray.push(u);
        }
        setCommentUsers(newStateArray);

    /*     // Preload images
        let preFetchTasks = [];
        content.image.forEach((p) => {
            preFetchTasks.push(Image.prefetch(p));
        });
        Promise.all(preFetchTasks) */


    }
    const doComment = async () => {
        await commentPost(content.id, comment,content.userid)
        input.current.clear()
        refreshPost()
    }

    const doLike = async () => {
        if (liked) {
            unlikePost(content.id)
            setLiked(false)
        } else {
            setLiked(true)
            likePost(content.id,content.userid)
        }
        //refresh post
        var newdata = await getPostById(content.id)
        setContent({ ...content, ...newdata })
    }
    const openLiked = () => {
        navigation.navigate('LikedStack', {
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
        navigation.navigate('PostEditorStack', {
            images: content.image,
            post: newContent,
            reeditindex: 0
        });
    }
    const askConfirmDelPost = () =>
        Alert.alert(
            "刪除貼文",
            "真的要刪除貼文嗎?",
            [
                {
                    text: "取消",
                    onPress: () => { },
                    style: "cancel",
                },
                {
                    text: "刪除", onPress: () => {
                        deletePost(content.id)
                        navigation.goBack()
                    }
                }
            ],

        );
    const openProfile = () => {
        navigation.navigate('UserProfileStack', {
            userid: content.userid
        })
    }
    var { width, height } = useWindowDimensions()

    return content != null ? (
        <NativeBaseProvider>
            {/*  Header Bar  */}
            <View style={{
                height: 50
            }}>
                <HStack alignItems='center' 
                    borderBottomWidth='1px' borderBottomColor='coolGray.300'
                    backgroundColor='white' px={2}
                >
                   
                        <IconButton onPress={() => navigation.goBack()}
                            icon={<Ionicons name="ios-chevron-back" size={24} color="black" />} />

                        <TouchableOpacity onPress={openProfile}>
                            <HStack height='50px' alignItems='center'>
                                <Image source={{ uri: author.propic }} style={{ height: 40, width: 40, borderRadius: 20 }} />
                                <Text fontWeight='bold' color='black' fontSize='sm'>  {author.name}</Text>
                            </HStack>
                        </TouchableOpacity>
                   
                </HStack>
            </View>
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
                                    color="#ff9636">編輯</Text>
                            </Box>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1 }} onPress={askConfirmDelPost}>
                            <Box style={{
                                borderColor: "#ff9636", borderRadius: 5,
                                borderWidth: 1, padding: 5, flex: 1, margin: 9

                            }}>
                                <Text textAlign='center' fontSize='sm'
                                    style={{ flex: 1 }} color="#ff9636">刪除</Text>
                            </Box>
                        </TouchableOpacity>

                    </HStack>
                }
                {/* Heading part */}
                <HStack padding={2} ml={3} >

                    <VStack flex={1}>
                        <HStack alignItems='center' mb={1}>


                            <Feather name="calendar" size={12} color="#555555" />
                            <Text ml={2} color='coolGray.500' fontSize={'sm'}>
                                {content.date}  {content.time}
                            </Text>
                        </HStack>
                        <HStack justifyContent='space-between' alignItems='center' mb={1}>
                            <LocationButton disabled
                                location={content.location}
                                place_id={content.place_id}
                                navigation={navigation} />

                            {content.overallyummy != 0 && <StarRating
                                fullStarColor='#ff9636'
                                rating={content.overallyummy}
                                starSize={20}
                            />}

                        </HStack>
                        {content.overalltitle != '' && <Text fontSize='lg' fontWeight={'bold'} >{content.overalltitle}</Text>}
                        {content.overalldescription != '' && <Text  >{content.overalldescription}</Text>}

                        {content.with[0] != '' &&
                            <HStack alignItems='center'>
                                <Feather name="users" size={16} color='#FF9636' />
                                <Text > </Text>
                                {
                                    content.with.map((item, index) => {
                                        if (index == content.with.length - 1) {
                                            return (<Text key={index} fontSize='xs' color='coolGray.500'>{item}</Text>)
                                        } else {
                                            return (<Text key={index} fontSize='xs' color='coolGray.500'>{item}{", "}</Text>

                                            )
                                        }
                                    })}
                            </HStack>
                        }

                    </VStack>
                </HStack>

                {/* Every image part */}

                {content.image.map((item, index) =>


                    <View key={index}>
                        <TouchableWithoutFeedback onPress={() => openStory(index)} >
                            <View style={{ width: width, backgroundColor: '#f0f0ed' }}>
                                <Image source={{ uri: item }} style={{
                                    height: width, width: null, flex: 1, resizeMode: 'contain',

                                }} />
                            </View>
                        </TouchableWithoutFeedback>

                        <Box px={5} mb={6}>
                            <HStack pt={1} justifyContent='space-between'>
                                <Text fontWeight='bold' fontSize='lg' color='black'>{content.title[index]}</Text>
                                {content.price[index] > 0 &&
                                    <Text color='coolGray.500'>
                                        <Feather name="dollar-sign" size={16} color="grey" />
                                        {content.price[index]}
                                    </Text>
                                }

                            </HStack>

                            {content.yummystar[index] > 0 &&

                                <HStack alignItems='center' >
                                    <Text>😋  </Text>
                                    <StarRating disabled={true} halfStar={'star-half'}
                                        starSize={15}
                                        fullStarColor='#ff9636'
                                        rating={content.yummystar[index]}

                                    />
                                </HStack>
                            }

                            <Text mt={1}>{content.description[index]}</Text>

                        </Box>
                    </View>

                )}

                <VStack px={5} >
                    {/* Rating */}
                    {(content.overallyummy > 0 ||
                        content.overallprice > 0 ||
                        content.overallenv > 0) &&
                        <Text mt={4} fontSize='lg' fontWeight='bold'>餐廳整體的...</Text>}
                    {content.overallyummy > 0 && <HStack mt={4} alignItems='center'>
                        <Text fontWeight='bold' color='coolGray.500' mr={3}>🛎️ 味道</Text>
                        <StarRating
                            fullStarColor='#ff9636'
                            rating={content.overallyummy}
                            starSize={24}
                            disabled
                        />
                    </HStack>}
                    {content.overallprice > 0 && <HStack mt={4} alignItems='center'>
                        <Text fontWeight='bold' color='coolGray.500' mr={3}>🤑 價錢</Text>
                        <StarRating
                            fullStarColor='#ff9636'
                            rating={content.overallprice}
                            disabled starSize={24}
                        />
                    </HStack>}
                    {content.overallenv > 0 && <HStack mt={4} mb={8} alignItems='center'>
                        <Text fontWeight='bold' color='coolGray.500' mr={3}>🕯️ 環境</Text>
                        <StarRating
                            fullStarColor='#ff9636'
                            rating={content.overallenv}
                            disabled starSize={24}
                        />

                    </HStack>}
                </VStack>

                {/********** Footer part ********/}
                <VStack px={5} pt={1}>
                    {content.likes.length != 0 &&
                        <TouchableOpacity onPress={() => openLiked} >
                            <Text mb={1}
                                fontWeight='bold'>{content.likes.length} 個讚好</Text>
                        </TouchableOpacity>
                    }

                    {commentUsers.map((item, index) =>
                        <Text color='black' key={index}>
                            <Text fontWeight='bold'>{item.name} </Text>
                            {content.comment[index].comment}
                        </Text>

                    )
                    }
                    <Box mb={1} />
                    {content.hashtag.map((item, index) =>
                        <Text fontWeight='bold' key={index} fontSize='xs' color='blue.400'>
                            {item}
                        </Text>
                    )}
                    <Box mb={1} />
                    <Text color='coolGray.500' fontSize='xs'>
                        <Feather name="calendar" size={12} color="#555555" />
                        {"  "}{content.date}  {content.time}
                    </Text>
                    <Box mb={4} />
                </VStack>

            </ScrollView>


            {/*  Footer Bar  */}

            <HStack alignItems='center' justifyContent='space-between'
                borderTopWidth='1px' borderTopColor='coolGray.300'
                backgroundColor='white' height={50}
                px={3}
            >
                <TouchableOpacity onPress={doLike} >
                    <AntDesign name={liked ? "like1" : "like2"} size={24} />
                </TouchableOpacity>

                <TextInput
                    style={{ marginLeft: 6 }}
                    flex={1}
                    ref={input}
                    placeholder="新增回應..."
                    defaultValue={''}
                    onChangeText={(text) => setComment(text)}
                />
                <IconButton onPress={doComment}
                    icon={<Feather name="send" size={24}
                        color={comment == '' ? "#dddddd" : 'black'} />} />
                <IconButton icon={<Feather name="share" size={24} color="black" />} />

            </HStack>


           


        </NativeBaseProvider>
    ) :
        (
            <NativeBaseProvider>
                <View style={{ alignItems: 'center', height: height, justifyContent: 'center' }}>
                    <View>
                        <Text style={{ fontFamily: 'sans-serif-light', color: 'black', marginBottom: 3 }}
                            textAlign='right'>ғᴏᴏᴅɪᴇ ʙʏ ᴄʜʟᴏᴇ🍺     </Text>
                        <Spinner />
                    </View>
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
