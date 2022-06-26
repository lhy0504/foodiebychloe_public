import { v4 as uuidv4 } from 'uuid';
import firebase from './FirebaseInit'
import { registerForPushNotificationsAsync, sendPushNotification } from './PushNotifications'

/* 
Cache using AsyncStorage
*/
import AsyncStorage from '@react-native-async-storage/async-storage';

function getAuth() {
  return firebase.auth()
}
/* Getters */
export function getMyUid() {
  return getAuth().currentUser.email
}

export async function checkIfNewUser(navigation) {
  /* 
  If new user:
  0 - get Expo PUSH notifications token
  1 - save user data to 'user'
  2 - 
  */
  var userExist = (await firebase.firestore().collection('users').doc(
    getAuth().currentUser.email
  ).get()).exists
  if (!userExist) {
    registerForPushNotificationsAsync().then(async (token) =>
      await firebase.firestore()
        .collection("users").doc(getAuth().currentUser.email).set({
          name: getAuth().currentUser.displayName,
          email: getAuth().currentUser.email,
          uid: getAuth().currentUser.email,
          joined: new Date().toLocaleDateString(),
          propic: getAuth().currentUser.photoURL,
          foodieScore: 20,
          following: [],
          friends: [],
          scorehistory: [],
          feed: [],
          post: [],
          requests: [],
          pushtoken: token,
          followerCount: 0,
          block: [],
          bookmarks:[]

        })
    ).then(() => navigation.replace("MainScreen", { screen: "GalleryTab" }));


  }
}
export async function getUser(id = getMyUid(), refresh = true) {
  var doc

  if (refresh) {
    doc = (await firebase.firestore().collection('users').doc(id).get()).data()
    const jsonValue = JSON.stringify(doc)
    AsyncStorage.setItem('@foodiebychloe:usercache:' + id, jsonValue)
  } else {
    doc = await AsyncStorage.getItem('@foodiebychloe:usercache:' + id);
    if (doc !== null) {
      return JSON.parse(doc);
    } else {
      // not cached
      doc = (await firebase.firestore().collection('users').doc(id).get()).data()
      const jsonValue = JSON.stringify(doc)
      AsyncStorage.setItem('@foodiebychloe:usercache:' + id, jsonValue)
    }
  }
  return doc
}
export async function getLocation(location, place_id, refresh = true) {
  var result
  var doc_id = place_id

  if (place_id == '' || typeof (place_id) == 'undefined') doc_id = location

  result = (await firebase.firestore().collection('location').doc(doc_id).get()).data();
  result.id = doc_id;
  result.place_id = doc_id;

  return result;
}

export async function getPublicPosts() {

  //descending, limit 30
  var postList = [];
  var snapshot = await firebase.firestore()
    .collection('posts')
    .orderBy('postDate', 'desc')
    .get()

  snapshot.forEach((doc) => {
    const singlePost = doc.data();
    singlePost.id = doc.id;
    postList.push(convertTimestampToDate(singlePost));
  });
  return (postList);
}

