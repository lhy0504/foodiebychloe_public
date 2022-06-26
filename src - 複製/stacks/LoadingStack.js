import * as React from 'react';
import 'firebase/compat/auth';

import { Button, View, Text, Dimensions } from 'react-native';
import { NativeBaseProvider, Spinner } from 'native-base';

var { width,height } = Dimensions.get("window")


export default function App() {


    return (
        <NativeBaseProvider>
            <View style={{ alignItems: 'center',height:height, justifyContent: 'center' }}>
                <View>
                    <Text style={{ fontFamily: 'sans-serif-light', color: 'black', marginBottom:3 }}
                        textAlign='right'>ғᴏᴏᴅɪᴇ ʙʏ ᴄʜʟᴏᴇ🍺     </Text>
                    <Spinner />
                </View>
            </View>
            {/* logo */}

        </NativeBaseProvider>

    );
}