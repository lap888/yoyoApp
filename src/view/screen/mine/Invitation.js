import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Animated, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import * as WeChat from 'react-native-wechat-lib';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { captureRef } from 'react-native-view-shot';
import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import { WEB_PATH } from '../../../config/Index';
const OPTIONS = [
    { key: 0, name: "微信好友", size: 42, imageUrl: require("../../images/icon64_appwx_logo.png") },
    { key: 1, name: "朋友圈", size: 56, imageUrl: require("../../images/icon_res_download_moments.png") },
];
class Invitation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qrcodeUrl: `${WEB_PATH}down?code=${this.props.code == "0" ? this.props.mobile : this.props.code}`,
            bottom: new Animated.Value(-156),
            opacity: new Animated.Value(0),
        }
    }
    /**
     * HeaderRight点击事件
     */
    onRightPress() {
        Animated.parallel([
            Animated.timing(this.state.bottom, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false
            }),
            Animated.timing(this.state.opacity, {
                toValue: 0.81,
                duration: 400,
                useNativeDriver: false
            }),
        ]).start();
    }
    /**
     * 关闭分享Board
     */
    closeShareBoard() {
        Animated.parallel([
            Animated.timing(this.state.bottom, {
                toValue: -156,
                duration: 400,
                useNativeDriver: false
            }),
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false
            }),
        ]).start();
    }
    /**
     * 获取标签截图
     */
    captureRef(key) {
        if (!this.refs.shareViewShot) return;
        captureRef(
            this.refs.shareViewShot, {
            format: 'jpg',
            quality: 0.5,
            result: "tmpfile"
        }).then(response => {
            let imagePath = response;
            if (Platform.OS === 'android') {
                imagePath = response.replace("file://", "");
            } else {
                imagePath = "file://" + response;
            }
            this.wechatShare(key, imagePath);
        }).catch(e => {
            console.log(e);
        });
    }
    /**
     * 微信分享
     * @param {*} key 
     * @param {*} imagePath 
   */
    wechatShare(key, imagePath) {
        WeChat.shareLocalImage({ imageUrl: imagePath, scene: key })
            .then((data) => {
                console.log('data', data);
            }).catch((err) => console.log('err', err))
    }
    /**
     * 渲染分享Board
     */
    renderShareBoard() {
        return (
            <Animated.View style={[Styles.shareContainer, { bottom: this.state.bottom, opacity: this.state.opacity }]}>
                <View style={Styles.shareBody}>
                    {OPTIONS.map(item => {
                        let { key, name, size, imageUrl } = item;
                        return (
                            <TouchableOpacity key={key} onPress={() => this.captureRef(key)}>
                                <View style={Styles.shareItem}>
                                    <View style={Styles.shareImage}>
                                        <Image source={imageUrl} style={{ width: size, height: size, borderRadius: size / 2 }} />
                                    </View>
                                    <Text style={Styles.shareText}>{name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <TouchableOpacity style={{ position: 'absolute', bottom: 0, alignSelf: 'center' }} onPress={() => this.closeShareBoard()}>
                    <View style={Styles.shareFooter}>
                        <Text style={Styles.shareFooterText}>取消</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        )
    }
    /**
     * 渲染二维码
     */
    renderQRCode() {
        let invitCode = this.props.rcode == "0" ? this.props.mobile : this.props.rcode;
        let qrcodeUrl = `${WEB_PATH}?code=${invitCode}`;
        return (
            <View ref="shareViewShot" style={{ flex: 1, backgroundColor: 'transparent' }}>
                <ImageBackground
                    source={require('../../images/inviter4.png')}
                    resizeMode={'stretch'}
                    style={{ flex: 1, width: Metrics.screenWidth }}
                >
                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ position: 'absolute', top: 10, left: 10, flexDirection: 'row' }}>
                            <Image style={{ borderRadius: 17.5, height: 35, width: 35 }} source={{ uri: this.props.avatarUrl }} />
                            <Text style={{ fontSize: 14, color: Colors.main, marginLeft: 10, marginTop: 10, fontWeight: 'bold' }}>118cfzs.com

                            </Text>
                        </View>
                    </View>
                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 15, color: Colors.main,marginTop: 10, }}>扫描二维码下载APP</Text>
                        <View style={{ borderWidth: 4, borderColor: Colors.White, borderRadius: 5, marginTop: 10 }}>
                            <QRCode
                                value={qrcodeUrl}
                                logoSize={30}
                                size={90}
                            />
                        </View>
                        <Text style={{ fontSize: 15, color: Colors.main, marginTop: 10, fontWeight: 'bold' }}>邀请码:<Text style={{ color: Colors.main, fontSize: 16, }}>{invitCode}</Text></Text>
                    </View>
                    <View style={{ flex: 8, justifyContent: 'center', alignItems: 'center' }}></View>
                </ImageBackground>
                {/* <View style={{position: 'absolute', backgroundColor: Colors.White, bottom: 10, height: 80, width: Metrics.screenWidth-40, marginHorizontal: 20, paddingLeft: 10, borderWidth: 1, borderColor: Colors.White, borderRadius: 5}}> */}
                {/* <View style={{ position: 'absolute', top: 50, height: 80, width: Metrics.screenWidth - 40, marginHorizontal: 20, paddingLeft: 10, }}>
                    <Text style={{ fontSize: 15, color: Colors.main, marginTop: 10, fontWeight: 'bold' }}>我的邀请码：<Text style={{ color: Colors.inviterText, fontSize: 20, }}>{invitCode}</Text></Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        <Image style={{ borderRadius: 17.5, height: 35, width: 35 }} source={{ uri: this.props.avatarUrl }} />
                        <View>
                            <Text style={{ fontSize: 12, color: Colors.main, marginLeft: 10, fontWeight: 'bold' }}>我是<Text style={{ color: Colors.inviterText, fontSize: 20, }}>{this.props.name}</Text> 我为<Text style={{ color: Colors.inviterText, fontSize: 15, }}>创富助手</Text>代言</Text>
                            <Text style={{ fontSize: 12, color: Colors.main, marginLeft: 10 }}><Text style={{ color: Colors.inviterText, fontSize: 15, }}>扫描</Text>二维码 开启创富助手之旅</Text>
                        </View>
                    </View>
                    <View style={{ position: 'absolute', right: 10, top: 5 }}>
                        <View style={{ borderWidth: 2, borderColor: Colors.inviterText, borderRadius: 5 }}>
                            <QRCode
                                value={qrcodeUrl}
                                logoSize={30}
                                size={60}
                            />
                        </View>
                    </View>
                </View> */}
            </View>
        )
    }

    render() {
        return (
            <View style={Styles.container}>
                {/* <Header title="邀请好友" rightIcon="share-alt" rightIconSize={20} onRightPress={() => this.onRightPress()} /> */}
                <Header title="邀请好友" />
                {this.renderQRCode()}
                {this.renderShareBoard()}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    mobile: state.user.mobile,
    name: state.user.name,
    avatarUrl: state.user.avatarUrl,
    rcode: state.user.rcode
});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(Invitation);

const Styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.C6 },
    layout: { flexDirection: "row", paddingLeft: 10 },
    userPhoto: { width: 80, height: 80, borderRadius: 40, marginRight: 10 },
    layoutFont: { marginTop: 6, color: '#ffffff', fontSize: 17 },
    shareContainer: { position: 'absolute', backgroundColor: '#FFFFFF', height: 156, left: 0, right: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
    shareHeader: { alignSelf: 'center', padding: 20, fontSize: 16, fontWeight: "400" },
    shareBody: { flexDirection: 'row', paddingTop: 20 },
    shareItem: { justifyContent: 'center', alignItems: 'center', paddingLeft: 20 },
    shareImage: { justifyContent: 'center', alignItems: 'center', width: 50, height: 50 },
    shareText: { marginTop: 6 },
    shareFooter: { alignSelf: 'center', padding: 20 },
    shareFooterText: { fontSize: 16, fontWeight: "400" },
});
