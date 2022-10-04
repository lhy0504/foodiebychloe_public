import React from 'react';
import { View, Dimensions, Share, ImageBackground, Image, ScrollView, RefreshControl } from 'react-native';
import {
    HStack, IconButton, Text,
    VStack, NativeBaseProvider, Box, FlatList
} from "native-base";
import { Feather, Ionicons } from '@expo/vector-icons';
import { getLocation, getLocationPosts, getLocationFriendPost, getMyUid } from '../utils/FirebaseUtil'
import LocationPreview from '../components/LocationPreview'
import UserPreview from '../components/UserPreview'
import { TouchableOpacity } from 'react-native-gesture-handler';

/* 

props:
user (loaded)
*/
var { width, height } = Dimensions.get('window')
function FriendList(props) {
console.log('111',props.users)
    return (




        <FlatList
            data={props.users}
            ListEmptyComponent={<Text m={100} textAlign='center'>{"沒有結果"}</Text>}
            renderItem={({item, index}) => (
                <Box backgroundColor={'#fff'} key={index} >
                    <UserPreview user={item} navigation={props.navigation} /></Box>
            )
            }
        />


    );
}
export default class GalleryTab extends React.Component {


    render() {
        return (
            <NativeBaseProvider>
                <VStack backgroundColor={'white'} flex={1}>
                <VStack
                    borderBottomWidth={2} borderBottomColor='#ff9636'
                    alignItems={'flex-start'}
                >
                    <ImageBackground
                        source={require("./../../assets/Midnight.png")}
                        style={{ width: width, alignContent: 'flex-start' }}
                    >
                        <Box m={4}>
                            <Ionicons name="ios-chevron-back" size={24} color="white" onPress={() => this.props.navigation.goBack()} />
                        </Box>
                        <Text m={4} fontWeight='bold' fontSize='2xl' color='white' >搜尋結果</Text>
                    </ImageBackground>

                </VStack>

                    <FriendList navigation={this.props.navigation} users={this.props.route.params.users} />
                </VStack >
            </NativeBaseProvider >

        );
    }
}

