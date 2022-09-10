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
import YummyRankView from '../components/YummyRankView';
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
        navigation.push('StoryStackIGstyle', {
            post: content, currImg: imgIndex, openedFromStory: true
        })
    }
    const openStory = _openStory.bind(this);

    async function refreshPost() {
        //refresh post
        var newdata = await getPostById(route.params.hasOwnProperty('post') ? route.params.post.id : route.params.postid)
        setContent(newdata)
        setLiked(newdata.likes.includes(getMyUid()))

        //get writer propic and name
        var u = await getUser(newdata.userid, false)
        setAuthor(u)

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
    const openProfile = (authorid ) => {
        console.log(content)
        navigation.push('UserProfileStack', {
            userid: authorid || content.userid 
        })
    }
    var { width, height } = useWindowDimensions()

    const report = () => {
        Alert.alert(
            "檢舉貼文",
            "要檢舉貼文嗎?",
            [
                {
                    text: "檢舉", onPress: () => {
                        Alert.alert("已檢舉貼文，謝謝", '我們會檢查貼文和其作者')
                    }
                },
                {
                    text: "取消",
                    onPress: () => { },
                    style: "cancel",
                },
            ],

        );
    }
    return content != null ? (
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

                        <TouchableOpacity onPress={()=>openProfile()}>
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
           {/*  <Box backgroundColor={'#ff9636'} width={width} height={.5}/> */}
            <ScrollView flex={1}  >



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

                        {content.overalltitle != '' && <Text fontSize='lg' fontWeight={'bold'} >{content.overalltitle.trim()}</Text>}
                        {content.overalldescription != '' && <Text fontSize={'md'} >{content.overalldescription.trim()}</Text>}

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
                            <View style={{ width: width - 32, marginLeft: 16, marginRight: 16, backgroundColor: '#f0f0ed' }}>
                                <Image source={{ uri: item }} style={{
                                    height: width, width: '100%', flex: 1,
                                }} />
                                {content.title.length > index && <Box width={'100%'}
                                    position='absolute'
                                    bottom={0}
                                    px={4} py={1} pb={2}
                                    backgroundColor='rgba(44,44,44,.6)'>
                                    <HStack pt={1} justifyContent='space-between' pb={1} alignItems='center'>
                                        <Text fontWeight='semibold' fontSize='lg' color='white'>{content.title[index]}</Text>
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
                        <Box mb={8}>
                            {content.description[index] &&
                                <Text px={4} mt={1} mb={2} fontSize={'md'}>{content.description[index]}</Text>
                            }
                        </Box>
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
                                navigation={navigation} />

                            {/*   {content.overallyummy != 0 && <StarRating
                                fullStarColor='#ff9636'
                                rating={content.overallyummy}
                                starSize={20}
                            />} */}

                        </HStack>}
                    <HStack>
                        {content.overallyummy > 0 && <VStack alignItems='center' flex={1}>
                            <Text fontWeight={'semibold'} color='#ff9636' fontSize={36}>{content.overallyummy}</Text>
                            <Text fontWeight='bold' color='coolGray.500' >味道</Text>

                        </VStack>}

                        {content.overallyummy > 0 && <VStack alignItems='center' flex={1}>
                            <Text fontWeight={'semibold'} color='#ff9636' fontSize={36}>{content.overallenv}</Text>
                            <Text fontWeight='bold' color='coolGray.500' >環境</Text>

                        </VStack>}

                        {content.overallyummy > 0 && <VStack alignItems='center' flex={1}>
                            <Text fontWeight={'semibold'} color='#ff9636' fontSize={36}>{content.overallprice}</Text>
                            <Text fontWeight='bold' color='coolGray.500' >抵食</Text>

                        </VStack>}
                    </HStack>


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
                        <HStack key={index}>
                            <TouchableOpacity onPress={() => openProfile(item.id)}>
                                <Text fontWeight='bold' >{item.name} </Text>
                            </TouchableOpacity>
                            <Text>{content.comment[index].comment}</Text>
                        </HStack>

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
                {/*  <IconButton icon={<Feather name="share" size={24} color="black" />} /> */}

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