export async function getUserPostsMonthly(year, month, uid = getAuth().currentUser.email) {

  //monthly, ascending
  var firstDay = new Date(year, month - 1, 1);
  var lastDay = new Date(year, month, 1);
  console.log(lastDay)

  var postList = [];

  var snapshot = await firebase.firestore()
    .collection('posts')
    .where('userid', '==', uid)
    .orderBy('date')
    .where("date", ">=", firstDay)
    .where("date", "<", lastDay)
    .get()

  snapshot.forEach((doc) => {
    const singlePost = doc.data();
    singlePost.id = doc.id;
    postList.push(convertTimestampToDate(singlePost));
  });
  return (postList);
}
export async function getUserPosts(uid) {

  var postList = [];

  var snapshot = await firebase.firestore()
    .collection('posts')
    .where('userid', '==', uid)
    .orderBy('date', 'desc')
    .get()

  snapshot.forEach((doc) => {
    const singlePost = doc.data();
    singlePost.id = doc.id;
    postList.push(convertTimestampToDate(singlePost));
  });
  return (postList);
}
export async function getLocationPosts(location, place_id) {

  var postList = [];

  var snapshot;

  /*   location is deprecated
  
  if (place_id == '' || typeof (place_id) == 'undefined') {
    snapshot = await firebase.firestore()
      .collection('posts')
      .where('location', '==', location)
      .orderBy('date', 'desc')
      .get()

  } else { */

  snapshot = await firebase.firestore()
    .collection('posts')
    .where('place_id', '==', place_id)
    .orderBy('date', 'desc')
    .get()


  snapshot.forEach((doc) => {
    const singlePost = doc.data();
    singlePost.id = doc.id;
    postList.push(convertTimestampToDate(singlePost));
  });
  return (postList);
}
export async function getLocationFriendPost(place_id, friendlist) {
  var postList = [];
  var snapshot;
  snapshot = await firebase.firestore()
    .collection('posts')
    .where('place_id', '==', place_id)
    .where('userid', 'in', friendlist)
    .orderBy('date', 'desc')
    .get()

  snapshot.forEach((doc) => {
    const singlePost = doc.data();
    singlePost.id = doc.id;
    postList.push(convertTimestampToDate(singlePost));
  });
  return (postList);
}
export async function getPostById(id) {
  var snapshot = await firebase.firestore()
    .collection('posts')
    .doc(id)
    .get()
  return convertTimestampToDate({ ...snapshot.data(), id: id });

}

function convertTimestampToDate(post) {
  post.dateObj = post.date.toDate()
  post.postDate = post.postDate.toDate().toLocaleDateString('en-US')
  post.date = post.date.toDate().toLocaleDateString('en-US')

  return post
}
export function parseDate(date) {
  //reformat date
  var parts = date.split('/');
  // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
  // January - 0, February - 1, etc.
  return new Date('20' + parts[2], parts[0] - 1, parts[1]);

}
/* Uploading */
export async function uploadPost(post, publicOrFriends) {

  post.publicOrFriends = publicOrFriends

  //split # and @
  post.with = post.with.replace(", ", ",").split(",")
  post.hashtag = post.hashtag.replace("#", "").split(" ")

  //reformat date
  var parts = post.date.split('/');
  // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
  // January - 0, February - 1, etc.
  post.date = new Date('20' + parts[2], parts[0] - 1, parts[1]);

  console.log(post)
  //upload img
  for (var i in post.image) {
    if (post.image[i] !== undefined) {
      var x = await uploadImage(post.image[i])
      post.image[i] = x
    }
  }

  // if no place_id, that means we will create a restaurant with place_id=location
  if (post.place_id == undefined || post.place_id == '') {
    post.place_id = post.location
  }

  if (post.id !== undefined) {
    /* Update existing */
    //post exists in server, do not overwrite. Combine instead

    var oldpost = await getPostById(post.id)
    var newpost = {
      ...post,
      comment: oldpost.comment,
      postDate: parseDate(oldpost.postDate)
    }

    firebase.firestore()
      .collection('posts').doc(post.id)
      .update(newpost)

  } else {
    post.postDate = new Date() //now

    firebase.firestore()
      .collection('posts')
      .add(post)
      .then((docRef) => {
        addPostToFeeds(docRef.id, publicOrFriends)
        setUserVisited(post.place_id)
      })


    //
    /*
    vote to location.
    if 
       (0) no  place_id:   vote to doc with id = location name; create if inexist
       (1) has place_id:   vote to docuemnt with id = place_id; create if inexist
    */
    /*
    todo:check user has voted?
    */

    var yummytemplate = {
      star0: 0,
      star1: 0,
      star2: 0,
      star3: 0,
      star4: 0,
      star5: 0,
      total: 0,
      average: 0
    }
    if (post.place_id == '' || typeof (post.place_id) == 'undefined') {
      if (post.location != '') {
        var location = (await firebase.firestore().collection('location').doc(post.location).get())
        if (!location.exists) {
          firebase.firestore()
            .collection("location").doc(post.location).set({
              ...yummytemplate,
              name: post.location,
              ['star' + post.overallyummy]: 1,
              total: 1,
              average: post.overallyummy
            })
        } else {
          firebase.firestore()
            .collection("location").doc(post.location).update({
              ['star' + post.overallyummy]: firebase.firestore.FieldValue.increment(1),
              total: firebase.firestore.FieldValue.increment(1),
              average: (location.data().average * location.data().total + post.overallyummy) / parseFloat(location.data().total + 1)
            })
        }
      }

    } else {
      var location = (await firebase.firestore().collection('location').doc(post.place_id).get())
      if (!location.exists) {
        firebase.firestore()
          .collection("location").doc(post.place_id).set({
            ...yummytemplate,
            name: post.location,
            address: post.address,
            ['star' + post.overallyummy]: 1,
            total: 1,
            average: post.overallyummy
          })
      } else {
        firebase.firestore()
          .collection("location").doc(post.place_id).update({
            ['star' + post.overallyummy]: firebase.firestore.FieldValue.increment(1),
            total: firebase.firestore.FieldValue.increment(1),
            average: (location.data().average * location.data().total + post.overallyummy) / parseFloat(location.data().total + 1)
          })
      }

    }

  }

}
async function setUserVisited(place_id) {
  var doc = firebase.firestore()
    .collection('userVisited')
    .doc(place_id)

  if (await (doc.get()).exists) {
    doc.update({
      "users": firebase.firestore.FieldValue.arrayUnion(getMyUid())
    });
  } else {
    doc.set({
      "users": [getMyUid()]
    })
  }
}
export async function getUserVisited(place_id) {
  var doc = await firebase.firestore()
    .collection('userVisited')
    .doc(place_id).get()
  if (doc.exists) {
    return doc.data().users
  } else {
    return []
  }
}

