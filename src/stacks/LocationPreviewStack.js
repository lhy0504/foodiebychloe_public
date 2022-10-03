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

                            <Text fontWeight='bold' color='black' fontSize='sm'>  {this.props.route.params.title}</Text>

                        </HStack>

                    </HStack>
                </View>
                <VStack backgroundColor='white' flex={1}>
                    <Text m={4} fontWeight='bold' fontSize='2xl' >{this.props.route.params.title}</Text>



                    {this.props.route.params.hasOwnProperty('locations') ?
                        <FlatList
                            data={this.props.route.params.locations}
                            ListEmptyComponent={ <Text textAlign={'center'} m={10}>沒有結果</Text>}
                            renderItem={({ item }) => <LocationPreview location={item} navigation={this.props.navigation} />}
                        />
                        :
                        this.props.route.params.hasOwnProperty('locationIDs')
                            ?
                            <FlatList
                                data={this.props.route.params.locationIDs}
                                ListEmptyComponent={ <Text textAlign={'center'} m={10}>沒有結果</Text>}
                                renderItem={({ item }) => <LocationPreview place_id={item} navigation={this.props.navigation} />}
                            />
                            :
                            this.state.locationIDs
                                ?
                                <FlatList
                                    data={this.state.locationIDs}
                                    ListEmptyComponent={ <Text textAlign={'center'} m={10}>沒有結果</Text>}
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

