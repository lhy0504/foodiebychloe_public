import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './src/MainScreen';
import SigninStack from './src/stacks/SigninStack';
import AddMediaStack from './src/stacks/AddMediaStack';
import ImageEditorStack from './src/stacks/ImageEditorStack';
import CommentStack from './src/stacks/CommentStack';
import LikedStack from './src/stacks/LikedStack';
import StoryStack from './src/stacks/StoryStack';
import StoryStackIGstyle from './src/stacks/StoryStackIGstyle';
import PostEditorStack from './src/stacks/PostEditorStack';
import PostEditorStackII from './src/stacks/PostEditorStackII';
import FriendshipStack from './src/stacks/FriendshipStack';
import UserProfileStack from './src/stacks/UserProfileStack'
import ImageBrowserStack from './src/stacks/ImageBrowserStack'
import UserSearchPreviewStack from './src/stacks/UserSearchPreviewStack'

import './src/utils/FirebaseInit'
import LoadingStack from './src/stacks/LoadingStack'
import LocationProfileStack from './src/stacks/LocationProfileStack'
import LocationProfileFriendPostStack from './src/stacks/LocationProfileFriendPostStack'
import LocationPreviewStack from './src/stacks/LocationPreviewStack'
import UserPreviewStack from './src/stacks/UserPreviewStack'
import UserEditStack from './src/stacks/UserEditStack'
import MapStack from './src/stacks/MapStack'

import DayPostsModal from './src/tabs/DayPostsModal'
import NotificationsStack from './src/stacks/NotificationsStack'

import { useAuthentication } from './src/utils/UseAuth';
import { NavigationContainer, useNavigationContainerRef, } from '@react-navigation/native';

import { TransitionPresets } from '@react-navigation/stack';
const Stack = createStackNavigator();


export default function App() {
  const { user } = useAuthentication();

  /*  const notificationListener = useRef();
   const responseListener = useRef();
 
   const navigationRef = useNavigationContainerRef(); 
 
   useEffect(() => {
     registerForPushNotificationsAsync().then(token => console.log(token))
    
     // fired whenever a notification is received while the app is foregrounded
     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
       //save noti
       Noti.addnotification(notification)
     });
 
     // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
       console.log(response);
 
      var data=response.notification.request.content.data
       if (data.screen) {
         console.log('nav', data)
         if(navigationRef)
         navigationRef.current.navigate(data.screen,data)
       }
       
     });
 
     return () => {
       Notifications.removeNotificationSubscription(notificationListener.current);
       Notifications.removeNotificationSubscription(responseListener.current);
     };
   }, []); */

  return (
    user == "loading" ?
      <NavigationContainer >
        <Stack.Navigator
          initialRouteName="LoadingStack"
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen
            name="LoadingStack"
            component={LoadingStack}
          />
        </Stack.Navigator>
      </NavigationContainer>
      : (
        user ?
          <SafeAreaView style={{flex:1}}>
            <NavigationContainer >

              <Stack.Navigator
                initialRouteName="MainScreen"
                screenOptions={{
                  headerShown: false,
                  backgroundColor: "transparent",
                  ...TransitionPresets.SlideFromRightIOS,
                }}
              >

                <Stack.Screen
                  name="MainScreen"
                  component={MainScreen}
                />
                <Stack.Screen
                  name="NotificationsStack"
                  component={NotificationsStack}
                />
                <Stack.Screen
                  name="LoadingStack2"
                  component={LoadingStack}
                />
                <Stack.Screen
                  name="StoryStack"
                  component={StoryStack}
                />
                <Stack.Screen
                  name="StoryStackIGstyle"
                  component={StoryStackIGstyle}
                />
                <Stack.Screen
                  name="UserProfileStack"
                  component={UserProfileStack}
                />
                <Stack.Screen
                  name="AddMediaStack"
                  component={AddMediaStack}
                />
                <Stack.Screen
                  name="LocationProfileStack"
                  component={LocationProfileStack}
                />
                <Stack.Screen
                  name="LocationProfileFriendPostStack"
                  component={LocationProfileFriendPostStack}
                />
                <Stack.Screen
                  name="LocationPreviewStack"
                  component={LocationPreviewStack}
                />
                <Stack.Screen
                  name="ImageEditorStack"
                  component={ImageEditorStack}
                  options={{
                    animationEnabled: false,
                  }}
                />
                <Stack.Screen
                  name="PostEditorStack"
                  component={PostEditorStack}
                />

                <Stack.Screen
                  name='ImageBrowser'
                  component={ImageBrowserStack}
                  options={{
                    title: '已選取0張圖片',
                    headerShown: true,
                    headerTintColor: 'black'
                  }}
                />
                <Stack.Screen
                  name="CommentStack"
                  component={CommentStack}
                  options={modalOptions}
                />
                <Stack.Screen
                  name="UserEditStack"
                  component={UserEditStack}
                />
                <Stack.Screen
                  name="DayPostsModal"
                  component={DayPostsModal}
                  options={modalOptions}

                />
                <Stack.Screen
                  name="LikedStack"
                  component={LikedStack}
                  options={modalOptions}
                />
                <Stack.Screen
                  name="MapStack"
                  component={MapStack}
                />
                <Stack.Screen
                  name="UserPreviewStack"
                  component={UserPreviewStack}
                />
                <Stack.Screen
                  name="FriendshipStack"
                  component={FriendshipStack}
                />
                 <Stack.Screen
                  name="PostEditorStackII"
                  component={PostEditorStackII}
                />
                  <Stack.Screen
                  name="UserSearchPreviewStack"
                  component={UserSearchPreviewStack}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaView>
          :
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="SigninStack"
              screenOptions={{
                headerShown: false
              }}
            >
              <Stack.Screen
                name="SigninStack"
                component={SigninStack}
              />
            </Stack.Navigator>
          </NavigationContainer>
      )
  );
}

const modalOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: "transparent" },
  cardOverlayEnabled: true,
  presentation: 'transparentModal',
  //cardStyleInterpolator:forFade
  ...TransitionPresets.DefaultTransition,
};
const forFade = ({ current, next }) => ({
  cardStyle: {
    opacity: current.progress,

  },

})