export async function setUserBookmarked(place_id) {
  await firebase.firestore()
    .collection('users')
    .doc(getMyUid())
    .update({
      "bookmarks": firebase.firestore.FieldValue.arrayUnion(place_id)
    });

  /* for allowing to know who bookmarked a place in LocationView */
  var doc = firebase.firestore()
    .collection('userBookmarked')
    .doc(place_id)
  if (await (doc.get()).exists) {
    doc.update({
      "users": firebase.firestore.FieldValue.arrayUnion(getMyUid())
    });
  } else {
    doc.set({
      "users": [getMyUid()]
    })
  }
}
export async function unsetUserBookmarked(place_id) {
  await firebase.firestore()
    .collection('users')
    .doc(getMyUid())
    .update({
      "bookmarks": firebase.firestore.FieldValue.arrayRemove(place_id)
    });
  // firebase will remove wrongly (?)
  var doc = await getUserBookmarked(place_id)
  if (doc.includes(getMyUid())) {
    firebase.firestore()
      .collection('userBookmarked')
      .doc(place_id)
      .update({
        "users": firebase.firestore.FieldValue.arrayRemove(getMyUid())
      });
  }
}
export async function getUserBookmarked(place_id) {
  var doc = await firebase.firestore()
    .collection('userBookmarked')
    .doc(place_id).get()
  if (doc.exists) {
    return doc.data().users
  } else {
    return []
  }
}

