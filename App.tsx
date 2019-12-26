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
    Animated, Easing
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

        this.idle = require('./assets/idle.png');
        this.jump = require('./assets/jump.png');
        this.sprite = this.idle;
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
        if (event.nativeEvent.state === State.ACTIVE) {
            alert("I'm being pressed for so long");
        }
    };
    _onSingleTap = event => {
        //console.log("event.nativeEvent.state: ", event.nativeEvent.state);
        //console.log("State.ACTIVE: ", State.ACTIVE);
        if (event.nativeEvent.state === State.ACTIVE && !this.state.waittime) {
            this.setState({ waittime: true });
            this.play('idle');
            var _self = this;
            setTimeout(function () {
                _self.setState({ waittime: false });
            }, 500);
        }
    };
    _onDoubleTap = event => {
        if (event.nativeEvent.state === State.ACTIVE) {
            this.play('walk');
        }
    };

    onSwipeUp = event =>  {
        console.log("SwipeUp");
        this.sprite = this.jump;
        this.setState({ loop: false }, () => {
            //this.play('jump');
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
        console.log("end animation");
        this.sprite = this.idle;
        this.play('idle');
    }
    onSwipe(gestureName, gestureState) {
        const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
        //this.setState({ gestureName: gestureName });
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
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
                            <LongPressGestureHandler
                                onHandlerStateChange={this._onHandlerStateChange}
                                minDurationMs={800}>
                                <TapGestureHandler
                                    onHandlerStateChange={this._onSingleTap}
                                    waitFor={this.doubleTapRef}>
                                    <View style={styles.box}>
                                        <SpriteSheet
                                            ref={ref => (this.mummy = ref)}
                                            source={this.sprite}
                                            columns={3}
                                            rows={4}
                                            //height={100} // set either, none, but not both
                                            //width={600}
                                            imageStyle={{ marginTop: -1 }}
                                            animations={{
                                                idle: [0, 1, 3, 4, 6, 7, 9, 10, 2, 5],
                                                jump: [0, 1, 3, 4, 6, 7, 9, 10, 2, 5, 8],
                                                walk: [0, 1, 3, 4, 6, 7, 9, 10, 2, 5],
                                                hit1: [0, 1, 2, 3, 4],
                                                hit2: [5, 6, 8, 9, 10, 11, 12],
                                                appear: Array.from({ length: 15 }, (v, i) => i + 18),
                                                die: Array.from({ length: 21 }, (v, i) => i + 33)
                                            }}
                                        />
                                    </View>
                                </TapGestureHandler>
                            </LongPressGestureHandler>
                        </GestureRecognizer>
                    </View>
                    <View style={{ paddingVertical: 30, paddingHorizontal: 30 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Button onPress={() => this.play('walk')} title="Soco" />
                            <Button onPress={() => this.play('appear')} title="appear" />
                            <Button onPress={() => this.play('die')} title="die" />
                            <Button onPress={this.stop} title="stop" />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, marginRight: 10 }}>FPS</Text>
                            <TextInput
                                style={{ flex: 1, borderBottomWidth: 1, fontSize: 16 }}
                                value={fps}
                                keyboardType="number-pad"
                                onChangeText={fps => this.setState({ fps })}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, marginRight: 10 }}>Loop</Text>
                            <Switch value={loop} onValueChange={loop => this.setState({ loop })} />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, marginRight: 10 }}>Reset After Finish</Text>
                            <Switch
                                value={resetAfterFinish}
                                onValueChange={val => this.setState({ resetAfterFinish: val })}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }

    play = type => {
        
        const { fps, loop, resetAfterFinish } = this.state;
        console.log("play");
        console.log("loop: ", loop);
        console.log("resetAfterFinish: ", resetAfterFinish);
        this.mummy.play({
            type,
            fps: Number(fps),
            loop: loop,
            resetAfterFinish: resetAfterFinish,
            onLoad: () => this.play('idle'),
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
    box: {
        zIndex: 200,
    },
});