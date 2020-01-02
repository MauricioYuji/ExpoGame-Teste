import React from 'react';
import {
    SafeAreaView,
    View,
    Button,
    TextInput,
    Switch,
    Text,
    KeyboardAvoidingView,
    StyleSheet,
    Image,
    Animated, Easing, ImageBackground, TouchableWithoutFeedback
} from 'react-native';
import SpriteSheet from './SpriteSheet';
import { TapGestureHandler, RotationGestureHandler, LongPressGestureHandler, State } from 'react-native-gesture-handler';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';


export default class App extends React.Component {
    [x: string]: any;

    constructor(props) {
        super(props);
        this.time = new Animated.Value(0);
        this.interpolationRanges = {};
        this.cols = 4;
        this.rows = 5;
        this.idle = require('./assets/idle.png');
        this.jump = require('./assets/jump.png');
        this.sprite = this.idle;
        this.hits = [
            { label: "hit1", url: require('./assets/hit1.png') },
            { label: "hit2", url: require('./assets/hit2.png') },
            { label: "hit3", url: require('./assets/hit3.png') },
            { label: "hit4", url: require('./assets/hit4.png') },
            { label: "hit5", url: require('./assets/hit5.png') },
            { label: "hit6", url: require('./assets/hit6.png') }
        ];
    }

    componentDidMount() {
        this.play('idle');
    }
    state = {
        loop: true,
        resetAfterFinish: true,
        fps: '20',
        waittime: false
    };

    doubleTapRef = React.createRef();
    _onLoad = event => {
        this.play('idle');
    };
    _onHandlerStateChange = event => {
        console.log("event.nativeEvent.state: ", event.nativeEvent.state);
        console.log("State.ACTIVE: ", State.ACTIVE);
        if (event.nativeEvent.state === State.ACTIVE) {
            alert("I'm being pressed for so long");
        }
    };
    _onSingleTap = event => {
        //console.log("event.nativeEvent.state: ", event.nativeEvent.state);
        //console.log("State.ACTIVE: ", State.ACTIVE);
        var _self = this;
        var hit = this.hits[Math.floor(Math.random() * _self.hits.length)];
        _self.sprite = hit.url;
        if (!_self.state.waittime) {
            _self.setState({ waittime: true, loop: false }, () => {
                _self.play(hit.label);
            });
        }
    };
    _onLongTap = event => {
        //console.log("event.nativeEvent.state: ", event.nativeEvent.state);
        //console.log("State.ACTIVE: ", State.ACTIVE);
        var _self = this;
        console.log("LONG PRESS");
        //var hit = this.hits[Math.floor(Math.random() * _self.hits.length)];
        //_self.sprite = hit.url;
        //if (!_self.state.waittime) {
        //    _self.setState({ waittime: true, loop: false }, () => {
        //        _self.play(hit.label);
        //    });
        //}
    };

    _onReleaseTap = event => {
        //console.log("event.nativeEvent.state: ", event.nativeEvent.state);
        //console.log("State.ACTIVE: ", State.ACTIVE);
        var _self = this;
        console.log("RELEASE");
        //var hit = this.hits[Math.floor(Math.random() * _self.hits.length)];
        //_self.sprite = hit.url;
        //if (!_self.state.waittime) {
        //    _self.setState({ waittime: true, loop: false }, () => {
        //        _self.play(hit.label);
        //    });
        //}
    };
    _onDoubleTap = event => {
        if (event.nativeEvent.state === State.ACTIVE) {
            this.play('walk');
        }
    };

    onSwipeUp = event => {
        console.log("SwipeUp");
        this.sprite = this.jump;
        this.setState({ loop: false }, () => {
            this.play('jump');
        });
    }

    onSwipeDown(gestureState) {
        console.log("SwipeDown");
    }

    onSwipeLeft(gestureState) {
        console.log("SwipeLeft");
    }

