import AsyncStorage from '@react-native-async-storage/async-storage';


export async function getNotifications() {
  try {
    // update last read
     AsyncStorage.setItem('@foodiebychloe:notificationsNew', "0")
     AsyncStorage.setItem('@foodiebychloe:notificationsLastRead', Date.now().toString())

    const notificationsString = await AsyncStorage.getItem('@foodiebychloe:notifications');
    if (notificationsString !== null) {
      return JSON.parse(notificationsString);
    } else {
      // no notifications stored
      return []
    }
  } catch (error) {
    // Error retrieving data
    console.log(error)
  }
  return []
}

export async function addnotification(noti) {

  var existingnotifications = []
  existingnotifications = await getNotifications()
  existingnotifications.push({ ...noti, read: false })

  try {
    const jsonValue = JSON.stringify(existingnotifications)
     AsyncStorage.setItem('@foodiebychloe:notifications', jsonValue)
     AsyncStorage.setItem('@foodiebychloe:notificationsNew', "1")
  } catch (e) {
    console.log(e)
  }
}
export async function hasNewNotifications() {
  try {
    const notificationsNew = await AsyncStorage.getItem('@foodiebychloe:notificationsNew');
    if (notificationsNew !== null) {
      return notificationsNew=='1'
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}
export async function getNotificationsLastRead() {
  try {
    const notificationsLastRead = await AsyncStorage.getItem('@foodiebychloe:notificationsLastRead');
    if (notificationsLastRead !== null) {
      return parseInt(notificationsLastRead)
    } else {
      return 0
    }
  } catch (error) {
    return 0
  }
}
