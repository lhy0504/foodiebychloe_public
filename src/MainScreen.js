import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from './tabs/HomeTab';
import ExploreTab from './tabs/ExploreTab';
import GalleryTab from './tabs/GalleryTab';
import SocialTab from './tabs/SocialTab';

import AccountTab from './tabs/AccountTab';
import AddMediaStack from './stacks/AddMediaStack';

import { Feather, Ionicons, } from '@expo/vector-icons';
import { checkIfNewUser, TestingPurpose } from './utils/FirebaseUtil'

import { registerForPushNotificationsAsync } from './utils/PushNotifications'
import * as Noti from './utils/SaveNotifications'

import * as Notifications from 'expo-notifications';

const Tab = createBottomTabNavigator();

export default function MainScreen({ navigation, route }) {
    TestingPurpose()

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });

    const notificationListener = useRef();
    const responseListener = useRef();


    useEffect(() => {
        registerForPushNotificationsAsync().then(token => console.log('TOKEN', token))

        // fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            //save noti
            Noti.addnotification(notification)
        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);

            var data = response.notification.request.content.data
            if (data.screen) {
                console.log('nav', data)
                navigation.navigate(data.screen, data)
            }

        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);


    /*  // for navigating to screen from noti; in case responseListener cannot catch
     const lastNotificationResponse = Notifications.useLastNotificationResponse();
     React.useEffect(() => {
         if (
             lastNotificationResponse &&
             lastNotificationResponse.notification.request.content.data.screen &&
             lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
         ) {
             var data = lastNotificationResponse.notification.request.content.data
             navigation.navigate(data.screen, data)
         }
     }, [lastNotificationResponse]); */


    //Unfortunately, need to check if new user is created
    checkIfNewUser(navigation)

    return (
        <><StatusBar
            animated={true}
            backgroundColor="#fff"
            barStyle="dark-content" />
            <Tab.Navigator
                tabBarOptions={{
                    keyboardHidesTabBar: true
                }}
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        position: 'absolute',
                        backgroundColor: 'white',
                        overflow: 'hidden',
                        left: 0,
                        bottom: 0,
                        right: 0,

                    }
                }}>
                <Tab.Screen name="Home" component={HomeTab} stackNavigation={navigation}
                    options={{
                        tabBarLabel: '動態',
                        tabBarActiveTintColor: 'black',
                        tabBarIcon: (props) => {
                            if (props.focused) {
                                return <Ionicons name="home" size={24} color="black" />;
                            } else {
                                return <Ionicons name="home-outline" size={24} color='grey' />;
                            }
                        }
                    }} />
                <Tab.Screen name="ExploreTab" component={ExploreTab}
                    options={{
                        tabBarLabel: '探索',
                        tabBarActiveTintColor: 'black',
                        tabBarIcon: (props) => {
                            if (props.focused) {
                                return <Ionicons name="search" size={24} color="black" />;
                            } else {
                                return <Ionicons name="search-outline" size={24} color='grey' />;
                            }
                        }
                    }} />
                {/*  <Tab.Screen name="New"
                    component={() => null}
                    listeners={() => ({
                        tabPress: (e) => {
                            e.preventDefault();
                        },
                    })}
                    options={{
                        tabBarActiveTintColor: 'black',
                        tabBarIcon: (props) => {
                            return <View >
                                <Ionicons

                                    name="add-circle-outline" size={24} color="grey"
                                    onPress={() => navigation.push('AddMediaStack')} />
                            </View>;
                        }
                    }} /> */}
                <Tab.Screen name="SocialTab" component={SocialTab} navigation={navigation}
                    options={{
                        tabBarLabel: '社交',
                        tabBarActiveTintColor: 'black',
                        tabBarIcon: (props) => {
                            if (props.focused) {
                                return <Ionicons name="ios-people" size={24} color="black" />;
                            } else {
                                return <Ionicons name="ios-people-outline" size={24} color='grey' />;
                            }
                        }
                    }} />
                <Tab.Screen name="GalleryTab" component={GalleryTab} navigation={navigation}
                    options={{
                        tabBarLabel: '我的月曆',
                        tabBarActiveTintColor: 'black',
                        tabBarIcon: (props) => {
                            if (props.focused) {
                                return <Ionicons name="calendar" size={24} color="black" />;
                            } else {
                                return <Ionicons name="calendar-outline" size={24} color='grey' />;
                            }
                        }
                    }} />
                <Tab.Screen name="AccountTab" component={AccountTab} navigation={navigation}
                    tabBarShowLabel
                    options={{
                        tabBarLabel: '帳戶',
                        tabBarActiveTintColor: 'black',
                        tabBarIcon: (props) => {
                            if (props.focused) {
                                return <Ionicons name='ios-person' size={24} color="black" />;
                            } else {
                                return <Ionicons name="ios-person-outline" size={24} color='grey' />;
                            }
                        }
                    }} />
                {/* */}



            </Tab.Navigator></>
    );

}
