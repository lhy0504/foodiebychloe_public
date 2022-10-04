import React from 'react';
import { View, Dimensions, Share, ImageBackground, Image, ScrollView, FlatList } from 'react-native';
import {
    HStack, IconButton, Text,
    VStack, NativeBaseProvider, Box, Spinner
} from "native-base";
import { Feather, Ionicons } from '@expo/vector-icons';
import { getUser, getLocationPosts, getLocationFriendPost } from '../utils/FirebaseUtil'
import LocationPreview from '../components/LocationPreview'


/* 

props:
title
locationIDs  OR locations
(showBookmarks)
*/
var { width, height } = Dimensions.get('window')

export default class GalleryTab extends React.Component {

    state = {
        locationIDs: null
    }
    componentDidMount() {
        if (this.props.route.params.hasOwnProperty('showBookmarks')) this.getData()
    }
    getData = async () => {

        var u = await getUser(undefined, true) // will delay
        this.setState({ locationIDs: u.bookmarks.reverse() })

    }
    render() {
        return (
            <NativeBaseProvider>
                {/*  Header Bar  */}


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
                        <Text m={4} fontWeight='bold' fontSize='2xl' color='white' >{this.props.route.params.title+'🍺'}</Text>
                    </ImageBackground>

                </VStack>

                <VStack backgroundColor='white' flex={1}>



                    {this.props.route.params.hasOwnProperty('locations') ?
                        <FlatList
                            data={this.props.route.params.locations}
                            ListEmptyComponent={<Text textAlign={'center'} m={10}>沒有結果</Text>}
                            renderItem={({ item }) => <LocationPreview location={item} navigation={this.props.navigation} />}
                        />
                        :
                        this.props.route.params.hasOwnProperty('locationIDs')
                            ?
                            <FlatList
                                data={this.props.route.params.locationIDs}
                                ListEmptyComponent={<Text textAlign={'center'} m={10}>沒有結果</Text>}
                                renderItem={({ item }) => <LocationPreview place_id={item} navigation={this.props.navigation} />}
                            />
                            :
                            this.state.locationIDs
                                ?
                                <FlatList
                                    data={this.state.locationIDs}
                                    ListEmptyComponent={<Text textAlign={'center'} m={10}>沒有結果</Text>}
                                    renderItem={({ item }) => <LocationPreview place_id={item} navigation={this.props.navigation} />}
                                />
                                :
                                <HStack justifyContent={'center'} my={10}>
                                    <Spinner />
                                </HStack>
                    }


                </VStack>
            </NativeBaseProvider >
        );
    }
}

