/*
 * @Author: top.brids 
 * @Date: 2019-12-22 17:10:01 
 * @Last Modified by: top.brids
 * @Last Modified time: 2019-12-22 17:21:48
 */

import React, { Component } from 'react';
import {
    View, Text, ScrollView, StyleSheet, Animated, TouchableWithoutFeedback, ViewPropTypes, InteractionManager, Dimensions, Platform
} from 'react-native';
import * as PropTypes from 'prop-types';
const Metrics = Dimensions.get('window');
const ITEM_GRAP = 10;				// 图片之间的grap
const ANIMATED_DURATION = 500;		// 动画duration
let UNDERLINE_WIDTH = 60;			// 下划线宽度
export default class ScrollTopBar extends Component {
    static propTypes = {
        initinalIndex: PropTypes.number,
        topBarUnderlineStyle: PropTypes.oneOfType([
            ViewPropTypes.style,
            PropTypes.number,
        ]),
        labelList: PropTypes.array,
        topBarInactiveTextColor: PropTypes.string,
        topBarActiveTextColor: PropTypes.string,
        topBarBackgroundColor: PropTypes.string,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        initinalIndex: 0,
        topBarUnderlineStyle: {},
        labelList: ['推荐'],
        topBarInactiveTextColor: '#aab9ca',
        topBarActiveTextColor: '#298eff',
        topBarBackgroundColor: '#FFFFFF',
        onChange: () => { }
    }
    constructor(props) {
        super(props);
        this.state = {
            index: props.initinalIndex === 0 ? 0 : -1,
            position: new Animated.Value(0),
            topBar: new Animated.Value(0),
            underline: new Animated.Value(ITEM_GRAP),
        };
        this.rootTag = null;
        this.topBarContentWidth = 0;
        this.touchMove = { pageX: -1, pageY: -1 };		// 记录内容区手势
        this.clickHistory = [props.initinalIndex];
    }
    UNSAFE_componentWillMount() {
        let topBarUnderlineStyle = this.props.topBarUnderlineStyle;
        if (typeof topBarUnderlineStyle === 'object') {
            if ('width' in topBarUnderlineStyle) UNDERLINE_WIDTH = topBarUnderlineStyle['width'];
        } else if (typeof topBarUnderlineStyle === 'number') {
            let styleObject = StyleSheet.flatten(topBarUnderlineStyle);
            if ('width' in styleObject) UNDERLINE_WIDTH = styleObject['width'];
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            // this.switchTopBar(this.state.index);
            this.initTopBar(this.props.initinalIndex);
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.clickHistory.indexOf(nextState.index) === -1) {
            // 点击记录
            this.clickHistory.push(nextState.index);
        }
        return true;
    }
    /**
	 * 初始化TopBar
	 * @param {*} index 
	 */
    initTopBar(index) {
        // 获取
        if (this.state.index === 0 && index === 0) {
            return;
        }

        if (!this.refs[`topBar${index}`]) return;

        this.props.onChange(index);

        if (index > this.state.index) {
            // 往左滑动,渲染右侧界面
            if (this.state.index < (this.props.labelList.length - 1)) {
                this.refs[`topBar${index}`].measureLayout(this.rootTag, (left, top, width, height) => {
                    this.setState({ position: new Animated.Value(-Metrics.width * index), underline: new Animated.Value(left + (width - UNDERLINE_WIDTH) / 2) }, () => {
                        this.setState({ index }, () => {
                            this.checkTopBarPosition('forward');
                        });
                    })
                });
            }
        } else {
            // 往右滑动,渲染左侧界面
            if (this.state.index > 0) {
                this.refs[`topBar${index}`].measureLayout(this.rootTag, (left, top, width, height) => {
                    this.setState({ position: new Animated.Value(-Metrics.width * index), underline: new Animated.Value(left + (width - UNDERLINE_WIDTH) / 2) }, () => {
                        this.setState({ index }, () => {
                            this.checkTopBarPosition('back');
                        });
                    })
                });
            }
        }
    }
    /**
	 * 判断下一个TopBar下次滑动是否可视
	 */
    checkTopBarPosition(flag) {
        // 是否探明TopBar边界
        if (!this.topBarContentWidth) {
            this.refs[`topBar${this.props.labelList.length - 1}`].measureLayout(this.rootTag, (left, top, width, height) => {
                // console.log('left=' + left + ',top=' + top + ',width' + width + ',height' + height);
                this.topBarContentWidth = width + left;
                this.checkTopBarPosition(flag);
            });
            return;
        }

        // 如果topBar区域小于界面宽度，放弃边界检查
        if (this.topBarContentWidth <= Metrics.width) return;

        // 左边界情况处理
        // 右边界情况处理

        if (flag === 'forward' && this.state.index < (this.props.labelList.length - 1)) {

            this.refs[`topBar${this.state.index + 1}`].measureLayout(this.rootTag, (left, top, width, height) => {
                this.refs[`topBar${this.state.index + 1}`].measure((x, y, width, height, pageX, pageY) => {
                    if (pageX + width > Metrics.width) {
                        let translateX = left + Metrics.width / 2 - pageX;
                        // 判断下次滑动是否触底
                        if (this.topBarContentWidth && translateX > (this.topBarContentWidth - Metrics.width)) translateX = this.topBarContentWidth - Metrics.width;
                        this.scrollview.scrollTo({ x: translateX, animated: true })
                    }
                })
            });
        } else if (flag === 'back' && this.state.index > 0) {

            this.refs[`topBar${this.state.index - 1}`].measureLayout(this.rootTag, (left, top, width, height) => {
                this.refs[`topBar${this.state.index - 1}`].measure((x, y, width, height, pageX, pageY) => {
                    if (pageX < 0) {
                        let translateX = left - Metrics.width / 2 - pageX;
                        // 判断下次滑动是否触底
                        if (translateX < 0) translateX = 0;
                        this.scrollview.scrollTo({ x: translateX, animated: true })
                    }
                });
            });
        }
    }
    /**
	 * 切换TopBar
	 * @param {*} index
	 */
    switchTopBar(index) {
        // 获取
        if (this.state.index === 0 && index === 0) {
            return;
        }

        if (!this.refs[`topBar${index}`]) return;

        this.props.onChange(index);

        if (index > this.state.index) {
            // 往左滑动,渲染右侧界面
            if (this.state.index < (this.props.labelList.length - 1)) {
                this.refs[`topBar${index}`].measureLayout(this.rootTag, (left, top, width, height) => {
                    Animated.parallel([
                        Animated.timing(this.state.position, {
                            toValue: -Metrics.width * index,
                            duration: ANIMATED_DURATION,
                            isInteraction: true,
                            useNativeDriver: false
                        }),
                        Animated.timing(this.state.underline, {
                            toValue: left + (width - UNDERLINE_WIDTH) / 2,
                            duration: ANIMATED_DURATION,
                            isInteraction: true,
                            useNativeDriver: false
                        }),
                    ], {useNativeDriver: false}).start(() => {
                        this.setState({ index }, () => {
                            this.checkTopBarPosition('forward');
                        });
                    });
                });
            }
        } else {
            // 往右滑动,渲染左侧界面
            if (this.state.index > 0) {
                this.refs[`topBar${index}`].measureLayout(this.rootTag, (left, top, width, height) => {
                    // console.log('left=' + left + ',top=' + top + ',width' + width + ',height' + height);
                    Animated.parallel([
                        Animated.timing(this.state.position, {
                            toValue: -Metrics.width * index,
                            duration: ANIMATED_DURATION,
                            isInteraction: true,
                            useNativeDriver: false
                        }),
                        Animated.timing(this.state.underline, {
                            toValue: left + (width - UNDERLINE_WIDTH) / 2,
                            duration: ANIMATED_DURATION,
                            isInteraction: true,
                            useNativeDriver: false
                        }),
                    ], {useNativeDriver: false}).start(() => {
                        this.setState({ index }, () => {
                            this.checkTopBarPosition('back');
                        });
                    });
                })

            }
        }
    }
    /**
         * 渲染TopBar
         */
    renderTopBar() {
        return (
            <View>
                <ScrollView
                    ref={e => { if (e) this.scrollview = e }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ backgroundColor: this.props.topBarBackgroundColor }}
                >
                    <View>
                        <View style={{ flexDirection: 'row', aliginItems: 'center' }}>
                            {this.props.labelList.map((item, index) => {
                                const check = this.state.index === index;
                                const title = typeof item === 'object' ? item.title : item;
                                return (
                                    <TouchableWithoutFeedback key={index} onPress={() => this.switchTopBar(index)} key={index}>
                                        <View
                                            ref={`topBar${index}`}
                                            collapsable={false}
                                            style={{
                                                justifyContent: 'center', padding: ITEM_GRAP, paddingBottom: 15, paddingTop: 15, backgroundColor: this.props.topBarBackgroundColor,
                                            }}
                                        >
                                            <Text style={[{ color: this.props.topBarInactiveTextColor }, check && { color: this.props.topBarActiveTextColor }]}>{title}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                );
                            })}
                        </View>
                        {this.renderTopUnderline()}
                    </View>
                </ScrollView>
            </View>
        );
    }
    /**
	 * 渲染TopBar 的 UnderLine
	 */
    renderTopUnderline() {
        return (
            <Animated.View ref={e => { if (e) this.underline = e }} style={[{ transform: [{ translateX: this.state.underline }], backgroundColor: '#298eff', height: 4, width: UNDERLINE_WIDTH, marginTop: -4, useNativeDriver: false }, this.props.topBarUnderlineStyle, this.state.index === -1 && { height: 0 }]} />
        );
    }
    /**
	 * moveX 	自上次反馈之后的x坐标移动
	 * x0	 	滑动手势识别开始的时候的在屏幕中的坐标
	 * dx		累计滑动距离
	 * vx		滑动距离
	 * Content 手势停止，开启动画
	 * @param {*} gestureState
	 */
    onPanResponderRelease(gestureState) {
        // console.log(gestureState)
        // 降低界面滑动敏感度
        if (Math.abs(gestureState.dx) < 60 || Math.abs(gestureState.dy) > 20) return;
        if (gestureState.dx < 0) {
            // 往左滑动,渲染右侧界面
            if (this.state.index < (this.props.labelList.length - 1)) {

                this.refs[`topBar${this.state.index + 1}`].measureLayout(this.rootTag, (left, top, width, height) => {
                    // console.log('left=' + left + ',top=' + top + ',width' + width + ',height' + height)
                    Animated.parallel([
                        Animated.timing(this.state.position, {
                            toValue: -Metrics.width * (this.state.index + 1),
                            duration: ANIMATED_DURATION,
                            isInteraction: true,
                            useNativeDriver: false
                        }),
                        Animated.timing(this.state.underline, {
                            toValue: left + (width - UNDERLINE_WIDTH) / 2,
                            duration: ANIMATED_DURATION,
                            isInteraction: true,
                            useNativeDriver: false
                        }),
                    ], {useNativeDriver: false}).start(() => {
                        this.setState({ index: ++this.state.index }, () => {
                            if (this.state.index < this.props.labelList.length - 1) this.checkTopBarPosition('forward');
                        });
                    });
                });
            }
        } else {
            // 往右滑动,渲染左侧界面
            if (this.state.index <= 0) return;

            this.refs[`topBar${this.state.index - 1}`].measureLayout(this.rootTag, (left, top, width, height) => {
                // console.log('left=' + left + ',top=' + top + ',width' + width + ',height' + height)
                Animated.parallel([
                    Animated.timing(this.state.position, {
                        toValue: -Metrics.width * (this.state.index - 1),
                        duration: ANIMATED_DURATION,
                        isInteraction: true,
                        useNativeDriver: false
                    }),
                    Animated.timing(this.state.underline, {
                        toValue: left + (width - UNDERLINE_WIDTH) / 2,
                        duration: ANIMATED_DURATION,
                        isInteraction: true,
                        useNativeDriver: false
                    }),
                ], {useNativeDriver: false}).start(() => {
                    this.setState({ index: --this.state.index }, () => {
                        if (this.state.index > 0) this.checkTopBarPosition('back');
                    });
                });

            });
        }
    }
    /**
	 * 内容区手势捕捉
	 * @param {*} key
	 * @param {*} value
	 */
    onTouchMove(key, nativeEvent) {
        if (key === 'start') {
            this.touchMove = { pageX: nativeEvent.pageX, pageY: nativeEvent.pageY };
        } else if (key === 'end') {
            const { pageX, pageY } = this.touchMove;
            this.onPanResponderRelease({ dx: nativeEvent.pageX - pageX, dy: nativeEvent.pageY - pageY });
        }
    }
    /**
	 * 渲染列表内容
	 */
    renderContent() {
        return (
            <Animated.View style={{
                flex: 1,
                flexDirection: 'row',
                width: Metrics.width * this.props.labelList.length,
                transform: [{ translateX: this.state.position }],
                useNativeDriver: false
            }}
            >
                {React.Children.map(this.props.children, (child, index) => {
                    const props = {
                        ...child.props,
                        onTouchStart: e => this.onTouchMove('start', e.nativeEvent),
                        onTouchEnd: e => this.onTouchMove('end', e.nativeEvent),
                    };
                    return this.clickHistory.indexOf(index) !== -1
                        ? <View {...props} style={{ flex: 1, backgroundColor: '#FFFFFF' }}>{React.cloneElement(child, props)}</View>
                        : <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
                })}
            </Animated.View>
        );
    }
    render() {
        return (
            <View style={Styles.container} onLayout={e => this.rootTag = e.nativeEvent.target}>
                {this.renderTopBar()}
                {this.renderContent()}
            </View>
        );
    }
}
const Styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#eceff4' },
});
