import { ActivityIndicator, Animated, View } from "react-native"
import { Component } from "react"
import { Image } from "react-native"
export default class progressiveImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thumbnailOpacity: new Animated.Value(0)
        }
    }
    onLoad() {
        Animated.timing(this.state.thumbnailOpacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver:true
        }).start()

    }
    onThumbnailLoad() {
        Animated.timing(this.state.thumbnailOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver:true
        }).start();
    }
    render() {
       this.onThumbnailLoad() 
        return (
            <View
                width={this.props.style.width}
                height={this.props.style.height}
                
            >
                <Image
                    style={[
                        {
                            position: 'absolute'
                        },
                        this.props.style
                    ]}
                    imageStyle={{ resizeMode: this.props.imageStyle?.resizeMode||'cover' }}
                    source={this.props.source}
                    onLoad={(event) => this.onLoad(event)}
                />
                <Animated.View
                    style={[
                        {
                            opacity: this.state.thumbnailOpacity,
                            backgroundColor:'#eee',
                            justifyContent:'center', alignItems:'center'
                        },
                        this.props.style
                    ]}

                >
                    <ActivityIndicator size="small" />
                </Animated.View>
            </View>
        )
    }
}

/* export default class CachedImageView extends Component{

    constructor(props) {
        super(props)
    }
    state = {
        imageScaleValue: new Animated.Value(0),
    }

    onImageLoadEnd = () => {
        Animated.timing(this.state.imageScaleValue, {
            toValue: 1,
            duration: 150,
            delay: 5,
            useNativeDriver: true,
        }).start()
    }

    render() {
        return (
            <Animated.View style={{ opacity: this.state.imageScaleValue }}>
                <Image
                    
                  

onLoadEnd = {() => this.onImageLoadEnd()}
{...this.props }
/>
            </Animated.View >
        )
    }

}
 */