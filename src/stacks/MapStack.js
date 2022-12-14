import React, { useState, useEffect } from 'react';
import {
    View, Dimensions, StyleSheet,  TextInput, Button,  ScrollView
    , 
} from 'react-native';
import Image from '../components/Image';

import { TouchableHighlight,TouchableOpacity } from 'react-native-gesture-handler';
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

    //hide if have route params
    const [showAdvanced, setShowAdvanced] = useState(!route.params)
    const [showTextResult, setShowTextResult] = useState( route.params && route.params.hasOwnProperty('dish'))


    async function searchRestaurant() {
        console.log(searchPrice)
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
    function toggleMap() {
        setShowAdvanced(false)
        setShowTextResult(!showTextResult)

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
                            key={marker.place_id}
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

                <Text fontSize={'lg'} fontWeight={'bold'}>{"????????????"}</Text>
            </HStack>
            <VStack px={3} py={1} backgroundColor='white' borderColor='#ddd' borderWidth={1}>


                {showAdvanced &&
                    <Box>
                        <HStack alignItems={'center'} key={'as'}>
                            <Feather name={'search'} size={18} color='#999' />
                            <TextInput onChangeText={setSearchName} value={searchName} style={styles.textinput} placeholder="????????????..." />
                        </HStack>
                        <HStack alignItems={'center'} key={'asd'}>
                            <Feather name={'map-pin'} size={18} color='#999' />
                            <TextInput onChangeText={setSearchAddress} value={searchAddress} style={styles.textinput} placeholder="??????..." />
                        </HStack>
                        <HStack mt={4} justifyContent='space-between' alignItems='center' key={'asaasd'}>
                            <Text fontSize={16} fontWeight={'bold'}>?????????</Text>
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
                            <Text fontSize={16} fontWeight={'bold'}>?????????</Text>
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
                    selectText="????????????..."
                    showDropDowns={true}

                    readOnlyHeadings={false}
                    onSelectedItemsChange={setSearchPrice}
                    selectedItems={searchPrice}
                    key={'as2'}
                />}
                {/*       {showAdvanced && <HStack alignItems={'center'} >
                    <Feather name={'star'} size={18} color='#999' />
                    <TextInput keyboardType={'numeric'} onChangeText={setSearchStar} value={searchStar} style={styles.textinput} placeholder="????????????..." />
                </HStack>} */}
                <HStack my={2} alignItems='center' justifyContent={'space-between'} key={'as3'}>

                    <TouchableHighlight activeOpacity={1} underlayColor="#e6e6e6" onPress={toggleAdvanced}>
                        <HStack alignItems={'center'} p={2}>
                            <Feather name={showAdvanced ? 'chevron-up' : 'chevron-down'} size={18} color='#999' />
                            <Text color='#999'>{showAdvanced ? '??????' : " ??????"}</Text>
                        </HStack>
                    </TouchableHighlight>
                    {markers.length > 0 &&
                        <Box flex={1} ml={2}>
                            <Button onPress={toggleMap}
                                title={showTextResult ? `???????????????` : `???????????????`} />
                        </Box>
                    }
                    <Box flex={1} ml={2}>
                        <Button onPress={search} title={'??????'} color='#ff9636' />
                    </Box>
                </HStack>
            </VStack>
            {showTextResult &&
                <View style={{ flex: 5 }}>
                    <ScrollView style={{ backgroundColor: 'white' }}>

                        {markers.length == 0 ?
                            <Box flex={1} justifyContent='center' alignItems={'center'}>
                                <Text m={10}>????????????</Text>
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