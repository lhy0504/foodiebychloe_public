import React, { Component } from 'react';
import { StyleSheet, View, Text,  ActivityIndicator } from 'react-native';
import { ImageBrowser } from 'expo-image-picker-multiple';
import { TouchableOpacity,  } from 'react-native-gesture-handler';

export default class ImageBrowserScreen extends Component {
  _getHeaderLoader = () => (
    <ActivityIndicator size='small' color={'#0580FF'} />
  );

  imagesCallback = (callback) => {
    const { navigation } = this.props;
    this.props.navigation.setOptions({
      headerRight: () => this._getHeaderLoader()
    });

    callback.then((photos) => {
      const cPhotos = [];
      for (let photo of photos) {
        cPhotos.push(photo.uri);

      }
      if (this.props.route.params !== undefined) {
        //new post from calendar (only keep date)
        if (this.props.route.params.hasOwnProperty('fromCalendar')) {
          var post = this.props.route.params.post
          post.image = cPhotos
          navigation.replace('PostEditorStack', {
            images: cPhotos,
            post: this.props.route.params.post,
            reeditindex: -1
          });

        } else //reedit:only change 1 pic
          if (this.props.route.params?.hasOwnProperty('reeditindex')) {

            var obj = this.props.route.params.post.image
            obj[this.props.route.params.reeditindex] = cPhotos[0]

            navigation.replace('PostEditorStack', {
              images: obj,
              post: this.props.route.params.post,
              reeditindex: this.props.route.params.reeditindex
            });


          } else {
            navigation.replace('PostEditorStack', {
              images: cPhotos
            })
          }
      } else {
        navigation.replace('PostEditorStack', {
          images: cPhotos
        })
      }

    }
    )
      .catch((e) => console.log(e));
  };



  _renderDoneButton = (count, onSubmit) => {
    if (!count) return null;
    return <TouchableOpacity title={'Done'} onPress={onSubmit}>
      <Text onPress={onSubmit}>完成  </Text>
    </TouchableOpacity>
  }

  updateHandler = (count, onSubmit) => {
    this.props.navigation.setOptions({
      title: `已選取${count}張圖片`,
      headerRight: () => this._renderDoneButton(count, onSubmit)
    });
  };

  renderSelectedComponent = (number) => (
    <View style={styles.countBadge}>
      <Text style={styles.countBadgeText}>{number}</Text>
    </View>
  );

  render() {
    const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>;

    return (
      <View style={[styles.flex, styles.container]}>
        <ImageBrowser
          max={
            this.props.route.params !== undefined
              ? (
                this.props.route.params.hasOwnProperty('reeditindex') &&
                  !this.props.route.params.hasOwnProperty('fromCalendar') ? 1 : 99)
              : 99
          }
          onChange={this.updateHandler}
          callback={this.imagesCallback}
          renderSelectedComponent={this.renderSelectedComponent}
          emptyStayComponent={emptyStayComponent}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    position: 'relative'
  },
  emptyStay: {
    textAlign: 'center',
  },
  countBadge: {
    paddingHorizontal: 8.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: 'absolute',
    right: 3,
    bottom: 3,
    justifyContent: 'center',
    backgroundColor: '#ffa45c'
  },
  countBadgeText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 'auto',
    color: '#5d5d5a'
  }
});
