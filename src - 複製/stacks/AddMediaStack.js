import React, { setState, useEffect } from 'react';
import { Dimensions, StyleSheet,BackHandler, View, TouchableOpacity, StatusBar } from 'react-native';
import { Camera } from 'expo-camera';
import {
    ScrollView, HStack, IconButton, Text, Spinner, Box,
    VStack, NativeBaseProvider, Button
} from "native-base";
import { Feather, Ionicons } from '@expo/vector-icons';

const {width,height} = Dimensions.get("window");

export default class AddMediaTab extends React.Component {

    state = {
        multipleImages: [],
        flashmode: Camera.Constants.FlashMode.off,
        flashIconName: 'zap-off',
        loaded: true,

        isMultipleImg: false
    }
    constructor(props) {
        super(props);

        this.camera = React.createRef(null);

        props.navigation.addListener('focus', () => {
            this.setState({ ...this.state, loaded: true });
        });
        props.navigation.addListener('blur', () => {
            this.setState({ ...this.state, loaded: false });
        });
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.permisionFunction()
        
    }
     permisionFunction = async () => {
        // here is how you can get the camera permission
        const cameraPermission = await Camera.requestPermissionsAsync();
    }
    /* componentWillMount() {
        if (this.props.route.params !== undefined) {
            if (this.props.route.params.hasOwnProperty('reeditindex')) {
                BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

            }
        }
    }
    componentWillUnmount() {
        if (this.props.route.params !== undefined) {
            if (this.props.route.params.hasOwnProperty('reeditindex')) {
                BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

            }
        }
    } */
    handleBackButtonClick() {
        if (this.props.route.params !== undefined) {
            if (this.props.route.params.hasOwnProperty('reeditindex')) {
                this.props.navigation.navigate('PostEditorStack', {
                    images:this.props.route.params.post.image,
                    post: this.props.route.params.post,
                    reeditindex: this.props.route.params.reeditindex,
                })
            } else {
                this.props.navigation.goBack();
            }
        } else {
            this.props.navigation.goBack();
        }
        
        return true;
    }

    toggleFlash() {

        this.setState({
            ...this.state,
            flashmode: this.flashmode == Camera.Constants.FlashMode.off ?
                Camera.Constants.FlashMode.on :
                Camera.Constants.FlashMode.off,
            flashIconName: this.flashmode == Camera.Constants.FlashMode.off ?
                'zap-off' :
                'zap',
        })

    }

