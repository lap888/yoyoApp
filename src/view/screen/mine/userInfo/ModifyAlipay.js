import React, { Component } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList,
    TextInput, Keyboard,NativeModules
} from 'react-native';
// import { Toast } from 'native-base';
const AliPay = NativeModules.AliPayModule;
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import { Header } from '../../../components/Index';
import { connect } from 'react-redux';
import { LOGOUT } from '../../../../redux/ActionTypes';
import { Colors, Metrics } from '../../../theme/Index';
import { SetAlipay } from '../../../../redux/ActionTypes';
import { Send } from '../../../../utils/Http';
import { Toast } from '../../../common';

class ModifyAlipay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alipay: "",
            pwd: ''
        };
    }
    loginOut() {
        this.props.logout();
        Actions.Login({ relogin: "resetPwd" });
    }
    /**
     * 重置登陆密码
     */
    resetTradePed() {
        Keyboard.dismiss();

        let {alipay, pwd} = this.state;
        /* 非空校验 */
        if (alipay.length === 0) {
            Toast.tipBottom('支付宝为必填项')
            // Toast.show({
            //     text: "支付宝为必填项",
            //     position: "top",
            //     textStyle: { textAlign: "center" },
            // })
            return;
        }
        if (pwd.length === 0) {
            Toast.tipBottom('支付密码为必填项')
            return;
        }

        Send(`api/UserAli/Change`, { alipay: alipay, PayPwd: pwd }).then(res => {
            if (res.code == 200) {
                Toast.tipBottom('修改成功')
                Actions.pop();
                // AliPay.payV2(orderStr, (response) => {
                //     let { resultStatus, memo } = JSON.parse(response);
                //     if (resultStatus == "9000") {
                //         this.props.modifyAlipay(alipay);
                //         //接口更新数据
                //         Actions.pop();
                //     } else {
                //     }
                // });
            } else {
                Toast.tipBottom('修改支付宝失败')
            }
        })
    }
    render() {
        return (
            <View style={styles.businessPwdPageView}>
                <Header title="修改支付宝" />
                <LinearGradient colors={[Colors.C6, Colors.LightG]} start={{ x: 0, y: 0.1 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
                    <View style={styles.pwdViewStyle}>
                        <View style={{ paddingVertical: 5, backgroundColor: "#ffffff" }}>
                            <Text style={{ color: Colors.C6, fontSize: 14, }}> 提示: 修改支付宝需要支付50糖果+100果皮服务费用 </Text>
                        </View>
                        <TextInput style={styles.inputViewStyle}
                            placeholder="请输入新支付宝"
                            autoCapitalize="none"
                            clearButtonMode="always"
                            onChangeText={(text) => {
                                this.setState({
                                    alipay: text
                                })
                            }}
                        />
                        <TextInput style={styles.inputViewStyle}
                            placeholder="请输入支付密码"
                            autoCapitalize="none"
                            clearButtonMode="always"
                            secureTextEntry={true} 
                            onChangeText={(text) => this.setState({ pwd: text }) }
                        />
                        <View style={styles.submitView}>
                            <TouchableOpacity onPress={() => { this.resetTradePed() }}>
                                <View style={styles.submitBtn} >
                                    <Text style={{ padding: 15, color: "#ffffff" }}> 确认 </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userId: state.user.id,
});

const mapDispatchToProps = dispatch => ({
    modifyAlipay: (alipay) => dispatch({ type: SetAlipay, payload: { alipay: alipay } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModifyAlipay);

// 样式
const styles = StyleSheet.create({
    businessPwdPageView: {
        backgroundColor: "#ffffff",
        height: Metrics.screenHeight * 1,
    },
    pwdViewStyle: {
        padding: 10,
    },
    inputViewStyle: {
        height: 48,
        paddingLeft: 10,
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: Colors.LightG,
    },
    submitView: {
        height: Metrics.screenHeight * 0.4,
        justifyContent: 'center',
        alignItems: "center",
    },
    submitBtn: {
        backgroundColor: Colors.C6,
        width: Metrics.screenWidth * 0.6,
        alignItems: "center",
        borderRadius: 8,
    },
})