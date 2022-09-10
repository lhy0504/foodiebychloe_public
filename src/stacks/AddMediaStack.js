import React, { setState, useEffect } from 'react';
import { Dimensions, StyleSheet, BackHandler, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from "expo-permissions";

import {
    ScrollView, HStack, IconButton, Text, Spinner, Box,
    VStack, NativeBaseProvider, Button
} from "native-base";
import { Feather, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as ImageManipulator from 'expo-image-manipulator';


const { width, height } = Dimensions.get("window");

export default function AddMediaTab({ navigation, route }) {

    const [state, setState] = React.useState({
        multipleImages: [],
        flashmode: Camera.Constants.FlashMode.off,
        flashIconName: 'zap-off',
        loaded: true,

        isMultipleImg: false
    })
    const [permission, requestPermission] = Camera.useCameraPermissions();


    const camera = React.createRef(null);

    navigation.addListener('focus', () => {
        setState({ ...state, loaded: true });
        console.log('fc')
    });
    navigation.addListener('blur', () => {
        setState({ ...state, loaded: false });
        console.log('bl')
    });
    useEffect(async() => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        console.log(status)
        const cameraPermission = await Camera.requestPermissionsAsync();

    })

    function handleBackButtonClick() {
        if (route.params !== undefined) {
            if (route.params.hasOwnProperty('reeditindex')) {
                navigation.push('PostEditorStack', {
                    images: route.params.post.image,
                    post: route.params.post,
                    reeditindex: route.params.reeditindex,
                })
            } else {
                navigation.goBack();
            }
        } else {
            navigation.goBack();
        }

        return true;
    }

    function toggleFlash() {

        setState({
            ...state,
            flashmode: state.flashmode == Camera.Constants.FlashMode.off ?
                Camera.Constants.FlashMode.on :
                Camera.Constants.FlashMode.off,
            flashIconName: state.flashmode == Camera.Constants.FlashMode.off ?
                'zap-off' :
                'zap',
        })

    }

    async function takePicture() {
        if (camera) {
            var data = await camera.current.takePictureAsync({exif:true});
            
            /* workaround for ios wrong photo orientation */
           /*  if(data.width != data.exif.ImageWidth  ){
                console.log('oritation',data.exif.Orientation)
                data = await ImageManipulator.manipulateAsync(data.uri, 
                    [{ rotate: 0 }],   { compress: 1 });
            } */

            if (state.isMultipleImg) {

                var arr = state.multipleImages
                arr.push(data.uri)
                setState({ ...state, multipleImages: arr })
            } else {
                //single image: preserve params

                if (route.params !== undefined) {
                    if (route.params.hasOwnProperty('reeditindex')) {
                        
                        navigation.push('ImageEditorStack', {
                          uri:data.uri,
                            width:data.exif.width || data.width,
                            height:data.exif.height || data.height,
                            post: route.params.post,
                            reeditindex: route.params.reeditindex,

                        })
                    }
                } else {
                    console.log({
                        uri:data.uri,
                          width:data.exif.width || data.width,
                          height:data.exif.height || data.height,
                    })
                    navigation.push('ImageEditorStack', {
                        uri:data.uri,
                          width:data.exif.width || data.width,
                          height:data.exif.height || data.height,
                    })
                    
                }
            }
        }
    }
    function submitMultipleImage() {
        if (route.params !== undefined) {
            if (route.params.hasOwnProperty('reeditindex')) {
                navigation.push('PostEditorStack', {
                    images: state.multipleImages,
                    post: route.params.post,
                    reeditindex: route.params.reeditindex,
                })
            } else {
                navigation.push('PostEditorStack', { images: state.multipleImages })
            }
        } else {
            navigation.push('PostEditorStack', { images: state.multipleImages })
        }
    }
    function chooseFromGallery() {
        if (route.params !== undefined) {
            if (route.params.hasOwnProperty('reeditindex')) {


                navigation.replace('ImageBrowser', {
                    post: route.params.post,
                    reeditindex: route.params.reeditindex,
                });
            } else {
                navigation.replace('ImageBrowser')
            }
        }
        else {
            navigation.replace('ImageBrowser')
        }


    }
    function renderMultipleImgBtn() {
        if (route.params !== undefined) {
            if (route.params.hasOwnProperty('reeditindex')) {
                // multi pic not allowed
                return <View />
            } else {
                return (
                    state.multipleImages.length == 0 ?
                        <>
                            < IconButton onPress={() => setState({ ...state, isMultipleImg: !state.isMultipleImg })}
                                icon={< Ionicons name="ios-images" size={36} color={state.isMultipleImg ? "#ff9636" : "white"} />} />
                            <Text fontSize='xs' mt={-5} color={state.isMultipleImg ? "#ff9636" : "white"}>多圖模式</Text>
                        </>
                        :

                        <TouchableOpacity onPress={() => submitMultipleImage()}>
                            <HStack padding={2}
                                backgroundColor='white' borderRadius={18}>
                                <Box padding={2} height={36} width={36}
                                    backgroundColor={'blue.500'} borderRadius={18}
                                    alignItems='center'>
                                    <Text color='white'>{state.multipleImages.length}</Text>
                                </Box>
                                <Box padding={2} borderRadius={18}>
                                    <Text color='grey'>{">"}</Text>
                                </Box>
                            </HStack>
                        </TouchableOpacity>
                )

            }
        } else {
            return (
                state.multipleImages.length == 0 ?
                    <>
                        < IconButton onPress={() => setState({ ...state, isMultipleImg: !state.isMultipleImg })}
                            icon={< Ionicons name="ios-images" size={36} color={state.isMultipleImg ? "#ff9636" : "white"} />} />
                        <Text fontSize='xs'
                            style={{ position: 'absolute', top: 48 }}
                            color={state.isMultipleImg ? "#ff9636" : "white"}>{"多圖模式"}</Text>
                    </>
                    :
                    <TouchableOpacity onPress={() => submitMultipleImage()}>
                        <HStack padding={2}
                            backgroundColor='white' borderRadius={18}>
                            <Box padding={2} height={36} width={36}
                                backgroundColor={'blue.500'} borderRadius={18}
                                alignItems='center'>
                                <Text color='white'>{state.multipleImages.length}</Text>
                            </Box>
                            <Box padding={2} borderRadius={18}>
                                <Text color='grey'>{">"}</Text>
                            </Box>
                        </HStack>
                    </TouchableOpacity>
            )
        }

    }
    return <NativeBaseProvider>
        <Box flex={1} backgroundColor='black'>
            <StatusBar style="dark" />
            {
                state.loaded &&
                <Box flex={1}
                    style={{ borderRadius: 20, overflow: 'hidden' }}
                >
                    <Camera
                        ratio="16:9"
                        style={{flex:1}}
                        type={Camera.Constants.Type.back}

                        justifyContent='space-between' ref={camera} >
                        <View style={styles.bar}>
                            {/* <IconButton disabled icon={<Feather name="image" size={24} color="white" />} />
                                    <IconButton disabled icon={<Feather name="image" size={24} color="white" />} />
                                    <IconButton icon={<Feather name={state.flashIconName} size={24} color="white" />} /> */}
                        </View>


                    </Camera>
                    <HStack width='100%' height={100} position='absolute' bottom={0}>
                        <Box flex={1} alignItems='center'>
                            <IconButton
                                onPress={() => chooseFromGallery()}

                                icon={<Feather name="image" size={36} color="white" />} />
                        </Box>
                        <Box flex={1} alignItems='center'>
                            <TouchableOpacity onPress={() => takePicture()}>
                                <View style={styles.snapButton}>
                                    <View style={styles.innerSnapButton}>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Box>
                        <Box flex={1} alignItems='center'>


                            {renderMultipleImgBtn()}
                        </Box>
                    </HStack>
                </Box>
            }
        </Box>
        <Box position='absolute' right={5} top={5}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack()
                    }}>

                    <Feather name="x" size={40} color="white" />

                </TouchableOpacity>
            </Box>
    </NativeBaseProvider >



}
const styles = StyleSheet.create({
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    snapButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 4,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerSnapButton: {
        width: 52,
        height: 52,
        borderRadius: 25.5,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
})