import React, { useState, useEffect } from 'react';
import { View, RefreshControl, Alert, Dimensions, ImageBackground,TouchableOpacity  } from 'react-native';
import {
    FlatList, HStack, IconButton, Text, Image, Box,
    VStack, NativeBaseProvider, Avatar
} from "native-base";
import { Feather, Entypo, Ionicons } from '@expo/vector-icons';
import { getBothUserPosts, getUser, followUser, getMyUid, blockUser, unblockUser } from '../utils/FirebaseUtil'
import Post from '../components/Post'
import { InfiniteMonthView } from '../components/InfiniteMonthView'

/* props: userid */
var { width, height } = Dimensions.get('window')

function Feed(props) {
    const [data, setData] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);

    async function getData() {
        setRefreshing(true);
        var dat = await getBothUserPosts(props.userid)
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
                    <Header userid={props.userid} navigation={props.navigation}
                        score={props.score} rank={props.rank} numpost={data.length} />

                }
                ListEmptyComponent={

                    <Text textAlign={'center'} m={10}>沒有共同帖文</Text>
                }
            />
        </VStack>




    );
}
function Header(props) {
    const [user, setUser] = useState({ friends: [], requests: [], following: [] })
    const [myself, setMyself] = useState({ friends: [], requests: [], following: [] })

    async function getData() {
        var u = await getUser(props.userid, true)
        setUser(u)
        var u = await getUser(getMyUid())
        setMyself(u)
    }

    useEffect(() => {
        getData()
    }, [])


    function openFriend(id) {
        props.navigation.push("UserProfileStack", { userid: id })
    }
    return <VStack >
        <ImageBackground
            source={require("./../../assets/gallery_bg.png")}
            style={{ width: width }}>
            {myself && user &&
                <VStack>
                    <HStack pt={3} px={6} justifyContent='space-between' alignItems={'center'}>
                        <TouchableOpacity onPress={() => openFriend(props.userid)} style={{flex:1}}>
                            <VStack flex={1}  my={5} px={5.5} borderColor='coolGray.300' borderRightWidth={1}
                                alignItems='center' >
                                <Avatar size={60} source={{ uri: user.propic, }} />
                                <Text fontSize='md' color='white' fontWeight='bold' textAlign={'center'}>{user.name}</Text>
                                <Text fontSize={12} color='#ccc' mb={1}>{"("}{user.friends.length + user.requests.length}{")"}</Text>
                                <Text fontSize={12} color='#ccc' textAlign={'center'}>{user.status}</Text>
                            </VStack>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openFriend(getMyUid())}  style={{flex:1}}>

                            <VStack flex={1}  my={5} px={5.5}
                                alignItems='center' >
                                <Avatar msize={60} source={{ uri: myself.propic, }} />
                                <Text fontSize='md' fontWeight='bold' color='white' textAlign={'center'}>{myself.name}</Text>
                                <Text fontSize={12} color='#ccc' mb={1}>{"("}{myself.friends.length + myself.requests.length}{")"}</Text>
                                <Text fontSize={12} color='#ccc' textAlign={'center'}>{myself.status}</Text>
                            </VStack>
                        </TouchableOpacity>
                    </HStack>
                    <HStack justifyContent={'center'} my={3}>
                        <VStack flex={1}
                            alignItems='center' justifyContent='flex-end'>
                            <Text color='white'>你的摯友</Text>
                            <Text color='white' fontWeight='bold' fontSize='xl'>{'#' + props.rank}</Text>
                        </VStack>
                        <VStack flex={1}
                            alignItems='center' justifyContent='flex-end'>
                            <Text color='white'>foodieScore</Text>
                            <Text color='white' fontWeight='bold' fontSize='xl'>{props.score}</Text>
                        </VStack>
                        <VStack flex={1}
                            alignItems='center' justifyContent='flex-end'>
                            <Text color='white'>共同標記的帖子</Text>
                            <Text color='white' fontWeight='bold' fontSize='xl'>{props.numpost}</Text>
                        </VStack>
                    </HStack>

                </VStack>
            }
        </ImageBackground>



    </VStack>
}
export default class GalleryTab extends React.Component {

    state = {
        viewStyle: 'large',
        user: null
    }

    async getData() {
        var u = await getUser(this.props.route.params.userid, true)
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
                            borderBottomWidth={2} borderBottomColor='#ff9636'
                            backgroundColor='white' height='50px' px={2}
                        >
                            <HStack alignItems={'center'}>
                                <IconButton onPress={() => this.props.navigation.goBack()}
                                    icon={<Ionicons name="ios-chevron-back" size={24} color="black" />} />
                                {this.state.user &&
                                    <>
                                        <Image source={{ uri: this.state.user.propic }} style={{ height: 40, width: 40, borderRadius: 20 }} />
                                        <Text fontWeight='bold' color='black' fontSize='sm'>  {"你和" + this.state.user.name}</Text>
                                    </>
                                }
                            </HStack>
                            <HStack>
                                <IconButton onPress={this.changeViewStyle.bind(this)} mr={2}
                                    icon={this.state.viewStyle == 'small' ?
                                        <Ionicons name="list" size={24} color="black" />
                                        : <Ionicons name="calendar" size={24} color="black" />} />

                            </HStack>
                        </HStack>
                    </View>

                    {
                        this.state.viewStyle == 'large' ?
                            <Feed navigation={this.props.navigation}
                                userid={this.props.route.params.userid}
                                viewStyle={this.state.viewStyle}
                                rank={this.props.route.params.rank}
                                score={this.props.route.params.score} />
                            :
                            <View style={{
                                flex: 1,
                                backgroundColor: '#3f3f40'
                            }}>
                                <InfiniteMonthView
                                    both={true}
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

