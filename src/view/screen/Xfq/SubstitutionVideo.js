import React, { Component } from 'react';
import { View, Text, TextInput, Pressable, TouchableOpacity, StyleSheet, ScrollView, Platform, AppState } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import { CandyApi, UserApi } from '../../../api';
import { getRandom } from '../../../utils/BaseValidate';
import { Send } from '../../../utils/Http';
import { Loading, RegExp, Toast } from '../../common';
import { Header } from '../../components/Index';
import { Colors } from '../../theme/Index';
import Advert from '../advert/Advert';

class SubstitutionVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Amount: '',
            PayPwd: '',
            isLoading: false,
            num: 0,
            appState: AppState.currentState,
        };
    }

    post = () => {
        const { Amount, PayPwd } = this.state;
        if (Amount == '') {
            Toast.tip('请填写兑换数量')
            return;
        }
        if (PayPwd == '') {
            Toast.tip('请填写支付密码')
            return;
        }
        this.setState({ isLoading: true }, () => {
            UserApi.exchangeXfq(Number(Amount), PayPwd)
                .then((data) => {
                    this.setState({ isLoading: false });
                    Toast.tip('兑换成功');
                    Actions.pop();
                }).catch((err) => this.setState({ isLoading: false }))
        })
    }

    setAmount = (value) => {
        if (RegExp.integer.test(value) || value === '') {
            this.setState({ Amount: value })
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.White }}>
                <Header title={'兑换消费券'} />
                <ScrollView style={{ paddingHorizontal: 20, marginTop: 10, flex: 1 }}>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 14, color: Colors.C12 }}>数量</Text>
                        <View style={{ flexDirection: 'row', height: 50, borderBottomColor: Colors.C13, borderBottomWidth: 1, }}>
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder={`最低兑1个`}
                                value={this.state.Amount}
                                keyboardType={'number-pad'}
                                onChangeText={this.setAmount}
                            />
                            {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 13, color: Colors.C10 }}>{'糖果'} | {Number(this.state.Amount) * 2} 果皮</Text>
                            </View> */}
                        </View>
                        <Text style={{ fontSize: 10, color: Colors.C10, marginTop: 5 }}>{`1荣誉值加1YB兑换1消费券`}</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 14, color: Colors.C12 }}>交易密码</Text>
                        <View style={{ height: 50, borderBottomColor: Colors.C13, borderBottomWidth: 1, }}>
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder={'请输入交易密码'}
                                secureTextEntry={true}
                                value={this.state.PayPwd}
                                onChangeText={(value) => this.setState({ PayPwd: value })}
                            />
                        </View>
                    </View>
                </ScrollView>
                {/* <TouchableOpacity style={this.state.num < 1 ? styles.btnpost2 : styles.btnpost} disabled={this.state.num < 1 ? true : false} onPress={this.post}>
                    <Text style={{fontSize: 16, color: Colors.White}}>兑换</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.btnpost} onPress={this.post}>
                    <Text style={{ fontSize: 16, color: Colors.White }}>兑换</Text>
                </TouchableOpacity>
                {this.state.isLoading && <Loading />}
            </View >
        );
    }
}
const mapStateToProps = state => ({
    candyNum: state.user.candyNum,
});
const mapDispatchToProps = dispatch => ({
    updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })
});
export default connect(mapStateToProps, mapDispatchToProps)(SubstitutionVideo);

const styles = StyleSheet.create({
    btnpost: {
        height: 40,
        marginBottom: 40,
        marginHorizontal: 30,
        backgroundColor: Colors.main,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    btnpost2: {
        height: 40,
        marginBottom: 10,
        marginHorizontal: 30,
        backgroundColor: Colors.grayFont,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    addNum: {
        height: 30,
        paddingHorizontal: 20,
        backgroundColor: Colors.Green,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        flexDirection: 'row'
    },

})
