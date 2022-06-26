import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Image, TextInput, Button, TouchableHighlight } from 'react-native';
import {
    Text, Spinner,
    VStack, NativeBaseProvider, Box, HStack
} from "native-base";
import { Feather, AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

import { getUserPostsMonthly, getMyUid, getRestaurantsMap } from '../utils/FirebaseUtil'
import LocationPreview from './../components/LocationPreview'

import MapView from 'react-native-maps';
import { Marker, Callout } from 'react-native-maps';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';


var { width, height } = Dimensions.get('window')

const dishes = [
    {
        name: '菜式',
        id: 0,
        children: [{
            name: '中式', id: '中式',
        },
        {
            name: '港式', id: '港式',
        },
        {
            name: '日式', id: '日式',
        },
        {
            name: '台式', id: '台式',
        },
        {
            name: '韓式', id: '韓式',
        },
        {
            name: '泰式', id: '泰式',
        },
        {
            name: '西式', id: '西式',
        },
        {
            name: '多國菜', id: '多國菜'
        }],
    },
    {
        name: '類型',
        id: 1,
        children: [
            {
                name: '自助餐', id: '自助餐',
            },
            {
                name: '壽司', id: '壽司',
            },
            {
                name: '火鍋', id: '火鍋',
            },
            {
                name: '甜品', id: '甜品',
            },
            {
                name: 'Fine Dining', id: 'Fine Dining',
            },
            {
                name: '燒烤', id: '燒烤',
            },
            {
                name: '海鮮', id: '海鮮',
            },
            {
                name: 'All Day Breakfast', id: 'All Day Breakfast',
            },
            {
                name: '飲品', id: '飲品',
            },
            {
                name: '健康', id: '健康',
            },

        ]
    }
];

const priceRanges = [
    {
        name: '0-50',
        id: '0-50',
    },
    {
        name: '50-100',
        id: '50-100',
    },
    {
        name: '100-200',
        id: '100-200',
    },
    {
        name: '200-300',
        id: '200-300',
    },
    {
        name: '300-400',
        id: '300-400',
    },
    {
        name: '400-800',
        id: '400-800',
    },
    {
        name: '800+',
        id: '800+',
    }
];

export default function Maptab({ navigation, route }) {

    const [markers, setMarkers] = useState([])
    const [searchName, setSearchName] = useState('')
    const [searchAddress, setSearchAddress] = useState('')
    const [searchDishes, setSearchDishes] = useState([])
    const [searchPrice, setSearchPrice] = useState([])
    const [searchStar, setSearchStar] = useState(0)

    const [showAdvanced, setShowAdvanced] = useState(false)

    async function searchRestaurant() {
        console.log(searchName, searchAddress, searchDishes, searchPrice, searchStar)
        var r = await getRestaurantsMap(searchName, searchAddress, searchDishes, searchPrice,parseFloat( searchStar))

        //preload image
        for (var i in r) {
            console.log(r[i].pic)
            if (r[i].hasOwnProperty('pic')) Image.prefetch(r[i].pic);
        }
        setMarkers(r)
    }
    useEffect(() => {
        searchRestaurant()
    }, [])

    function openProfile(location, place_id) {
        navigation.navigate('LocationProfileStack', {
            location: location,
            place_id: place_id
        })
    }
    function search() {
        setShowAdvanced(false)
        searchRestaurant()
    }
    function toggleAdvanced() {
        setShowAdvanced(!showAdvanced)
    }
    function openPreview() {
        let locationIDs = markers.map(a => a.id);

        navigation.navigate('LocationPreviewStack',
            {
                title:'搜尋結果',
                locationIDs:locationIDs
        })
    }
    return (
        <NativeBaseProvider>

            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 22.31602196882954,
                        longitude: 114.17262206798632,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {markers.map((marker, index) => (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: marker.lat,
                                longitude: marker.long,
                            }}

                        >
                            <Callout tooltip={true} onPress={() => openProfile(marker.name, marker.place_id)}>
                                <LocationPreview location={marker} navigation={navigation} />
                            </Callout>
                        </Marker>
                    ))}
                </MapView>
            </View>

            <VStack m={5} px={3} py={1} backgroundColor='white' borderRadius={10} borderColor='#ddd' borderWidth={1}>
                {/*  <Text fontSize={'lg'} fontWeight={'bold'}>{"搜尋餐廳 (測試中)"}</Text> */}
                <HStack alignItems={'center'} >
                    <Feather name={'search'} size={18} color='#999' />
                    <TextInput onChangeText={setSearchName} value={searchName} style={styles.textinput} placeholder="餐廳名稱..." />
                </HStack>
                <HStack alignItems={'center'} >
                    <Feather name={'map-pin'} size={18} color='#999' />
                    <TextInput onChangeText={setSearchAddress} value={searchAddress} style={styles.textinput} placeholder="位置..." />
                </HStack>
                {showAdvanced && <SectionedMultiSelect
                    items={dishes}
                    IconRenderer={MaterialIcons}
                    uniqueKey="id"
                    subKey="children"
                    selectText="菜式..."
                    showDropDowns={true}
                    expandDropDowns={true}
                    readOnlyHeadings={true}
                    onSelectedItemsChange={setSearchDishes}
                    selectedItems={searchDishes}
                />}
                {showAdvanced && <SectionedMultiSelect
                    items={priceRanges}
                    IconRenderer={MaterialIcons}
                    uniqueKey="id"
                    subKey="children"
                    selectText="人均消費..."
                    showDropDowns={true}
                  
                    readOnlyHeadings={false}
                    onSelectedItemsChange={setSearchPrice}
                    selectedItems={searchPrice}
                />}
                {showAdvanced && <HStack alignItems={'center'} >
                    <Feather name={'star'} size={18} color='#999' />
                    <TextInput keyboardType={'numeric'} onChangeText={setSearchStar} value={searchStar} style={styles.textinput} placeholder="評分大於..." />
                </HStack>}
                <HStack my={2} alignItems='center' justifyContent={'space-between'}>

                    <TouchableHighlight activeOpacity={1} underlayColor="#e6e6e6" onPress={toggleAdvanced}>
                        <HStack alignItems={'center'} p={2}>
                            <Feather name={showAdvanced ? 'chevron-up' : 'chevron-down'} size={18} color='#999' />
                            <Text color='#999'>{showAdvanced ? '隱藏' : " 更多"}</Text>
                        </HStack>
                    </TouchableHighlight>
                    {markers.length > 0 &&
                        <Box flex={1} ml={2}>
                            <Button onPress={openPreview} title={`找到${markers.length}間餐廳`}  />
                        </Box>
                    }
                    <Box flex={1} ml={2}>
                        <Button onPress={search} title={'搜尋'} color='#ff9636' />
                    </Box>
                </HStack>
            </VStack>
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