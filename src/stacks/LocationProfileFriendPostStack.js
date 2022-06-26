import React from 'react';
import { View, Dimensions, Share, ImageBackground, Image } from 'react-native';
import {
    HStack, IconButton, Text,
    VStack, NativeBaseProvider, Box
} from "native-base";
import { Feather, Ionicons } from '@expo/vector-icons';
import { getLocation, getLocationPosts, getLocationFriendPost } from '../utils/FirebaseUtil'
import PostPreview from '../components/PostPreview'



var { width, height } = Dimensions.get('window')

export default class GalleryTab extends React.Component {

    state = {
        posts: [],
    }

    async getData() {


        var l = await getLocationFriendPost(this.props.route.params.place_id, this.props.route.params.friendlist)
        this.setState({ ...this.state, posts: l })

    }

    componentDidMount() {
        this.getData()

    }

    render() {
        return (
            <NativeBaseProvider>
                {/*  Header Bar  */}

                <HStack alignItems='center' justifyContent='space-between'
                    borderBottomWidth={2} borderBottomColor='#ff9636'
                    backgroundColor='white' height='50px' px={2}
                >
                    <Box flex={1}  justifyContent={'flex-start'}>
                        <IconButton w={50}
                            onPress={() => this.props.navigation.goBack()}
                            icon={<Ionicons name="ios-chevron-back" size={24} color="black" />} />

                    </Box>

                    <Box justifyContent='center'>
                        <HStack alignItems='center' >
                            <Feather name="map-pin" size={16} color='#FF9636' />
                            <Text fontWeight='bold' ml={1} fontSize='sm'>{this.props.route.params.location}</Text>
                        </HStack>
                    </Box>
                    <Box flex={1}></Box>



                </HStack>

                <Text m={4} fontWeight='bold' fontSize='2xl' >{"朋友的評論"}</Text>


                <PostPreview
                    headerComponent={this.state.locationData && <Header data={this.state.locationData} />}
                    navigation={this.props.navigation}
                    posts={this.state.posts}
                    showLocation={false}
                />

            </NativeBaseProvider>
        );
    }
}