    async takePicture() {
        if (this.camera) {
            const data = await this.camera.current.takePictureAsync(null);
            if (this.state.isMultipleImg) {

                var arr = this.state.multipleImages
                arr.push(data.uri)
               this.setState({...this.state,multipleImages:arr})
            } else {
                //single image: preserve params

                if (this.props.route.params !== undefined) {
                    if (this.props.route.params.hasOwnProperty('reeditindex')) {
                        this.props.navigation.navigate('ImageEditorStack', {
                            ...data,
                            post: this.props.route.params.post,
                            reeditindex: this.props.route.params.reeditindex,

                        })
                    }
                } else {
                    this.props.navigation.navigate('ImageEditorStack', data)
                }
            }
        }
    }
    submitMultipleImage() {
        if (this.props.route.params !== undefined) {
            if (this.props.route.params.hasOwnProperty('reeditindex')) {
                this.props.navigation.navigate('PostEditorStack', {
                    images: this.state.multipleImages,
                    post: this.props.route.params.post,
                    reeditindex: this.props.route.params.reeditindex,
                })
            }else {
                this.props.navigation.navigate('PostEditorStack', { images: this.state.multipleImages })
            }
        } else {
            this.props.navigation.navigate('PostEditorStack', { images: this.state.multipleImages })
        }
    }
    chooseFromGallery() {
        if (this.props.route.params !== undefined) {
            if (this.props.route.params.hasOwnProperty('reeditindex')) {


                this.props.navigation.replace('ImageBrowser', {
                    post: this.props.route.params.post,
                    reeditindex: this.props.route.params.reeditindex,
                });
            } else {
                this.props.navigation.replace('ImageBrowser')
            }
        }
        else {
            this.props.navigation.replace('ImageBrowser')
        }


    }
    renderMultipleImgBtn() {
        if (this.props.route.params !== undefined) {
            if (this.props.route.params.hasOwnProperty('reeditindex')) {
                // multi pic not allowed
                return <View />
            } else {
                return (
                    this.state.multipleImages.length == 0 ?
                        <>
                            < IconButton onPress={() => this.setState({ ...this.state, isMultipleImg: !this.state.isMultipleImg })}
                                icon={< Ionicons name="ios-images" size={36} color={this.state.isMultipleImg ? "#ff9636" : "white"} />} />
                            <Text fontSize='xs' mt={-5} color={this.state.isMultipleImg ? "#ff9636" : "white"}>多圖模式</Text>
                        </>
                        :

                        <TouchableOpacity onPress={() => this.submitMultipleImage()}>
                            <HStack padding={2}
                                backgroundColor='white' borderRadius={18}>
                                <Box padding={2} height={36} width={36}
                                    backgroundColor={'blue.500'} borderRadius={18}
                                    alignItems='center'>
                                    <Text color='white'>{this.state.multipleImages.length}</Text>
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
                this.state.multipleImages.length == 0 ?
                    <>
                        < IconButton onPress={() => this.setState({ ...this.state, isMultipleImg: !this.state.isMultipleImg })}
                            icon={< Ionicons name="ios-images" size={36} color={this.state.isMultipleImg ? "#ff9636" : "white"} />} />
                        <Text fontSize='xs' color={this.state.isMultipleImg ? "#ff9636" : "white"}>多圖模式</Text>
                    </>
                    :
                    <TouchableOpacity onPress={()=>this.submitMultipleImage()}>
                        <HStack padding={2}
                            backgroundColor='white' borderRadius={18}>
                            <Box padding={2} height={36} width={36}
                                backgroundColor={'blue.500'} borderRadius={18}
                                alignItems='center'>
                                <Text color='white'>{this.state.multipleImages.length}</Text>
                            </Box>
                            <Box padding={2} borderRadius={18}>
                                <Text color='grey'>{">"}</Text>
                            </Box>
                        </HStack>
                    </TouchableOpacity>
            )
        }

    }
    render() {
        return (
            <NativeBaseProvider>
                <Box flex={1} backgroundColor='black'>
                    <StatusBar
                        animated={true}
                        backgroundColor="#000"
                        barStyle="light-content"
                    />
                    {
                        this.state.loaded &&
                        <Box height={height}
                            width='100%'
                            style={{ borderRadius: 20, overflow: 'hidden' }}>
                            <Camera
                                ratio="16:9"
                                height={height}
                                width='100%'


                                justifyContent='space-between' ref={this.camera} >
                                <View style={styles.bar}>
                                    {/* <IconButton disabled icon={<Feather name="image" size={24} color="white" />} />
                                    <IconButton disabled icon={<Feather name="image" size={24} color="white" />} />
                                    <IconButton icon={<Feather name={this.state.flashIconName} size={24} color="white" />} /> */}
                                </View>

                                <HStack width='100%' height={100}>
                                    <Box flex={1} alignItems='center'>
                                        <IconButton
                                            onPress={() => this.chooseFromGallery()}

                                            icon={<Feather name="image" size={36} color="white" />} />
                                    </Box>
                                    <Box flex={1} alignItems='center'>
                                        <TouchableOpacity onPress={() => this.takePicture()}>
                                            <View style={styles.snapButton}>
                                                <View style={styles.innerSnapButton}>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </Box>
                                    <Box flex={1} alignItems='center'>


                                        {this.renderMultipleImgBtn()}
                                    </Box>
                                </HStack>
                            </Camera>
                        </Box>}
                </Box>
            </NativeBaseProvider >
        )
    }

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