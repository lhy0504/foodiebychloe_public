import React, { useEffect, useState } from "react";
import {
    Dimensions, TouchableOpacity,
    StyleSheet, View, TextInput
} from 'react-native';
import {
    HStack, Text, Avatar, ScrollView, NativeBaseProvider, Box, IconButton, Spinner
} from "native-base";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Feather, AntDesign } from '@expo/vector-icons';
import {
    commentPost, getUser, getMyUid, unlikePost, likePost
    , getPostById
} from '../utils/FirebaseUtil'

var { width, height } = Dimensions.get('window')

export default function CommentModal({ navigation, route }) {

    const [post, setPost] = useState(route.params.item)
    const input = React.createRef();
    const scrollview = React.createRef()

    const [commentUsers, setCommentUsers] = React.useState(null)
    const [comment, setComment] = useState('');
    const [liked, setLiked] = useState(post.likes.includes(getMyUid()))

    async function refreshPost() {
        //refresh post
        var newdata = await getPostById(post.id)
        setPost(newdata)

        
        //get commenter propic and names
        var newStateArray = [];
        for (var i in newdata.comment) {
            var u = await getUser(newdata.comment[i].userid,false)
            newStateArray.push(u);
        }
        setCommentUsers(newStateArray);

    }
    useEffect(() => {
        refreshPost()
    }, [])

    const doComment = async () => {
        await commentPost(post.id, comment, post.userid)
        input.current.clear()
        refreshPost()
    }

    const doLike = async () => {
        if (liked) {
            unlikePost(post.id)
            setLiked(false)
        } else {
            setLiked(true)
            likePost(post.id,post.userid)
        }
        //no need refresh post
    }
    const openProfile = (id) => {
        navigation.navigate('UserProfileStack', {
            userid: id
        })
    }
    return (
        <NativeBaseProvider>


            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: width,
                height: height,
                backgroundColor: '#000',
                opacity:0.5
            }} >
                <TouchableWithoutFeedback
                    onPress={() => navigation.goBack()}
                ><View style={{
                    width: width,
                    height: height,

                }}></View></TouchableWithoutFeedback>
            </View>

            <View style={{
                flex: 1, justifyContent: 'center', alignItems: 'center',
                margin: 20,
                marginTop: height * .15,
                marginBottom: height * .15
            }}>
                <Box style={styles.modal3}>
                    <HStack height='35px' alignItems='center' px={5}
                        borderBottomWidth={1} borderBottomColor='coolGray.300'
                        backgroundColor={'#6F6F71'}>

                        <Text color='#d5d3ca'  >{'留言'}</Text>
                    </HStack>
                    <ScrollView ref={scrollview}>
                        {
                            commentUsers == null ?
                                <Box flex={1} justifyContent='center' alignItems='center'  >
                                    <Spinner />
                                </Box>
                                :
                                commentUsers.map((item, index) =>
                                    <HStack key={index} my={1.5} alignItems='center' mx={3} >
                                        <TouchableOpacity onPress={() => openProfile(item.uid)}>
                                            <HStack alignItems='center' >
                                                <Avatar size={8} source={{ uri: item.propic, }} />
                                                <Text fontWeight='bold' >{"  "}{item.name}</Text>
                                            </HStack>
                                        </TouchableOpacity>
                                        <Text>{"  "}{post.comment[index].comment}</Text>
                                    </HStack>
                                )
                        }
                    </ScrollView>
                    <HStack alignItems='center' justifyContent='space-between'
                        borderTopWidth='1px' borderTopColor='coolGray.300'
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
                    </HStack>
                </Box>
            </View>
        </NativeBaseProvider>


    )

}
//Styles for Modals only
const styles = StyleSheet.create({
    modal3: {
        justifyContent: 'center', //vertically
        flex: 1,
        borderRadius: 0,
        overflow: 'hidden',
        backgroundColor: '#EEECE3',
        alignSelf: 'stretch',

    },
});