async function addPostToFeeds(id, publicOrFriends) {
  /* 
                public: add id to public/postIDs/ids[]
                                                                        push to Friends & Requested
                friends: push to Freinds
  */
  var myUser = await getUser()
  var timestamp = new Date()

  if (publicOrFriends == 'public') {
    firebase.firestore()
      .collection('public')
      .doc('postIDs')
      .update({
        "ids": firebase.firestore.FieldValue.arrayUnion({
          id: id, timestamp: timestamp
        })
      });

    for (var u in myUser.requests) {
      await firebase.firestore()
        .collection('users')
        .doc(myUser.requests[u])
        .update({
          "feed": firebase.firestore.FieldValue.arrayUnion({
            id: id, timestamp: timestamp
          })
        });
    }
  }
  /* Friends */
  for (var u in myUser.friends) {
    await firebase.firestore()
      .collection('users')
      .doc(myUser.friends[u])
      .update({
        "feed": firebase.firestore.FieldValue.arrayUnion({
          id: id, timestamp: timestamp
        })
      });
  }
  /* myself */

  await firebase.firestore()
    .collection('users')
    .doc(getMyUid())
    .update({
      "post": firebase.firestore.FieldValue.arrayUnion({
        id: id, timestamp: timestamp
      }),
      "feed": firebase.firestore.FieldValue.arrayUnion({
        id: id, timestamp: timestamp
      })
    });

}

export async function uploadImage(imageUri) {
  console.log(imageUri)
  const fileExtension = imageUri.split('.').pop();
  console.log("EXT: " + fileExtension);

  var uuid = uuidv4();
  const fileName = `${uuid}.${fileExtension}`;
  console.log(fileName);


  const response = await fetch(imageUri);
  const blob = await response.blob();
  var ref = firebase.storage().ref(`posts/images/${fileName}`);
  await ref.put(blob)
  var url = await ref.getDownloadURL()
  return url

}

/* Like */
export async function likePost(post, authorid) {
  firebase.firestore()
    .collection('posts')
    .doc(post)
    .update({
      "likes": firebase.firestore.FieldValue.arrayUnion(getMyUid())
    });
  /* 
  Then we push notification
  */
  console.log("like", authorid, getMyUid())

  if (authorid != getMyUid()) {
    var author = await getUser(authorid)
    var myself = await getUser()
    sendPushNotification(author.pushtoken,
      `${myself.name} 讚好了你的帖文！`,
      '',
      {
        screen: 'StoryStack',
        postid: post,
        openedFromStory: false,

        uid: myself.uid,
        name: myself.name,
        propic: myself.propic
      })
  }

}
export async function unlikePost(post) {
  firebase.firestore()
    .collection('posts')
    .doc(post)
    .update({
      "likes": firebase.firestore.FieldValue.arrayRemove(getMyUid())
    });
}
/* Comment */
export async function commentPost(post, message, authorid) {
  await firebase.firestore()
    .collection('posts')
    .doc(post)
    .update({
      "comment": firebase.firestore.FieldValue.arrayUnion({
        userid: getMyUid(), comment: message, date: new Date()
      })
    });
  /* 
  Then we push notification
  */
  console.log("Comment", authorid, getMyUid())
  if (authorid != getMyUid()) {
    var author = await getUser(authorid)
    var myself = await getUser()
    sendPushNotification(author.pushtoken,
      `${myself.name} 回應了你的帖文！`,
      '',
      {
        screen: 'StoryStack',
        postid: post,
        openedFromStory: false,

        uid: myself.uid,
        name: myself.name,
        propic: myself.propic
      })
  }
}
/* Del post */
export async function deletePost(post) {
  await firebase.firestore()
    .collection('posts')
    .doc(post)
    .delete()
}