    onSwipeRight(gestureState) {
        console.log("SwipeRight");
    }
    onFinish() {
        //console.log("end animation");
        this.sprite = this.idle;
        this.setState({ loop: true, waittime: false }, () => {
            this.play('idle');
        });
    }
    onSwipe(gestureName, gestureState) {
        const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
        //this.setState({ gestureName: gestureName });
        console.log("gestureName: ", gestureName);
        //switch (gestureName) {
        //    case SWIPE_UP:
        //        this.setState({ backgroundColor: 'red' });
        //        break;
        //    case SWIPE_DOWN:
        //        this.setState({ backgroundColor: 'green' });
        //        break;
        //    case SWIPE_LEFT:
        //        this.setState({ backgroundColor: 'blue' });
        //        break;
        //    case SWIPE_RIGHT:
        //        this.setState({ backgroundColor: 'yellow' });
        //        break;
        //}
    }

    render() {

        const { fps, loop, resetAfterFinish, animationType } = this.state;
        let {
            translateY = { in: [0, 0], out: [0, 2000] },
            translateX = { in: [0, 0], out: [0, 2000] }
        } = this.interpolationRanges[animationType] || {};

        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };
        return (
            <GestureRecognizer
                onSwipe={this.onSwipe}
                onSwipeUp={this.onSwipeUp}
                onSwipeDown={this.onSwipeDown}
                onSwipeLeft={this.onSwipeLeft}
                onSwipeRight={this.onSwipeRight}
                config={config}
                style={{
                    flex: 1,
                    backgroundColor: this.state.backgroundColor
                }}
            >
                <TouchableWithoutFeedback onPress={this._onSingleTap} onLongPress={this._onLongTap} onPressOut={this._onReleaseTap}>

                    <View style={{
                        flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', overflow: 'hidden', backgroundColor: '#000'
                    }}>
                        <View style={{
                            flexDirection: 'column', justifyContent: 'center', alignItems: 'center', maxHeight: 500, height: '100%', width: '100%', overflow: 'hidden', backgroundColor: '#000'
                        }}>
                            <ImageBackground source={require('./assets/ken-stage.gif')} style={{ height: '100%', width: '100%', backgroundColor: '#F00' }} >

                                <View style={styles.box}>
                                    <SpriteSheet
                                        ref={ref => (this.mummy = ref)}
                                        source={this.sprite}
                                        columns={this.cols}
                                        rows={this.rows}
                                        //height={100} // set either, none, but not both
                                        width={800}
                                        imageStyle={{ marginTop: -1, marginLeft: -80 }}
                                        animations={{
                                            idle: Array.from({ length: 10 }, (v, i) => i + 0),
                                            jump: Array.from({ length: 11 }, (v, i) => i + 0),
                                            walk: Array.from({ length: 10 }, (v, i) => i + 0),
                                            hit1: Array.from({ length: 5 }, (v, i) => i + 0),
                                            hit2: Array.from({ length: 7 }, (v, i) => i + 0),
                                            hit3: Array.from({ length: 11 }, (v, i) => i + 0),
                                            hit4: Array.from({ length: 7 }, (v, i) => i + 0),
                                            hit5: Array.from({ length: 7 }, (v, i) => i + 0),
                                            hit6: Array.from({ length: 13 }, (v, i) => i + 0),
                                            appear: Array.from({ length: 15 }, (v, i) => i + 18),
                                            die: Array.from({ length: 21 }, (v, i) => i + 33)
                                        }}
                                    />
                                    <View style={styles.lifebox}>
                                        <ImageBackground source={require('./assets/life-box.png')} style={{ height: '100%', width: '100%', paddingHorizontal: 20 }} >
                                            <View style={{ width: 240, overflow: 'hidden' }}>
                                                <Image source={require('./assets/life.png')} style={{ height: '100%', width: '100%' }} />
                                            </View>
                                        </ImageBackground>
                                    </View>
                                </View>
                            </ImageBackground>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </GestureRecognizer>
        );
    }

    play = type => {

        const { fps, loop, resetAfterFinish } = this.state;
        //console.log("play");
        //console.log("loop: ", loop);
        //console.log("resetAfterFinish: ", resetAfterFinish);
        this.mummy.play({
            type,
            fps: Number(fps),
            loop: loop,
            resetAfterFinish: resetAfterFinish,
            onFinish: () => this.onFinish(),
        });
    };

    stop = () => {
        this.mummy.stop(() => console.log('stopped'));
    };
}


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    lifebox: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: 100,
        width: 300,
        marginLeft: -20
    },
    box: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
        zIndex: 200
    },
});