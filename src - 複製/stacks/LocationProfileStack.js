import React from 'react';
import { View, Dimensions, Share } from 'react-native';
import {
    HStack, IconButton, Text,
    VStack, NativeBaseProvider, Box
} from "native-base";
import { Feather, Ionicons } from '@expo/vector-icons';
import { getLocation, getLocationPosts, } from '../utils/FirebaseUtil'
import * as Bookmark from '../utils/Bookmark'
import PostPreview from '../components/PostPreview'
import * as Linking from 'expo-linking';
import { TouchableOpacity } from 'react-native-gesture-handler';

var { width, height } = Dimensions.get('window')

function Header(props) {
    const onShare = async () => {
        try {
            const result = await Share.share({
                message: '我在用foodieByChloe查看' + props.data.name + '! \n位於' + props.data.address + ': ' +
                    'https://www.google.com/maps/search/?api=1&query=a&query_place_id=' + props.data.place_id,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };
    return (
        <VStack py={4} px={6} backgroundColor='orange.500' justifyContent='space-between'>
            <HStack  >

                <Text fontWeight='bold' fontSize='sm' color={'white'}>{props.data.name}</Text>
            </HStack>
            {props.data.hasOwnProperty('address') &&
                <>
                    <HStack>
                        <Text fontSize='sm' color={'white'}>{props.data.address}</Text>
                    </HStack>

                    <HStack>
                        <TouchableOpacity onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=a&query_place_id=' + props.data.place_id)}>
                            <Box px={3} py={2} my={1} backgroundColor={'blue.500'} borderRadius={4}>
                                <Text color='white' >{"在地圖開啟"}</Text>
                            </Box>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => Linking.openURL('https://www.openrice.com/zh/hongkong/restaurants?what=' + props.data.name)}>
                            <Box px={3} ml={2} py={2} my={1} backgroundColor={'yellow.400'} borderRadius={4}>
                                <Text color='coolGray.800'>{"OpenRice搜尋"}</Text>
                            </Box>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onShare}>
                            <Box ml={2} px={3} py={2} my={1} backgroundColor={'coolGray.200'} borderRadius={4}>
                                <Text color='coolGray.600' >{"分享"}</Text>
                            </Box>
                        </TouchableOpacity>
                    </HStack>

                </>
            }
            {props.data.hasOwnProperty('total') &&
                <VStack px={3} py={2} my={1} backgroundColor='orange.100' borderRadius={4}>
                    <HStack p={1}>
                        <Text mr={3} fontWeight='bold'>{"平均：" +
                            ((props.data.star5 * 5
                                + props.data.star4 * 4
                                + props.data.star3 * 3
                                + props.data.star2 * 2
                                + props.data.star1) / props.data.total).toFixed(1)}</Text>
                        <Text>{"(" + props.data.total + "條評論)"}</Text>
                    </HStack>
                    <HStack p={1}>
                        <Text mr={3} fontWeight='bold'>{"5"}</Text>
                        <Box backgroundColor='orange.300' borderRadius={4}
                            width={props.data.star5 / props.data.total * 200 + 1} />
                        <Text ml={3}>{"(" + props.data.star5 + ")"}</Text>
                    </HStack>
                    <HStack p={1}>
                        <Text mr={3} fontWeight='bold'>{"4"}</Text>
                        <Box backgroundColor='orange.300' borderRadius={4}
                            width={props.data.star4 / props.data.total * 200 + 1} />
                        <Text ml={3}>{"(" + props.data.star4 + ")"}</Text>
                    </HStack>
                    <HStack p={1}>
                        <Text mr={3} fontWeight='bold'>{"3"}</Text>
                        <Box backgroundColor='orange.300' borderRadius={4}
                            width={props.data.star3 / props.data.total * 200 + 1} />
                        <Text ml={3}>{"(" + props.data.star3 + ")"}</Text>
                    </HStack>
                    <HStack p={1}>
                        <Text mr={3} fontWeight='bold'>{"2"}</Text>
                        <Box backgroundColor='orange.300' borderRadius={4}
                            width={props.data.star2 / props.data.total * 200 + 1} />
                        <Text ml={3}>{"(" + props.data.star2 + ")"}</Text>
                    </HStack>
                    <HStack p={1}>
                        <Text mr={3} fontWeight='bold'>{"1"}</Text>
                        <Box backgroundColor='orange.300' borderRadius={4}
                            width={props.data.star1 / props.data.total * 200 + 1} />
                        <Text ml={3}>{"(" + props.data.star1 + ")"}</Text>
                    </HStack>
                </VStack>
            }


        </VStack>
    )
}
export default class GalleryTab extends React.Component {

    state = {
        posts: [],
        locationData: null,
        isBookmarked: false
    }

    async getData() {
      

        var l = await getLocation(this.props.route.params.location, this.props.route.params.place_id)
        this.setState({ ...this.state, locationData: l })

        var u = await getLocationPosts(this.props.route.params.location, this.props.route.params.place_id)
        this.setState({ ...this.state, posts: u })

        this.checkIsBookmarked()
    }

    componentDidMount() {
        this.getData()
        
    }
    checkIsBookmarked = async () => {
        console.log(this.props.route.params.place_id)
        if (this.props.route.params.place_id == undefined || this.props.route.params.place_id == '') {
            this.props.route.params.place_id = this.props.route.params.location
        }
        
        var b = await Bookmark.isBookmarked(this.props.route.params.place_id)
        this.setState({ ...this.state, isBookmarked: b })
    }

    addBookmark = async () => {
        await Bookmark.addBookmark(this.state.locationData.name, this.state.locationData.place_id)
        this.checkIsBookmarked()
    }
    removeBookmark = async () => {
        await Bookmark.removeBookmark(this.props.route.params.place_id)
        this.checkIsBookmarked()
    }
    render() {
        return (
            <NativeBaseProvider>
                {/*  Header Bar  */}

                <HStack alignItems='center' justifyContent='space-between'
                    borderBottomWidth='1px' borderBottomColor='coolGray.300'
                    backgroundColor='white' height='50px' px={2}
                >

                    <IconButton onPress={() => this.props.navigation.goBack()}
                        icon={<Ionicons name="ios-chevron-back" size={24} color="black" />} />


                    <HStack alignItems='center' >
                        <Feather name="map-pin" size={16} color='#FF9636' />
                        <Text fontWeight='bold' ml={1} fontSize='sm'>{this.props.route.params.location}</Text>
                    </HStack>


                    {this.state.isBookmarked ?
                        <IconButton onPress={this.removeBookmark} mr={2} icon={<Ionicons name="bookmark" size={24} color="black" />} />
                        :
                        <IconButton onPress={this.addBookmark} mr={2} icon={<Ionicons name="bookmark-outline" size={24} color="black" />} />
                    }

                </HStack>

                {this.state.locationData && <Header data={this.state.locationData} />}


                <PostPreview
                    navigation={this.props.navigation}
                    posts={this.state.posts}
                />

            </NativeBaseProvider>
        );
    }
}

