import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { ResponseType } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import { Button, View, Text ,useWindowDimensions} from 'react-native';
import { getdisplayName } from '../utils/FirebaseUtil'



WebBrowser.maybeCompleteAuthSession();

export default function App() {

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
        {
            /* 
            for `expo start` debug: 1021177800634-hqji34lnmgic4kg2scp34gmorhache41.apps.googleusercontent.com
            for `eas build`: 1021177800634-rql76qt9sjuquol6qsav1ue6uj1rggm9.apps.googleusercontent.com
            */
            clientId: '1021177800634-rql76qt9sjuquol6qsav1ue6uj1rggm9.apps.googleusercontent.com',
        },
    );

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token, accessToken } = response.params;

            const auth = firebase.auth();
            const credential = firebase.auth.GoogleAuthProvider.credential(id_token, accessToken);
            console.log(credential)
            auth.signInWithCredential(credential);


        }
    }, [response]);
    var { width, height } = useWindowDimensions()
    return (
        <View style={{ alignItems: 'center', height: height, justifyContent: 'center' }}>
            <View>
                <Text style={{ fontFamily: 'sans-serif-light', color: 'black', marginBottom: 8 }}
                    textAlign='right'>ғᴏᴏᴅɪᴇ ʙʏ ᴄʜʟᴏᴇ🍺</Text>
                <Button
                    disabled={!request}
                    title="以Google帳戶登入"
                    onPress={() => {
                        promptAsync();
                    }}
                />
            </View>
        </View>
    );
}