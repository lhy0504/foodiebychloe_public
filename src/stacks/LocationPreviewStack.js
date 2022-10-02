import React from 'react';
import { View, Dimensions, Share, ImageBackground, Image, ScrollView } from 'react-native';
import {
    HStack, IconButton, Text,
    VStack, NativeBaseProvider, Box
} from "native-base";
import { Feather, Ionicons } from '@expo/vector-icons';
import { getLocation, getLocationPosts, getLocationFriendPost } from '../utils/FirebaseUtil'
import LocationPreview from '../components/LocationPreview'


/* 

props:
title
locationIDs  OR locations
*/
var { width, height } = Dimensions.get('window')

export default class GalleryTab extends React.Component {


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
                    <ScrollView>


                        {this.props.route.params.hasOwnProperty('locations') ?
                            this.props.route.params.locations.map((item) => (
                                <LocationPreview location={item} navigation={this.props.navigation} />
                            ))
                            :
                            this.props.route.params.locationIDs.map((item) => (
                                <LocationPreview place_id={item} navigation={this.props.navigation} />
                            )
                            )}
                            {!this.props.route.params.locations?.length
                            &&!this.props.route.params.locationIDs?.length&&
                            <Text textAlign={'center'} m={10}>沒有結果</Text>}
                    </ScrollView>
                </VStack>
            </NativeBaseProvider >
        );
    }
}

