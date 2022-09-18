import React from 'react';
import { View, Dimensions, Share, ImageBackground, Image, ScrollView, RefreshControl } from 'react-native';
import {
    HStack, IconButton, Text,
    VStack, NativeBaseProvider, Box
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
    var myuser = props.user

    const [data, setData] = React.useState(myuser.friends.concat(myuser.requests))
    const [showing, setShowing] = React.useState('friends')

    const showFriend = () => {
        setData(myuser.friends.concat(myuser.requests))
        setShowing('friends')
    }
    const showRequests = () => {
        setData([...myuser.requests])
        setShowing('requests')
    }
    const showFollowing = () => {
        console.log(myuser.following)
        setData([...myuser.following])
        setShowing('following')
    }
    return (

        <VStack flex={1} justifyContent='flex-start'>
           

            <ScrollView  >
            <ScrollView horizontal >
                <TouchableOpacity onPress={showFriend}>
                    <Text m={5} fontSize={'xl'} color={showing == 'friends' ? '#ff9639' : '#c3c3c3'}
                        fontWeight={'bold'}>{"粉絲"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={showFollowing}>
                    <Text m={5} fontSize={'xl'} color={showing == 'following' ? '#ff9639' : '#c3c3c3'}
                        fontWeight={'bold'}>{"他追蹤中"}</Text>
                </TouchableOpacity>
                {myuser.requests.length != 0 && myuser.id==getMyUid()&&
                    <TouchableOpacity onPress={showRequests}>
                        <Text m={5} fontSize={'xl'} color={showing == 'requests' ? '#ff9639' : '#c3c3c3'}
                            fontWeight={'bold'}>{"追蹤請求"}</Text>
                    </TouchableOpacity>
                }
            </ScrollView>
                {data.map((item,index) => (
                    <Box backgroundColor={'#fff'}  key={showing+index} >
                        <UserPreview userid={item} navigation={props.navigation}/></Box>
                )
                )}
            </ScrollView>
        </VStack >

    );
}
export default class GalleryTab extends React.Component {


    render() {
        return (
            <NativeBaseProvider>
                <VStack backgroundColor={'white'} flex={1}>
                    {/*  Header Bar  */}
                    <View style={{
                        height: 50
                    }}>
                        <HStack alignItems='center'
                            borderBottomWidth={2} borderBottomColor='#ff9636'
                            backgroundColor='white' height='50px' px={2}
                        >
                            <HStack alignItems={'center'}>
                                <IconButton onPress={() => this.props.navigation.goBack()}
                                    icon={<Ionicons name="ios-chevron-back" size={24} color="black" />} />

                                <Text fontWeight='bold' color='black' fontSize='sm'>  {this.props.route.params.user.name}</Text>

                            </HStack>

                        </HStack>
                    </View>
                    <FriendList navigation={this.props.navigation} user={this.props.route.params.user} />
                </VStack >
            </NativeBaseProvider >

        );
    }
}

