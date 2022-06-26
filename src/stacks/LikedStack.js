import React, { useEffect, useState } from "react";
import {
    Dimensions, TouchableOpacity,
    StyleSheet, View, TextInput
} from 'react-native';
import {
    HStack, Text, Avatar, ScrollView, NativeBaseProvider, Box, IconButton, Spinner
} from "native-base";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import {
    commentPost, getUser, getMyUid, unlikePost, likePost
    , getPostById
} from '../utils/FirebaseUtil'

var { width, height } = Dimensions.get('window')

export default function CommentModal({ navigation, route }) {

    const [post, setPost] = useState(route.params.item)
    const input = React.createRef();
    const scrollview = React.createRef()

    const [likedUsers, setLikedUsers] = React.useState(null)

    async function refreshPost() {
        //refresh post
        var newdata = await getPostById(post.id)
        setPost(newdata)

        //get liked user propic and names
        var newStateArray = [];
        for (var i in newdata.likes) {
            var u = await getUser(newdata.likes[i])
            newStateArray.push(u);
        }
        setLikedUsers(newStateArray);

    }
    useEffect(() => {
        refreshPost()
    }, [])


    return (
        <NativeBaseProvider>
            <View style={{
                flex: 1, justifyContent: 'center', alignItems: 'center',
                margin: 40
            }}>


                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: width,
                    height: height,
                }} >
                    <TouchableWithoutFeedback
                        onPress={() => navigation.goBack()}
                    ><View style={{
                        width: width,
                        height: height,

                    }}></View></TouchableWithoutFeedback></View>

                <Box style={styles.modal3}>
                    <HStack height='50px' alignItems='center' mx={5}
                        borderBottomWidth={1} borderBottomColor='coolGray.300' >
                        <Text color='black' >Likes</Text>
                    </HStack>
                    <ScrollView ref={scrollview}>
                        {
                            likedUsers == null ?
                                <Box flex={1} justifyContent='center' alignItems='center'  >
                                    <Spinner />
                                </Box>
                                :
                                likedUsers.map((item, index) =>
                                    <HStack key={index} height='50px' alignItems='center' mx={5} >
                                        <Avatar size="35px" source={{ uri: item.propic, }} />
                                        <Text color='black' fontSize='sm'>
                                            <Text fontWeight='bold' >{"  "}{item.name}</Text></Text>
                                    </HStack>
                                )
                        }
                    </ScrollView>
                   
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
        borderRadius: 30,
        overflow: 'hidden',
        backgroundColor: 'white',
        alignSelf: 'stretch',

    },



});
