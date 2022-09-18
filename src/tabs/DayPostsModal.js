import React from "react";
import {
    useWindowDimensions,  
    StyleSheet, View
} from 'react-native';
import {
    HStack, Text,  NativeBaseProvider, Box
} from "native-base";
import { TouchableWithoutFeedback,TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import  PostPreview from '../components/PostPreview'
import { getMyUid } from "../utils/FirebaseUtil";

/* 
props:
posts
allowAdd
*/
export default function DayPostModal({ navigation, route }) {
    
    var date = route.params.date

    const createpost = () => {
        navigation.replace('ImageBrowser', {
            reeditindex: 0,
            fromCalendar: true,
            image: [],
            post: {
                userid: getMyUid(),
                image: [],
                yummystar: [],
                title: [],
                description: [],
                price: [],
                date: date,
                location: '',
                place_id:'',
                with: [],
                tag: '',
                likes: [],
                hashtag: '',
                comment: [],

               
                
                overallprice: 0,
                overallyummy: 0,
                overallenv: 0,
                overalltitle: '',
                overalldescription: '',
                address:''
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
                backgroundColor: '#000',
                opacity:0.5
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
                        showLocation={true}
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
