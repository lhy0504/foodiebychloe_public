import React from 'react';
import { View, Dimensions, Share, ImageBackground, Button, ScrollView, TextInput } from 'react-native';
import {
    HStack, IconButton, Text,
    VStack, NativeBaseProvider, Box, Avatar,
} from "native-base";
import { Feather, Ionicons } from '@expo/vector-icons';
import { getUser, updateUser,uploadImage } from '../utils/FirebaseUtil'
import * as ImagePicker from 'expo-image-picker';
/* 

props:
user (loaded)
*/

export default function X({ navigation, route }) {

    var { width, height } = Dimensions.get('window')
    const [user, setUser] = React.useState(null)



    async function getData() {
        var dat = await getUser(undefined, true)
        setUser(dat)
    }
    React.useEffect(() => {
        getData()
    }, [])

    const setName = (name) => {
        setUser({ ...user, name: name })
    }
    const setStatus = (name) => {
        setUser({ ...user, status: name })
    }
    const submit = async () => {
        console.log(user)

        await updateUser(user)
        navigation.goBack()
    }
    const changePic = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (result.cancelled) return

        var cloudURL = await uploadImage(result.uri);
        setUser({ ...user,propic:cloudURL })

    }
    return (
        <NativeBaseProvider>
            {/*  Header Bar  */}
            <View style={{
                height: 50
            }}>
                <HStack alignItems='center'
                    borderBottomWidth={2} borderBottomColor='#ff9636'
                    backgroundColor='white' height='50px' px={2}

                >
                    <HStack alignItems={'center'}>
                        <IconButton onPress={() => navigation.goBack()}
                            icon={<Ionicons name="ios-chevron-back" size={24} color="black" />} />

                        <Text fontWeight='bold' color='black' fontSize='sm' flex={1}>有關您的</Text>

                        <IconButton onPress={submit}
                            icon={<Ionicons name='checkmark-sharp' size={24} color="black" />} />
                    </HStack>

                </HStack>
            </View>

            {user && <VStack backgroundColor={'white'} flex={1} px={6}>

                <Avatar m='15px'  size={45} source={{ uri: user.propic, }} />
                
                <Box mt={2} style={{ borderBottomColor: '#c6c6c6', borderBottomWidth: 1 }}>
                    <Text color='coolGray.400' fontSize={'sm'}>姓名</Text>
                    <TextInput
                        onChangeText={setName}
                        value={user.name}
                    />
                </Box>
                <Box my={2} style={{ borderBottomColor: '#c6c6c6', borderBottomWidth: 1 }}>
                    <Text color='coolGray.400' fontSize={'sm'}>自我介紹</Text>
                    <TextInput
                        numberOfLines={4}
                        onChangeText={setStatus}
                        value={user.status}
                        style={{ textAlignVertical: 'top' }}
                    />
                </Box>
                <Button title="更改照片" onPress={changePic} />
            </VStack >}

        </NativeBaseProvider >

    );

}

