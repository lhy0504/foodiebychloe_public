import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Dimensions, ScrollView, View, Image, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity } from 'react-native';
import { ImageEditor } from "expo-image-editor";
import {
    HStack, IconButton, Box,
    Text,
    Button, NativeBaseProvider
} from 'native-base';
import { Surface } from 'gl-react-expo';
import ImageFilters, { Utils } from 'react-native-gl-image-filters';
import { ImageManipulator } from 'expo-image-crop'
import { Ionicons, Feather } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import Slider from '@react-native-community/slider';

import Firebase from '../utils/FirebaseInit'
import { useAuthentication } from '../utils/UseAuth';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height

const settings = [

    {
        name: 'exposure',
        chinese: '曝光',
        minValue: -1.0,
        maxValue: 1.0,
        // step: 0.05,
    },
    {
        name: 'contrast',
        chinese: '對比',
        minValue: -10.0,
        maxValue: 10.0,
    },
    {
        name: 'saturation',
        chinese: '飽和',
        minValue: 0.0,
        maxValue: 2,
    },
    {
        name: 'brightness',
        chinese: '亮度',
        minValue: 0,
        maxValue: 5,
    },
    {
        name: 'temperature',
        chinese: '色溫',
        minValue: 0.0,
        maxValue: 20000.0,
    },


    {
        name: 'sepia',
        chinese: '懷舊',
        minValue: -2,
        maxValue: 2,
    },
    {
        name: 'hue',
        chinese: '色調',
        minValue: 0,
        maxValue: 6.3,
    },
    {
        name: 'sharpen',
        chinese: '銳化',
        minValue: 0,
        maxValue: 15,
    },
    {
        name: 'negative',
        chinese: '負片',
        minValue: -2.0,
        maxValue: 2.0,
    },
];
const originalPreset =
{
    hue: 0,
    blur: 0,
    sepia: 0,
    sharpen: 0,
    negative: 0,
    contrast: 1,
    saturation: 1,
    brightness: 1,
    temperature: 6500,
    exposure: 0,

}
const presets = [
    {
        name: '原圖',
        filter: {
        },
        image:require('../../assets/FilterPreview/Normal.jpeg')
    },
    {
        name: '鮮豔1',
        filter: {
            saturation: +.5,
        },
        image:require('../../assets/FilterPreview/Saturation1.0.jpeg')
    },  {
        name: '鮮豔2',
        filter: {
            exposure:+.5,
            saturation: +.5,
        },
        image:require('../../assets/FilterPreview/Saturation2.jpeg')
    }, {
        name: '鮮豔3',
        filter: {
            temperature:-1500,
            saturation: +.5,
        },
        image:require('../../assets/FilterPreview/Saturation3.jpeg')
    },{
        name: '懷舊',
        filter: {
            sepia: +1,
        },
        image:require('../../assets/FilterPreview/Sepia.jpeg')
    },{
        name: '藍調',
        filter: {
            sepia: -1,
        },
        image:require('../../assets/FilterPreview/Blue.jpeg')
    }
]
function styleContain(w, h, maxW = width, maxH = (height - 220 - 85)) {
    if (w > maxW) {
        h = h * maxW / w
        w = maxW
    }
    if (h > maxH) {
        w = w * maxH / h
        h = maxH
    }
    return { width: w, height: h }
}
export default function ImageEditorStack({ navigation, route }) {

    const { user } = useAuthentication();



    MediaLibrary.requestPermissionsAsync()
    const [state, setState] = useState({
        hue: 0,
        blur: 0,
        sepia: 0,
        sharpen: 0,
        negative: 0,
        contrast: 1,
        saturation: 1,
        brightness: 1,
        temperature: 6500,
        exposure: 0,
    });
    const [filterPercentage, setFilterPercentage] = useState(1)
    const [editorState, setEditorState] = useState({
        isCropperVisible: false,
        uri: route.params.uri,
        width: route.params.width,
        height: route.params.height,
        savingImage: false
    })

    const image = useRef(null);

    const toggleCropper = () => setEditorState({ ...editorState, isCropperVisible: !editorState.isCropperVisible })

    const saveImage = async () => {
        if (!image) return;
        setEditorState({ ...editorState, savingImage: true })

    };

    useEffect(async () => {
        if (editorState.savingImage) {
            const result = await image.current.glView.capture();

            if (route.params !== undefined) {
                if (route.params.hasOwnProperty('reeditindex')) {

                    var obj = route.params.post.image
                    obj[route.params.reeditindex] = result.uri

                    navigation.push('PostEditorStack', {
                        images: obj,
                        post: route.params.post,
                        reeditindex: route.params.reeditindex
                    })
                } else {
                    navigation.push('PostEditorStack', {
                        images: [result.uri]
                    })
                }
            } else {
                navigation.push('PostEditorStack', {
                    images: [result.uri]
                })
            }
        }
    }, [editorState]);

    const [currTabIndex, setCurrTabIndex] = React.useState(0)
    const filterPercentageSliderRef = React.useRef()
    const [currFilterIndex, setCurrFilterIndex] = React.useState(0);
    const useFilter = (idx, value) => {
        if (value == -999) {
            value = 1
            filterPercentageSliderRef.current.setNativeProps({ value: 1 });
        }
        setCurrFilterIndex(idx)
        var newState = {} //base

        for (var key of Object.keys(presets[idx].filter)) {
            newState[key] = originalPreset[key] + presets[idx].filter[key] * value
        }
        setState({ ...originalPreset, ...newState })
        setFilterPercentage(value)
        console.log(newState)
    }

    const filterWidth = styleContain(route.params.width, route.params.height, 110, 110).width
    const filterHeight = styleContain(route.params.width, route.params.height, 110, 110).height

    return (
        <NativeBaseProvider>
            <View style={{ flex: 1 }}>
                {/*  Header Bar  */}

                <HStack alignItems='center' justifyContent='space-between'
                   borderBottomColor='#ff9636'
                    backgroundColor='white' px={3}

                >
                    <HStack flex={1}>
                        <IconButton onPress={() => navigation.goBack()} key={1}
                            icon={<Ionicons name="ios-chevron-back" size={24} color="black" />} />
                        <IconButton key={2}
                            onPress={toggleCropper}
                            icon={<Feather name="crop" size={24} color="black" />} />
                    </HStack>
                    <Text flex={1} fontSize='lg' textAlign='center'>Edit</Text>
                    <Box flex={1} alignItems='flex-end'><IconButton
                        onPress={saveImage}
                        icon={<Feather name="send" size={24} color="black" />} />
                    </Box>
                </HStack>

                {/*  Canvas */}
                <Box flex={1} alignItems='center' justifyContent='center'>
                <Surface style={{
                        width: styleContain(route.params.width, route.params.height).width,
                        height: styleContain(route.params.width, route.params.height).height
                    }} ref={image}>
                        <ImageFilters {...state}
                            width={editorState.width}
                            height={editorState.height}
                        >
                            {{ uri: editorState.uri }}
                        </ImageFilters>

                    </Surface>  
                  {/*   <Image style={{
                        width: styleContain(route.params.width, route.params.height).width,
                        height: styleContain(route.params.width, route.params.height).height
                    }} source=   {{ uri: editorState.uri }}/> */}
                </Box>


                {/*  Pane  */}
                <View style={{
                    width: width,
                    height: 260,
                }}>
                    <View style={{ height: 210 }} backgroundColor='#e9e9e9' >
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                presets.map((item, index) => (
                                    <TouchableWithoutFeedback key={index}
                                        backgroundColor={currFilterIndex == index ? '#eeeeee' : '#e9e9e9'}
                                        onPress={() => useFilter(index, -999)}>
                                        <Box height={140}  mr={1} justifyContent='center'>
                                            <Box alignItems='center' >
                                                <Text color={currFilterIndex == index ? '#ff9636' : 'black'}
                                                    py={2}>{item.name}</Text>
                                                <Image style={{
                                                    width: 120*.8,
                                                    height: 100*.8,
                                                }} 
                                                source={item.image}
                                                />
                                                    
                                            </Box></Box>
                                    </TouchableWithoutFeedback>
                                ))
                            }

                        </ScrollView>
                        <View style={{ height: 50 }} backgroundColor='#e9e9e9' >

                            <Slider
                                ref={filterPercentageSliderRef}
                                disabled={currFilterIndex == 0}
                                style={{ flex: 1 }}
                                value={1}
                                minimumValue={0}
                                maximumValue={2}
                                onValueChange={value => useFilter(currFilterIndex, value)}
                            />
                        </View>
                    </View>

                    <HStack height={50} >

                        <Box flex={1} justifyContent='center'
                            borderBottomColor='#ff9636'
                            borderBottomWidth={currTabIndex == 0 ? 1 : 0}>
                            <TouchableOpacity
                                onPress={() => setCurrTabIndex(0)}>
                                <Text textAlign='center'
                                    color={currTabIndex == 0 ? '#ff9636' : 'black'}>濾鏡</Text>
                            </TouchableOpacity>

                        </Box>
                        <Box flex={1} justifyContent='center'
                            borderBottomColor='#ff9636'
                            borderBottomWidth={currTabIndex == 1 ? 1 : 0}>
                            <TouchableOpacity
                                onPress={() => setCurrTabIndex(1)}>
                                <Text textAlign='center'
                                    color={currTabIndex == 1 ? '#ff9636' : 'black'}>調整</Text>
                            </TouchableOpacity>

                        </Box>
                    </HStack>
                </View>

                {/* Adj Pane */}
                {currTabIndex == 1 &&
                    <ScrollView style={{
                        position: 'absolute',
                        bottom: 50,
                        backgroundColor: '#e9e9e9',
                        height: 210,
                        width: width,
                        padding: 5
                    }}>
                        {
                            settings.map((filter, index) => {
                                let defaultval = originalPreset[filter.name]
                                if (presets[currFilterIndex].filter[filter.name])
                                    defaultval = originalPreset[filter.name] +
                                        presets[currFilterIndex].filter[filter.name] * filterPercentage

                                return (
                                    <View style={styles.container} key={index}>
                                        <Text style={styles.text}>{filter.chinese}</Text>
                                        <Slider
                                            style={styles.slider}
                                            value={(defaultval - filter.minValue) / (filter.maxValue - filter.minValue)}
                                            minimumValue={0}
                                            maximumValue={1}
                                            onValueChange={value => {
                                                setState({
                                                    ...state,
                                                    [filter.name]: filter.minValue + value * (filter.maxValue - filter.minValue)
                                                })
                                            }}

                                        />
                                    </View>

                                )
                            })
                        }
                    </ScrollView>
                }

                {/*  CropperModal */}
                {editorState.isCropperVisible && <View
                    style={{
                        zIndex: 99, elevation: 99,
                        position: 'absolute', width: width, height: height
                    }}>
                    <ImageEditor
                        visible={editorState.isCropperVisible}
                        onCloseEditor={() => setEditorState({ ...editorState, isCropperVisible: false })}
                        imageUri={editorState.uri}
                        fixedCropAspectRatio={16 / 9}
                        minimumCropDimensions={{
                            width: 100,
                            height: 100,
                        }}
                        asView={true}
                        onEditingComplete={(result) => {

                            if (route.params !== undefined) {
                                if (route.params.hasOwnProperty('reeditindex')) {
                                    navigation.replace('ImageEditorStack', {
                                        post: route.params.post,
                                        reeditindex: route.params.reeditindex,
                                        ...result
                                    })


                                } else {
                                    navigation.replace('ImageEditorStack', result)
                                }
                            } else {
                                navigation.replace('ImageEditorStack', result)
                            }
                        }}
                        mode="full"
                    />
                </View>
                }

                {/*  <ImageManipulator
                photo={{ uri: editorState.uri }}
                isVisible={editorState.isCropperVisible}
                onToggleModal={toggleCropper}
                onPictureChoosed={({ uri: uriM }) => {
                    Image.getSize(uriM, (w, h) => {
                        if (route.params !== undefined) {
                            if (route.params.hasOwnProperty('reeditindex')) {
                                navigation.replace('ImageEditorStack', {
                                    post: route.params.post,
                                    reeditindex: route.params.reeditindex,
                                    uri: uriM, width: w, height: h
                                })
                            } else {
                                navigation.replace('ImageEditorStack', { uri: uriM, width: w, height: h })
                            }
                        } else {
                            navigation.replace('ImageEditorStack', { uri: uriM, width: w, height: h })
                        }
                    })
                }}
            /> */}
            </View>
        </NativeBaseProvider>
    );

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 300,
        paddingLeft: 20,
        padding: 15
    },
    text: { textAlign: 'center' },
    slider: { width: 200 },
});