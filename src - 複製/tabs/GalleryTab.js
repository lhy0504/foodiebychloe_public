import React from 'react';
import { View, Dimensions, ImageBackground, TouchableOpacity } from 'react-native';
import {
    FlatList, HStack, IconButton, Text, Spinner,
    VStack, NativeBaseProvider,
} from "native-base";
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';

import { getUserPostsMonthly,getMyUid } from '../utils/FirebaseUtil'
import { InfiniteMonthView } from '../components/InfiniteMonthView'

import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";

var { width, height } = Dimensions.get('window')
const startMonthIndex = 12

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]



export default class GalleryTab extends React.Component {

    constructor(props) {
        super(props);

        this.viewShot = React.createRef();

      

    }

    reload = () => {
        this.props.navigation.replace("MainScreen",{screen:"GalleryTab"})
    }
    captureAndShareScreenshot = () => {
        this.viewShot.current.capture().then((uri) => {
            console.log("do something with ", uri);
            Sharing.shareAsync("file://" + uri);
        }),
            (error) => console.error("Oops, snapshot failed", error);
    };
    render() {

        return (
            <NativeBaseProvider>

                <ViewShot
                    ref={this.viewShot}
                    options={{ format: 'jpg', quality: 1.0 }}
                    style={{ flex: 1, backgroundColor: '#3f3f40' }}>




                    <InfiniteMonthView
                        styles={{ flex: 1, height: height }}
                        navigation={this.props.navigation}
                        uid={getMyUid()}
                        allowAdd={true}
                    />

                    {/* logo */}
                    <View style={{
                        position: 'absolute',
                        height: 80,
                        width: width,
                        right: 0,
                        bottom: 0,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                    }}>
                        <Text style={{ fontFamily: 'sans-serif-light', color: '#EEECE3' }} textAlign='right'>ғᴏᴏᴅɪᴇ ʙʏ ᴄʜʟᴏᴇ🍺     </Text>
                    </View>
                </ViewShot>

                <View style={{
                    position: 'absolute',
                    height: 80,
                   
                    right: 0,
                    top: 0,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                     <IconButton onPress={this.reload}
                        mr={1} icon={<Feather name="refresh-cw" size={24} color='#EEECE3' />} />
                    
                    <IconButton onPress={this.captureAndShareScreenshot}
                        mr={2} icon={<Feather name="instagram" size={24} color='#EEECE3' />} />
                </View>


            </NativeBaseProvider>
        );
    }
}

