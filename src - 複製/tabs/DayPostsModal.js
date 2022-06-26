import React, { useEffect, useState } from "react";
import {
    useWindowDimensions, TouchableOpacity, Image,
    StyleSheet, View, TextInput
} from 'react-native';
import {
    HStack, Text, VStack, ScrollView, NativeBaseProvider, Box, IconButton, Spinner, FlatList
} from "native-base";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import  PostPreview from '../components/PostPreview'


var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export default function DayPostModal({ navigation, route }) {
    
    var date = route.params.date

    const createpost = () => {
        navigation.replace('ImageBrowser', {
            reeditindex: 0,
            fromCalendar: true,
            image: [],
            post: {
                userid: getAuth().currentUser.email,
                image: [],
                yummystar: [],
                title: [],
                description: [],
                price: [],
                date: date,
                location: '',
                place_id:'',
                with: '',
                tag: '',
                likes: [],
                hashtag: '',
                comment: [],

               
                
                overallprice: 0,
                overallyummy: 0,
                overallenv: 0,
                overalltitle: '',
                overalldescription:''
            }
        })
    }

    var { width, height } = useWindowDimensions()
    return (
        <NativeBaseProvider>
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: width,
                height: height,
            }} >
                <TouchableWithoutFeedback
                    onPress={() => navigation.goBack()}
                >
                    <View style={{
                        width: width,
                        height: height,
                    }}></View>
                </TouchableWithoutFeedback>
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

                        <Text color='#d5d3ca'  >{date.split("/").join(".")}</Text>
                    </HStack>
                    
                    <PostPreview
                        navigation={navigation}
                        posts={route.params.posts}
                        
                    />

                    {route.params.allowAdd  && <TouchableOpacity onPress={createpost}  >
                        <HStack alignItems='center' justifyContent='center'
                            borderTopWidth='1px' borderTopColor='coolGray.300' height={50}
                            px={3} >
                            <Feather name={"plus"} size={24} />
                        </HStack>
                    </TouchableOpacity>}
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
