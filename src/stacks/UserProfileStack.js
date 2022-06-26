import React, { useState, useEffect } from 'react';
import { View, RefreshControl, Alert, TouchableOpacity, Dimensions, ImageBackground,TouchableHighlight } from 'react-native';
import {
    FlatList, HStack, IconButton, Text, Image, Box,
    VStack, NativeBaseProvider, Avatar
} from "native-base";
import { Feather, Entypo, Ionicons } from '@expo/vector-icons';
import { getUserPosts, getUser, followUser, getMyUid, blockUser, unblockUser } from '../utils/FirebaseUtil'
import Post from '../components/Post'
import { InfiniteMonthView } from '../components/InfiniteMonthView'

/* props: userid */
var { width, height } = Dimensions.get('window')

function Feed(props) {
    const [data, setData] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);

    async function getData() {
        setRefreshing(true);
        var dat = await getUserPosts(props.userid)
        setData(dat)

        setRefreshing(false);
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
                    <Header userid={props.userid} navigation={props.navigation}/>

                }
            />
        </VStack>




    );
}
function Header(props) {
    const [user, setUser] = useState({ friends: [], requests: [], following: []})
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

    const browseBookmark = () => { 
        props.navigation.push('LocationPreviewStack',{locationIDs:user.bookmarks, title:`${user.name}的收藏`})
    }
    return <VStack >
        <ImageBackground
            source={require("./../../assets/gallery_bg.png")}
            style={{ width: width }}>
            <VStack>
                <HStack pt={3} px={6} justifyContent='space-between' alignItems={'center'}>
                    <Avatar size={20} source={{ uri: user.propic, }} />

                    <VStack>
                        <HStack justifyContent={'flex-end'} >
                            <VStack mr={10}
                                alignItems='center' justifyContent='flex-end'>
                                <Text color='white'>追蹤者</Text>
                                <Text color='white' fontWeight='bold' fontSize='xl'>{user.friends.length + user.requests.length}</Text>
                            </VStack>
                            <VStack
                                alignItems='center' justifyContent='flex-end'>
                                <Text color='white'>追蹤中</Text>
                                <Text color='white' fontWeight='bold' fontSize='xl'>{user.following.length}</Text>
                            </VStack>
                        </HStack>

                    </VStack>
                </HStack>
                <HStack justifyContent={'flex-end'}>
                    {
                        props.userid != getMyUid() && (user.friends.includes(getMyUid())
                            ?

                            <View style={{
                                borderColor: "#d1d5db", borderRadius: 5,
                                borderWidth: 1, padding: 5,
                                margin: 15
                            }}>
                                <Text textAlign='center' fontSize='sm' color='white'
                                    width='200'>朋友</Text>
                            </View>

                            :
                            (user.requests.includes(getMyUid())
                                ?

                                <View style={{
                                    borderColor: "#d1d5db", borderRadius: 5,
                                    borderWidth: 1, padding: 5,
                                    margin: 15
                                }}><TouchableOpacity>
                                        <Text textAlign='center' fontSize='sm' color='white'
                                            width='200'>追蹤中</Text></TouchableOpacity>
                                </View>

                                :
                                (myself.requests.includes(props.userid)
                                    ?
                                    <View style={{
                                        borderColor: "#d1d5db", borderRadius: 5,
                                        borderWidth: 1, padding: 5,
                                        margin: 15
                                    }}>
                                        <TouchableOpacity onPress={async () => { await followUser(props.userid); getData(); }}>
                                            <Text textAlign='center' fontSize='sm' color='white'
                                                width='200'>接受追蹤請求</Text></TouchableOpacity>
                                    </View>

                                    :
                                    <View style={{
                                        borderColor: "#d1d5db", borderRadius: 5,
                                        borderWidth: 1, padding: 5,
                                        margin: 15
                                    }}>
                                        <TouchableOpacity onPress={async () => { await followUser(props.userid); getData(); }}>
                                            <Text textAlign='center' fontSize='sm' color='white'
                                                width='200'>要求追蹤</Text></TouchableOpacity>
                                    </View>
                                )
                            ))
                    }
                </HStack>
            </VStack>
        </ImageBackground>

        {user.hasOwnProperty('bookmarks') && <TouchableHighlight activeOpacity={1}underlayColor="#e6e6e6" onPress={browseBookmark}>
            <VStack alignItems={'center'} p={8}>
                <Feather name={'bookmark'} size={35} color='#555' />
                <Text color='#555' fontSize={'xs'}>  {`他的收藏 (${user.bookmarks.length || 0})`} </Text>
            </VStack>

        </TouchableHighlight>}

    </VStack>
}
export default class GalleryTab extends React.Component {

    state = {
        viewStyle: 'large',
        user: null
    }

    async getData() {
        /* Check block */
        var me = await getUser(undefined)
        if (me.block.includes(this.props.route.params.userid)) {
            Alert.alert(
                '已封鎖用戶', '解除封鎖?',
                [
                    {
                        text: "解除封鎖", onPress: () => {
                            unblockUser(this.props.route.params.userid)
                            Alert.alert("已解除封鎖")
                        }
                    },
                    {
                        text: "返回",
                        onPress: () => { this.props.navigation.goBack() },
                        style: "cancel",
                    },
                ],

            );
        }
        /* check block end */


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

    block = () => {
        Alert.alert(
            '封鎖用戶?', '你將不會再看到他的帖子',
            [
                {
                    text: "封鎖", onPress: () => {
                        blockUser(this.props.route.params.userid)
                        Alert.alert("已封鎖")
                    }
                },
                {
                    text: "取消",
                    onPress: () => { },
                    style: "cancel",
                },
            ],

        );
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
                                borderBottomWidth={2} borderBottomColor='#ff9636'
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
                            <HStack>
                                <IconButton onPress={this.changeViewStyle.bind(this)} mr={2} icon={<Feather name="grid" size={24} color="black" />} />
                                {this.props.route.params.userid != getMyUid() &&
                                    <IconButton onPress={this.block}
                                        icon={<Entypo name="block" size={24} color="black" />} />
                                }
                            </HStack>
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

