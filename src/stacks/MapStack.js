import React, { useState, useEffect } from 'react';
import {
    View, Dimensions, StyleSheet, Image, TextInput, Button, TouchableHighlight, ScrollView
    , TouchableOpacity
} from 'react-native';
import {
    Text, Spinner,
    VStack, NativeBaseProvider, Box, HStack, IconButton
} from "native-base";
import { Feather, AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

import { getUserPostsMonthly, getMyUid, getRestaurantsMap } from '../utils/FirebaseUtil'
import LocationPreview from './../components/LocationPreviewWebView'

import MapView from 'react-native-maps';
import { Marker, Callout } from 'react-native-maps';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

import { dishes, priceRanges } from './../consts/dishes'

var { width, height } = Dimensions.get('window')



export default function Maptab({ navigation, route }) {

    const [markers, setMarkers] = useState([])
    const [searchName, setSearchName] = useState('')
    const [searchAddress, setSearchAddress] = useState('')
    const [searchDishes, setSearchDishes] = useState(
        route.params && route.params.hasOwnProperty('dish') ? [route.params.dish] : [])

    const [searchPrice, setSearchPrice] = useState([])
    const [searchStar, setSearchStar] = useState(0)

    const [showAdvanced, setShowAdvanced] = useState(true)
    const [showTextResult, setShowTextResult] = useState(true)


    async function searchRestaurant() {
        var r = await getRestaurantsMap(searchName, searchAddress, searchDishes, searchPrice, parseFloat(searchStar))

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
        navigation.push('LocationProfileStack', {
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
    function toggleDish(dish) {

        if (searchDishes.includes(dish)) {


            var index = searchDishes.indexOf(dish);

            searchDishes.splice(index, 1);
            console.log(searchDishes)
            setSearchDishes([...searchDishes]);
        } else {


            setSearchDishes([...searchDishes, dish])
        }
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
            <HStack alignItems='center'
                borderBottomWidth={2} borderBottomColor='#ff9636'
                backgroundColor='white' height='50px' px={2}
            >
                <IconButton style={{ width: 50 }} onPress={() => navigation.goBack()}
                    icon={<Ionicons name="ios-chevron-back" size={24} color="black" />} />

                <Text fontSize={'lg'} fontWeight={'bold'}>{"搜尋餐廳"}</Text>
            </HStack>
            <VStack px={3} py={1} backgroundColor='white' borderColor='#ddd' borderWidth={1}>


                {showAdvanced &&
                    <Box>
                        <HStack alignItems={'center'} key={'as'}>
                            <Feather name={'search'} size={18} color='#999' />
                            <TextInput onChangeText={setSearchName} value={searchName} style={styles.textinput} placeholder="餐廳名稱..." />
                        </HStack>
                        <HStack alignItems={'center'} key={'asd'}>
                            <Feather name={'map-pin'} size={18} color='#999' />
                            <TextInput onChangeText={setSearchAddress} value={searchAddress} style={styles.textinput} placeholder="位置..." />
                        </HStack>
                        <HStack mt={4} justifyContent='space-between' alignItems='center' key={'asaasd'}>
                            <Text fontSize={16} fontWeight={'bold'}>按類型</Text>
                        </HStack>
                        <HStack flexWrap={'wrap'} key={'ass'}>
                            {dishes[1].children.map(item => (
                                searchDishes.indexOf(item.name) !== -1 ?
                                    <TouchableOpacity onPress={() => toggleDish(item.name)}>
                                        <Box borderWidth={1} borderColor="#c9c9c9" mx={2} px={2} my={2} borderRadius={10} justifyContent='center'
                                            alignItems={'center'}
                                            bgColor={'blue.500'}>

                                            <Text color='white'
                                            >
                                                {item.name}
                                            </Text>
                                        </Box>

                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => toggleDish(item.name)}>
                                        <Box borderWidth={1} borderColor="#c9c9c9" mx={2} px={2} my={2} borderRadius={10} justifyContent='center'
                                            alignItems={'center'}
                                        >

                                            <Text
                                            >
                                                {item.name}
                                            </Text>
                                        </Box>

                                    </TouchableOpacity>
                            ))}
                        </HStack>
                        <HStack mt={4} justifyContent='space-between' alignItems='center' key={'asf'}>
                            <Text fontSize={16} fontWeight={'bold'}>按風格</Text>
                    </HStack>
                    <HStack flexWrap={'wrap'} key={'as1'}>
                            {dishes[0].children.map(item => (
                                searchDishes.indexOf(item.name) !== -1 ?
                                    <TouchableOpacity onPress={() => toggleDish(item.name)}>
                                        <Box borderWidth={1} borderColor="#c9c9c9" mx={2} px={2} my={2} borderRadius={10} justifyContent='center'
                                            alignItems={'center'}
                                            bgColor={'blue.500'}>

                                            <Text color='white'
                                            >
                                                {item.name}
                                            </Text>
                                        </Box>

                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => toggleDish(item.name)}>
                                        <Box borderWidth={1} borderColor="#c9c9c9" mx={2} px={2} my={2} borderRadius={10} justifyContent='center'
                                            alignItems={'center'}
                                        >

                                            <Text
                                            >
                                                {item.name}
                                            </Text>
                                        </Box>

                                    </TouchableOpacity>
                            ))}
                        </HStack>
                    </Box>
                }
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
                    key={'as2'}
                />}
                {/*       {showAdvanced && <HStack alignItems={'center'} >
                    <Feather name={'star'} size={18} color='#999' />
                    <TextInput keyboardType={'numeric'} onChangeText={setSearchStar} value={searchStar} style={styles.textinput} placeholder="評分大於..." />
                </HStack>} */}
                <HStack my={2} alignItems='center' justifyContent={'space-between'} key={'as3'}>

                    <TouchableHighlight activeOpacity={1} underlayColor="#e6e6e6" onPress={toggleAdvanced}>
                        <HStack alignItems={'center'} p={2}>
                            <Feather name={showAdvanced ? 'chevron-up' : 'chevron-down'} size={18} color='#999' />
                            <Text color='#999'>{showAdvanced ? '隱藏' : " 更多"}</Text>
                        </HStack>
                    </TouchableHighlight>
                    {markers.length > 0 &&
                        <Box flex={1} ml={2}>
                            <Button onPress={() => setShowTextResult(!showTextResult)}
                                title={showTextResult ? `以地圖檢視` : `以詳細檢視`} />
                        </Box>
                    }
                    <Box flex={1} ml={2}>
                        <Button onPress={search} title={'搜尋'} color='#ff9636' />
                    </Box>
                </HStack>
            </VStack>
            {showTextResult &&
                <View style={{ flex: 5 }}>
                    <ScrollView style={{ backgroundColor: 'white' }}>

                        {markers.length == 0 ?
                            <Box flex={1} justifyContent='center' alignItems={'center'}>
                                <Text m={10}>沒有結果</Text>
                            </Box>
                            :
                            markers.map((item) => (
                                <LocationPreview location={item} navigation={navigation} />
                            ))
                        }
                    </ScrollView></View>
            }
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