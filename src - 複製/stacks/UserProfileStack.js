import React, { Component, useState, useEffect } from 'react';
import { TouchableHighlight, View, Dimensions, RefreshControl } from 'react-native';
import {
    FlatList, HStack, IconButton, Text, Spinner, Box, Image,
    VStack, NativeBaseProvider, Avatar
} from "native-base";
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler'
import { getUserPosts, getUser, followUser, getMyUid } from '../utils/FirebaseUtil'
import Post from '../components/Post'
import { InfiniteMonthView } from '../components/InfiniteMonthView'





function Feed(props) {
    const [user, setUser] = useState({ friends: [] })
    const [data, setData] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);

    async function getData() {
        setRefreshing(true);
        var dat = await getUserPosts(props.userid)
        setData(dat)
        var u = await getUser(props.userid)
        setUser(u)
        setRefreshing(false);
        console.log(dat)
    }

    useEffect(() => {
        getData()
    }, [])

    return (

        <VStack backgroundColor='white' >
            <FlatList
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={getData}
                    />
                }
                showsVerticalScrollIndicator={false}
                data={data}
                renderItem={({ item, index }) => (

                    <Post postid={item.id} index={index} navigation={props.navigation} />
                )}
                ListHeaderComponent={
                    <Header userid={props.userid} />

                }
            />
        </VStack>




    );
}
function Header(props) {
    const [user, setUser] = useState({ friends: [], requests: [], following: [] })
    const [myself, setMyself] = useState({ friends: [], requests: [], following: [] })

    async function getData() {
        var u = await getUser(props.userid)
        setUser(u)
        var u = await getUser(getMyUid())
        setMyself(u)
    }

    useEffect(() => {
        getData()
    }, [])

    return <HStack
        px={2} pt={2} mb={10} backgroundColor='orange.500' justifyContent='space-between'>
        <Avatar ml='15px' mr='8px' mb={-2} size={20} source={{ uri: user.propic, }} />
        <VStack
            alignItems='center' justifyContent='center'>
            <Text color='white'>朋友</Text>
            <Text color='white' fontWeight='bold' fontSize='xl'>{user.friends.length}</Text>
        </VStack>
        <VStack
            alignItems='center' justifyContent='center'>
            <Text color='white'>追蹤者</Text>
            <Text color='white' fontWeight='bold' fontSize='xl'>{user.friends.length + user.requests.length}</Text>
        </VStack>
        <VStack
            alignItems='center' justifyContent='center'>
            <Text color='white'>追蹤中</Text>
            <Text color='white' fontWeight='bold' fontSize='xl'>{user.following.length}</Text>
        </VStack>

        {
            props.userid != getMyUid() && (user.friends.includes(getMyUid())
                ?

                <View style={{
                    position: 'absolute', borderColor: "#d1d5db", borderRadius: 5,
                    right: 20, bottom: -40, borderWidth: 1, padding: 5
                }}>
                    <Text textAlign='center' fontSize='sm'
                        width='200'>朋友</Text>
                </View>

                :
                (user.requests.includes(getMyUid())
                    ?

                    <View style={{
                        position: 'absolute', borderColor: "#d1d5db", borderRadius: 5,
                        right: 20, bottom: -40, borderWidth: 1, padding: 5,
                    }}><TouchableOpacity>
                            <Text textAlign='center' fontSize='sm'
                                width='200'>已要求追蹤</Text></TouchableOpacity>
                    </View>

                    :
                    (myself.requests.includes(props.userid)
                        ?
                        <View style={{
                            position: 'absolute', borderColor: "#d1d5db", borderRadius: 5,
                            right: 20, bottom: -40, borderWidth: 1, padding: 5,
                        }}>
                            <TouchableOpacity onPress={async () => { await followUser(props.userid); getData(); }}>
                                <Text textAlign='center' fontSize='sm'
                                    width='200'>接受追蹤請求</Text></TouchableOpacity>
                        </View>

                        :
                        <View style={{
                            position: 'absolute', borderColor: "#d1d5db", borderRadius: 5,
                            right: 20, bottom: -40, borderWidth: 1, padding: 5,
                        }}>
                            <TouchableOpacity onPress={async () => { await followUser(props.userid); getData(); }}>
                                <Text textAlign='center' fontSize='sm'
                                    width='200'>要求追蹤</Text></TouchableOpacity>
                        </View>
                    )
                ))
        }

    </HStack>
}
export default class GalleryTab extends React.Component {

    state = {
        viewStyle: 'large',
        user: null
    }

    async getData() {
        var u = await getUser(this.props.route.params.userid)
        this.setState({ ...this.state, user: u })
    }

    componentDidMount() {
        this.getData()
    }

    changeViewStyle() {
        this.setState({
            ...this.state,
            viewStyle: this.state.viewStyle == 'large' ? 'small' : 'large'
        });
    }

    render() {
        return (
            <NativeBaseProvider>
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    {/*  Header Bar  */}
                    <View style={{
                        height: 50
                    }}>
                        <HStack alignItems='center' justifyContent='space-between'
                            borderBottomWidth='1px' borderBottomColor='coolGray.300'
                            backgroundColor='white' height='50px' px={2}
                        >
                            <HStack alignItems={'center'}>
                                <IconButton onPress={() => this.props.navigation.goBack()}
                                    icon={<Ionicons name="ios-chevron-back" size={24} color="black" />} />
                                {this.state.user &&
                                    <>
                                        <Image source={{ uri: this.state.user.propic }} style={{ height: 40, width: 40, borderRadius: 20 }} />
                                        <Text fontWeight='bold' color='black' fontSize='sm'>  {this.state.user.name}</Text>
                                    </>
                                }
                            </HStack>
                            <IconButton onPress={this.changeViewStyle.bind(this)} mr={2} icon={<Feather name="grid" size={24} color="black" />} />

                        </HStack>
                    </View>

                    {
                        this.state.viewStyle == 'large' ?
                            <Feed navigation={this.props.navigation}
                                userid={this.props.route.params.userid}
                                viewStyle={this.state.viewStyle} />
                            :
                            <View style={{
                                flex: 1,
                                backgroundColor: '#3f3f40'
                            }}>
                                <InfiniteMonthView
                                    navigation={this.props.navigation}
                                    uid={this.props.route.params.userid}
                                />
                            </View>
                    }

                </View>
            </NativeBaseProvider>
        );
    }
}

