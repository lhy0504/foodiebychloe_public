import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Image, TextInput, Button, TouchableHighlight, ImageBackground } from 'react-native';
import {
    Text, Spinner, IconButton, Avatar,
    VStack, NativeBaseProvider, Box, HStack, ScrollView, FlatList
} from "native-base";
import { Feather, AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

import { getAllRestaurants, getMyUid, getRestaurantsMap, getAllUsers } from '../utils/FirebaseUtil'
import { TouchableOpacity } from 'react-native-gesture-handler';

import { dishes } from './../consts/dishes'


var { width, height } = Dimensions.get('window')

export default function Maptab({ navigation, route }) {

    const [allrestaurants, setAllrestaurants] = useState([])
    const [bookmarks, setBookmarks] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);
    const [allusers, setAllusers] = useState([])

    async function getData() {
        setRefreshing(true);

        var dat = await getAllRestaurants()
        setAllrestaurants(dat)

        var dat = await getAllUsers()
        setAllusers(dat)

        var dat = await getUser()
        setBookmarks(dat.bookmarks)
        setRefreshing(false);
    }
    React.useEffect(() => {
        getData()
    }, [])
    function openProfile(location, place_id) {
        navigation.push('LocationProfileStack', {
            location: location,
            place_id: place_id
        })
    }
    function openMapStack() {
        navigation.push('MapStack')
    }
    const openUserProfile = (id) => {
        navigation.push('UserProfileStack', {
            userid: id
        })
    }
    const searchByDish = (dish) => {
        console.log(dish)
        navigation.push('MapStack', {
          dish:dish
        })
    }
    const renderRestaurantItem = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={.8}
                onPress={() => openProfile(item.name, item.place_id)}>
                <Box width={200} h={250} borderRadius={15} overflow='hidden' mx={3.5} mr={1} my={5}
                    borderColor='#d9d9d9' borderWidth={1}
                    style={{
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 8,
                            height: 8,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 8,
                        backgroundColor: '#fff'
                    }}
                >
                    <ImageBackground
                        style={{ width: 200, height: 250 }}
                        source={{
                            uri: item.pic ||
                                'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/facebook/65/clinking-beer-mugs_1f37b.png'
                        }}
                        imageStyle={{ borderRadius: 6 }}
                    >
                        <Text position={'absolute'}
                            bottom={110} fontSize={36} marginLeft={4}
                            style={{
                                textShadowColor: 'rgba(0, 0, 0, 0.5)',
                                textShadowOffset: { width: -1, height: 1 },
                                textShadowRadius: 10
                            }}
                            color='white'>{index + 1}</Text>
                        <VStack position={'absolute'} bottom={0} left={0} width={200} h={110}
                            backgroundColor='rgba(44,44,44, 0.8)' px={4} py={2}>



                            <Text color={'#ff9639'} lineHeight={20} numberOfLines={2}
                                fontWeight='bold' fontSize={16}>{item.name}</Text>
                            {item.hasOwnProperty('tag') && item.tag.length > 0 &&
                                <Text mt={.5} color='white'>{item.tag.join(' / ')}
                                    {item.hasOwnProperty('price') && " / $" + item.price}
                                </Text>
                            }
                            {item.hasOwnProperty('average') &&
                                <HStack mt={1}>
                                    <Feather name='star' style={{ marginRight: 8 }} color='white' size={20} />
                                    <Text color='white' fontWeight='bold'>{(item.average).toFixed(1)}</Text>
                                    <Text color='white'>{"  (" + item.total + ")"}</Text>
                                </HStack>}
                        </VStack>

                    </ImageBackground>
                </Box>
            </TouchableOpacity>
        )
    }
    const renderUserItem = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={.8}
                onPress={() => openUserProfile(item.id)}>
                <VStack width={140} h={200} borderRadius={15} overflow='hidden' mx={3.5} mr={1} my={5} px={2}
                    borderColor='#d9d9d9' borderWidth={1} alignItems='center' pt={25}
                    style={{
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 8,
                            height: 8,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 8,
                        backgroundColor: '#fff'
                    }}
                >

                    <Avatar ml='15px' mr='8px' size={45} source={{ uri: item.propic, }} />

                    <Text fontSize='md' fontWeight='bold' >{item.name}</Text>
                    <Text fontSize={12} color='#888' mb={1}>{"("}{item.friends.length + item.requests.length}{")"}</Text>
                    <Text fontSize={12} color='#888' textAlign={'center'}>{item.status}</Text>


                </VStack>
            </TouchableOpacity>
        )
    }
    return (
        <NativeBaseProvider>
            <ScrollView
                flex={1}
                showsVerticalScrollIndicator={false}
                automaticallyAdjustsScrollIndicatorInsets
            >
                <HStack mx={6} mt={4} justifyContent='space-between' alignItems='center' >
                    <Text fontSize={24} fontWeight='bold'  >探索</Text>
                    <IconButton style={{ width: 50 }} onPress={openMapStack}
                        icon={<Ionicons name="search" size={24} color="black" />} />
                </HStack>

                <HStack ml={6} mt={4} justifyContent='space-between' alignItems='center' >
                    <Text fontSize={20} fontWeight={'bold'} color='#ff9639'  >一周熱門</Text>
                </HStack>

                <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={allrestaurants}
                    renderItem={renderRestaurantItem}
                />

                <HStack ml={6} mt={4} justifyContent='space-between' alignItems='center' >
                    <Text fontSize={16} fontWeight={'bold'}  >按類型</Text>
                </HStack>
                <HStack flexWrap={'wrap'} mx={6}>
                    {dishes[1].children.map(item => (
                        <TouchableOpacity onPress={()=>searchByDish(item.name)}>
                            <Text borderRadius={10} borderWidth={1} borderColor="#c9c9c9" mx={2} px={2} my={2}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </HStack>
                <HStack ml={6} mt={4} justifyContent='space-between' alignItems='center' >
                    <Text fontSize={20} fontWeight={'bold'} color='#ff9639'  >熱門Foodies</Text>
                </HStack>

                <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={allusers}
                    renderItem={renderUserItem}
                />

                <Box h={50} />
            </ScrollView>
        </NativeBaseProvider>
    );
}


const styles = StyleSheet.create({

    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    textinput: {
        flex: 1,
        padding: 2,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        margin: 4
    }
});