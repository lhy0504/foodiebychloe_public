import { v4 as uuidv4 } from 'uuid';

import firebase from './FirebaseInit'
/* import 'firebase/compat/firestore';
import 'firebase/compat/storage'; */
//import { getAuth } from 'firebase/auth';
import { registerForPushNotificationsAsync, sendPushNotification } from './PushNotifications'

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
          pushtoken: token

        })
    ).then(() => navigation.replace("MainScreen", { screen: "GalleryTab" }));


  }
}
export async function getUser(id = getMyUid()) {
  var doc = await firebase.firestore().collection('users').doc(id).get()
  var results = doc.data();
  return results
}
export async function getLocation(location, place_id) {
  var result

  if (place_id == '' || typeof (place_id) == 'undefined') {
    result = (await firebase.firestore().collection('location').doc(location).get()).data();
    result.id = location;
    result.place_id = location;

  } else {
    result = (await firebase.firestore().collection('location').doc(place_id).get()).data();
    result.id = place_id;
    result.place_id = place_id;
  }

  return (result);
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

  if (place_id == '' || typeof (place_id) == 'undefined') {
    snapshot = await firebase.firestore()
      .collection('posts')
      .where('location', '==', location)
      .orderBy('date', 'desc')
      .get()

  } else {

    snapshot = await firebase.firestore()
      .collection('posts')
      .where('place_id', '==', place_id)
      .orderBy('date', 'desc')
      .get()

  }
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
      total: 0
    }
    if (post.place_id == '' || typeof (post.place_id) == 'undefined') {
      if (post.location != '') {
        var locationExist = (await firebase.firestore().collection('location').doc(post.location).get()).exists
        if (!locationExist) {
          firebase.firestore()
            .collection("location").doc(post.location).set({
              ...yummytemplate,
              name: post.location,
              ['star' + post.overallyummy]: 1,
              total: 1
            })
        } else {
          firebase.firestore()
            .collection("location").doc(post.location).update({
              [post.overallyummy + 'star']: firebase.firestore.FieldValue.increment(1),
              total: firebase.firestore.FieldValue.increment(1),
            })
        }
      }

    } else {
      var locationExist = (await firebase.firestore().collection('location').doc(post.place_id).get()).exists
      if (!locationExist) {
        firebase.firestore()
          .collection("location").doc(post.place_id).set({
            ...yummytemplate,
            name: post.location,
            address: post.address,
            ['star' + post.overallyummy]: 1,
            total: 1
          })
      } else {
        firebase.firestore()
          .collection("location").doc(post.place_id).update({
            [post.overallyummy + 'star']: firebase.firestore.FieldValue.increment(1),
            total: firebase.firestore.FieldValue.increment(1),
          })
      }

    }

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
      "requests": firebase.firestore.FieldValue.arrayUnion(getMyUid())
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
    .get()

  snapshot.forEach((doc) => {
    const singlePost = doc.data();
    singlePost.id = doc.id;
    postList.push(singlePost);
  });
  return (postList);
}
export async function getAllRestaurants() {

  var postList = [];

  var snapshot = await firebase.firestore()
    .collection('location')
    .get()

  snapshot.forEach((doc) => {
    const singlePost = doc.data();
    singlePost.id = doc.id;
    singlePost.place_id = doc.id;
    postList.push(singlePost);
  });
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