/* Follow */
export async function followUser(id) {
  /*
  accepting
   if my request has it, put it in friends of both
    */
  var me = await getUser()
  if (me.requests.includes(id)) {
    await firebase.firestore()
      .collection('users')
      .doc(id)
      .update({
        "requests": firebase.firestore.FieldValue.arrayRemove(getMyUid()),
        "friends": firebase.firestore.FieldValue.arrayUnion(getMyUid())
      })
    await firebase.firestore()
      .collection('users')
      .doc(getMyUid())
      .update({
        "requests": firebase.firestore.FieldValue.arrayRemove(id),
        "friends": firebase.firestore.FieldValue.arrayUnion(id)
      })
    return
  }
  /* 
  requesting
  */
  await firebase.firestore()
    .collection('users')
    .doc(id)
    .update({
      "requests": firebase.firestore.FieldValue.arrayUnion(getMyUid()),
      "followerCount": firebase.firestore.FieldValue.increment(1)
    });
  //put in follwing no matter what
  await firebase.firestore()
    .collection('users')
    .doc(getMyUid())
    .update({
      "following": firebase.firestore.FieldValue.arrayUnion(id)
    });

  var author = await getUser(id)
  sendPushNotification(author.pushtoken,
    `${me.name} 要求追蹤您！`,
    '追蹤他來成為朋友，就能查看彼此的帖子',
    {
      screen: 'UserProfileStack',
      userid: me.uid,

      uid: me.uid,
      name: me.name,
      propic: me.propic
    })
  return
}

export async function getAllUsers() {

  var postList = [];

  var snapshot = await firebase.firestore()
    .collection('users')
    .orderBy('followerCount', 'desc')
    .limit(10)
    .get()

  snapshot.forEach((doc) => {
    const singlePost = doc.data();
    singlePost.id = doc.id;
    postList.push(singlePost);
  });
  return (postList);
}
export async function getAllRestaurants(limit = 10) {

  var postList = [];

  var snapshot = await firebase.firestore()
    .collection('location')
    .orderBy('average', 'desc')
    .limit(limit)
    .get()

  snapshot.forEach((doc) => {
    const singlePost = doc.data();
    singlePost.id = doc.id;
    singlePost.place_id = doc.id;
    postList.push(singlePost);
  });
  return (postList);
}
export async function getRestaurantsMap(searchName = '', searchAddress = '', searchDishes = [],
  searchPrice = [], searchStar = 0) {

  var postList = [];

  var query = firebase.firestore()
    .collection('location')

 /*  if (searchName != '') {
    query = query.where('name', '>=', searchName)
      .where('name', '<=', searchName + '\uf8ff') 
  } else if (searchAddress != '') {
     query = query.where('address', '>=', searchAddress)
      .where('address', '<=', searchAddress + '\uf8ff') 
  } else */ if (searchDishes.length > 0) {
    query = query.where('tag', 'array-contains-any', searchDishes)
  } else if (searchPrice.length > 0) {
    query = query.where('price', 'array-contains-any', searchPrice)
  } else if (searchStar > 0) {
    query = query.where('average', '>=', searchStar)
  }


  var snapshot = await query.get() //orderby ensures have LAT 

  snapshot.forEach((doc) => {
    const singlePost = doc.data();
    
    /* then Re-filter ALL */
    if (!singlePost.hasOwnProperty('lat')) return
    if (!singlePost.name.includes(searchName)) return
    if (!singlePost.address.includes(searchAddress)) return
    if (searchDishes.length > 0 && !singlePost.tag.some(ai => searchDishes.includes(ai))) return
    if (searchPrice.length > 0 && !singlePost.tag.some(ai => searchPrice.includes(ai))) return
    if (singlePost.average < searchStar) return

    singlePost.id = doc.id;
    singlePost.place_id = doc.id;
    postList.push(singlePost);
  });
  console.log(1, postList)
  return (postList);
}
export function UIbeautifyDateString(datestring) {

  //exceptions
  if (typeof datestring != 'string') return datestring

  var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  var arr = datestring.split('/')

  if (arr.length != 3) return datestring

  return arr[1] + ' ' + months[parseInt(arr[0]) + 1] + ' 20' + arr[2]
}
/* Block */
export async function blockUser(uid) {
  firebase.firestore()
    .collection('users')
    .doc(getMyUid())
    .update({
      "block": firebase.firestore.FieldValue.arrayUnion(uid)
    });
}
export async function unblockUser(uid) {
  firebase.firestore()
    .collection('users')
    .doc(getMyUid())
    .update({
      "block": firebase.firestore.FieldValue.arrayRemove(uid)
    });
}