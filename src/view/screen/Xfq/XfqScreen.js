import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, NativeModules, SafeAreaView, ScrollView, RefreshControl, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { LOGOUT, UPDATE_USER_AVATAR } from '../../../redux/ActionTypes';
import { Colors, Metrics } from '../../theme/Index';
import { Loading, Toast } from '../../common';
import { TaskApi } from '../../../api';
import CurrencyApi from '../../../api/yoyoTwo/currency/CurrencyApi';
import { ShopApi } from '../../../api';
import { Header } from '../../components/Index';
import Advert from '../advert/Advert';
import { Send } from '../../../utils/Http';
import LinearGradient from 'react-native-linear-gradient';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import GoodsListItem from '../shop/GoodsListItem';


const PLAY_OPTIONS = [
    { key: 1, name: "荣誉碎片", route: 'jifen', color: '#FFA500', image: require('../../images/home2/kuangji.png'), icon: '' },
    { key: 2, name: "荣誉值", route: 'xfjifen', color: '#4cc7ab', image: require('../../images/home2/duihuan.png'), icon: '' },
    { key: 3, name: "消费券", route: 'xfq', color: '#00BFFF', image: require('../../images/home2/zhangwu.png'), icon: '' },
];
let AdLists = [
    // { id: 1, title: '第一梯队', color: '#1e93f6', desc: '做此任务时间段为0:00-1:00', isFinish: false },
    // { id: 2, title: '第一梯队', color: '#fd2701', desc: '做此任务时间段为0:00-1:00', isFinish: false },
    // { id: 3, title: '第二梯队', color: '#FFA500', desc: '做此任务时间段为1:00-2:00', isFinish: false },
    // { id: 4, title: '第二梯队', color: '#4cc7ab', desc: '做此任务时间段为1:00-2:00', isFinish: false },
    // { id: 5, title: '第三梯队', color: '#127f07', desc: '做此任务时间段为2:00-3:00', isFinish: false },
    // { id: 6, title: '第三梯队', color: '#00BFFF', desc: '做此任务时间段为2:00-3:00', isFinish: false },
    // { id: 7, title: '第四梯队', color: '#994dd7', desc: '做此任务时间段为3:00-4:00', isFinish: false },
    // { id: 8, title: '第四梯队', color: '#134dd7', desc: '做此任务时间段为3:00-4:00', isFinish: false },
    // { id: 9, title: '第五梯队', color: '#11A500', desc: '做此任务时间段为4:00-5:00', isFinish: false },
    // { id: 10, title: '第五梯队', color: '#FFA5FF', desc: '做此任务时间段为4:00-5:00', isFinish: false },

    // { id: 11, title: '第六梯队', color: '#1e93f6', desc: '做此任务时间段为5:00-6:00', isFinish: false },
    // { id: 12, title: '第六梯队', color: '#fd2701', desc: '做此任务时间段为5:00-6:00', isFinish: false },
    // { id: 13, title: '第七梯队', color: '#FFA500', desc: '做此任务时间段为6:00-7:00', isFinish: false },
    // { id: 14, title: '第七梯队', color: '#4cc7ab', desc: '做此任务时间段为6:00-7:00', isFinish: false },
    { id: 15, title: '第八梯队', color: '#FFA500', desc: '做此任务时间段为7:00-8:00', isFinish: false },
    { id: 16, title: '第八梯队', color: '#00BFFF', desc: '做此任务时间段为7:00-8:00', isFinish: false },
    { id: 17, title: '第九梯队', color: '#994dd7', desc: '做此任务时间段为8:00-9:00', isFinish: false },
    { id: 18, title: '第九梯队', color: '#134dd7', desc: '做此任务时间段为8:00-9:00', isFinish: false },
    { id: 19, title: '第十梯队', color: '#11A500', desc: '做此任务时间段为9:00-10:00', isFinish: false },
    { id: 20, title: '第十梯队', color: '#FFA5FF', desc: '做此任务时间段为9:00-10:00', isFinish: false },

    { id: 21, title: '第十一梯队', color: '#1e93f6', desc: '做此任务时间段为10:00-11:00', isFinish: false },
    { id: 22, title: '第十一梯队', color: '#fd2701', desc: '做此任务时间段为10:00-11:00', isFinish: false },
    { id: 23, title: '第十二梯队', color: '#FFA500', desc: '做此任务时间段为11:00-12:00', isFinish: false },
    { id: 24, title: '第十二梯队', color: '#4cc7ab', desc: '做此任务时间段为11:00-12:00', isFinish: false },
    { id: 25, title: '第十三梯队', color: '#127f07', desc: '做此任务时间段为12:00-13:00', isFinish: false },
    { id: 26, title: '第十三梯队', color: '#00BFFF', desc: '做此任务时间段为12:00-13:00', isFinish: false },
    { id: 27, title: '第十四梯队', color: '#994dd7', desc: '做此任务时间段为13:00-14:00', isFinish: false },
    { id: 28, title: '第十四梯队', color: '#134dd7', desc: '做此任务时间段为13:00-14:00', isFinish: false },
    { id: 29, title: '第十五梯队', color: '#11A500', desc: '做此任务时间段为14:00-15:00', isFinish: false },
    { id: 30, title: '第十五梯队', color: '#FFA5FF', desc: '做此任务时间段为14:00-15:00', isFinish: false },

    { id: 31, title: '第十六梯队', color: '#1e93f6', desc: '做此任务时间段为15:00-16:00', isFinish: false },
    { id: 32, title: '第十六梯队', color: '#fd2701', desc: '做此任务时间段为15:00-16:00', isFinish: false },
    { id: 33, title: '第十七梯队', color: '#FFA500', desc: '做此任务时间段为16:00-17:00', isFinish: false },
    { id: 34, title: '第十七梯队', color: '#4cc7ab', desc: '做此任务时间段为16:00-17:00', isFinish: false },
    { id: 35, title: '第十八梯队', color: '#127f07', desc: '做此任务时间段为17:00-18:00', isFinish: false },
    { id: 36, title: '第十八梯队', color: '#00BFFF', desc: '做此任务时间段为17:00-18:00', isFinish: false },
    { id: 37, title: '第十九梯队', color: '#994dd7', desc: '做此任务时间段为18:00-19:00', isFinish: false },
    { id: 38, title: '第十九梯队', color: '#134dd7', desc: '做此任务时间段为18:00-19:00', isFinish: false },
    { id: 39, title: '第二十梯队', color: '#11A500', desc: '做此任务时间段为19:00-20:00', isFinish: false },
    { id: 40, title: '第二十梯队', color: '#FFA5FF', desc: '做此任务时间段为19:00-20:00', isFinish: false },

    { id: 41, title: '第二十一梯队', color: '#1e93f6', desc: '做此任务时间段为20:00-21:00', isFinish: false },
    { id: 42, title: '第二十一梯队', color: '#fd2701', desc: '做此任务时间段为20:00-21:00', isFinish: false },
    { id: 43, title: '第二十二梯队', color: '#FFA500', desc: '做此任务时间段为21:00-22:00', isFinish: false },
    { id: 44, title: '第二十二梯队', color: '#4cc7ab', desc: '做此任务时间段为21:00-22:00', isFinish: false },
    // { id: 45, title: '第二十三梯队', color: '#127f07', desc: '做此任务时间段为22:00-23:00', isFinish: false },
    // { id: 46, title: '第二十三梯队', color: '#00BFFF', desc: '做此任务时间段为22:00-23:00', isFinish: false },
    // { id: 47, title: '第二十四梯队', color: '#994dd7', desc: '做此任务时间段为23:00-24:00', isFinish: false },
    // { id: 48, title: '第二十四梯队', color: '#FFA5FF', desc: '做此任务时间段为23:00-24:00', isFinish: false },
]
class XfqScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adLists: [],
            goodsList: [],
            pageIndex: 1,
            pageSize: 20,
            bannerList: [],
            isLoading: false,
            refreshing: false,
            merber: ''
        };
    }

    componentDidMount() {
        // this.onRefresh();
        this.getGoodsList(1);
    }

    onRefresh = () => {
        this.getMinningList()
    }
    reFreshFinishData = (data) => {
        let ads = []
        data.map((v, i) => ads.push(v.VId))
        for (let i = 0; i < AdLists.length; i++) {
            let v = AdLists[i];
            let ishave = ads.indexOf(v.id);
            if (ishave != -1) {
                v.isFinish = true
            } else {
                v.isFinish = false
            }
        }
        return AdLists
    }
    onHeaderRefresh = () => {
        this.setState({
            refreshState: RefreshState.HeaderRefreshing,
            pageIndex: 1
        }, () => {
            this.getGoodsList(1)
        });
    }
    getGoodsList = (index) => {
        const { pageSize } = this.state;
        ShopApi.getHomeShops(index, pageSize)
            .then((data) => {
                this.setState({
                    goodsList: index == 1 ? data : this.state.goodsList.concat(data),
                    refreshState: data.length < pageSize ? RefreshState.EmptyData : RefreshState.Idle
                })
            }).catch(() => {
                this.setState({
                    goodsList: [],
                    refreshState: RefreshState.EmptyData
                })
            })
    }
    getMinningList = () => {
        CurrencyApi.getVideoList()
            .then((data) => {
                let adsnew = this.reFreshFinishData(data)
                this.setState({
                    refreshing: false,
                    adLists: adsnew
                })
            }).catch((err) => this.setState({ refreshing: false }))
    }

    setLoading = (value) => {
        this.setState({ isLoading: value })
    }


    onOptionPress = (item) => {
        Actions.push('AdFlowDetails', { data: item })
    }

    renderOptions = () => {
        return (
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10, marginVertical: 5, flexWrap: 'wrap' }}>
                {
                    PLAY_OPTIONS.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} style={{ width: (Metrics.screenWidth - 40) / 3, marginTop: 10 }} onPress={() => this.onOptionPress(item)}>
                                <View style={styles.optionItem}>
                                    <View style={{ flex: 1, backgroundColor: item.color, padding: 10, borderRadius: 55, width: 80, height: 80, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: Colors.White }}>{item.name}</Text>
                                    </View>
                                    <Text style={styles.optionTitle}>{item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }

    quickenTask = (item) => {
        if (!this.props.logged) {
            Actions.push("Login");
            return;
        }
        const callback = () => {
            TaskApi.lookDayVideo(item.id)
                .then((res) => {
                    if (res.code == 200)
                        Toast.tip('恭喜您领取到1个荣耀碎片')
                    this.onRefresh()
                })
        }
        if (item.isFinish == true) {
            Toast.tip('当前任务已经完成...')
            return;
        }
        //判断小时
        let hTime = item.id - 2;
        if (item.id % 2 != 0) {
            hTime = hTime + 1
        }
        hTime = hTime / 2
        var nowHTime = new Date().getHours()
        if (nowHTime != hTime) {
            Toast.tip('当前时间不可进行此任务...')
            return;
        }
        if (Platform.OS === "android") {
            if (item.id % 2 == 0) {
                Advert.FeiMaAndroid('3831');
                setTimeout(() => {
                    callback();
                }, 10000);
            } else {
                Advert.rewardVideo((res) => {
                    if (res) {
                        callback();
                    } else {
                        Advert.FeiMaAndroid('3831');
                        setTimeout(() => {
                            callback();
                        }, 10000);
                    }
                })
            }
        } else {
            Toast.tip('ios暂时不支持')
        }
    }
    renderItem = (item, index) => {
        let source = require('../../images/dayTask/shipin.png');
        return (
            <TouchableOpacity key={index} style={[styles.miningItem, { backgroundColor: item.color, opacity: 0.8, marginBottom: 5, borderRadius: 5, paddingVertical: 25 }]} onPress={() => { this.quickenTask(item) }}>
                <View style={styles.miningItemHeader}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 40, height: 40 }} resizeMode={'contain'} source={source} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.miningItemActivity}>{`${item.title}`}</Text>
                            <Text style={{ fontSize: 13, marginLeft: 5, marginTop: 5 }}>{`完成任务奖励:${1}荣誉碎片`}</Text>
                            <Text numberOfLines={3} style={styles.miningItemName}>{`${item.desc}`}</Text>
                        </View>
                    </View>
                    <View style={{ marginLeft: 10, height: 20, borderWidth: 1, borderColor: Colors.White, borderRadius: 10, paddingHorizontal: 10, alignItems: 'center' }}>
                        <Text style={{ color: Colors.White, }}>{`${item.isFinish ? '完成' : '未完成'}`}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    onRightPress() {
        Send(`api/system/CopyWriting?type=v_ad_rule`, {}, 'get').then(res => {
            Actions.push('CommonRules', { title: '说明', rules: res.data });
        });
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header title={'消费券'} rightText="说明" rightStyle={{ color: Colors.White }} onRightPress={() => this.onRightPress()} />
                <View style={{ backgroundColor: Colors.backgroundColor }}>
                    <ScrollView style={{ paddingTop: 10, marginBottom: 50, }} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onHeaderRefresh} />} >
                        {this.renderOptions()}
                        <TouchableOpacity style={{ alignItems: 'center', marginVertical: 10 }} onPress={() => {
                            Actions.push('SubstitutionVideo', { canUserCotton: 0 })
                        }}>
                            <LinearGradient colors={[Colors.btnBeforColor, Colors.main]} start={{ x: -0.5, y: -0.1 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 5, width: Metrics.screenWidth / 2, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: Colors.White, fontSize: 16, paddingHorizontal: 15, paddingVertical: 10 }}>{`兑换消费券`}</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={{ alignItems: 'center', marginVertical: 10 }}>
                            <Image style={{ height: 35 }} resizeMode={'contain'} source={require('../../images/dayTask/mainbiaoti.png')} />
                        </View>
                        {/* {this.state.adLists.map((v, i) => this.renderItem(v, i))} */}
                        {/* <ScrollView style={{ paddingTop: 10, flex: 1 }} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onHeaderRefresh} />}>
				        </ScrollView> */}
                        {this.state.goodsList.map((item, index) => <GoodsListItem key={index} data={item} index={index} />)}
                    </ScrollView>
                </View>
            </SafeAreaView >
        );
    }
}

const mapStateToProps = state => ({
    level: state.user.level,
    golds: state.user.golds,
    logged: state.user.logged,
    userId: state.user.id,
    mobile: state.user.mobile,
    name: state.user.name,
    avatarUrl: state.user.avatarUrl,
    inviterMobile: state.user.inviterMobile,
    reWeChatNo: state.user.reWeChatNo,
    reContactTel: state.user.reContactTel,
    myWeChatNo: state.user.myWeChatNo,
    myContactTel: state.user.myContactTel,
    auditState: state.user.auditState,

});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch({ type: LOGOUT }),
    updateUserAvatar: avatar => dispatch({ type: UPDATE_USER_AVATAR, payload: { avatar } })
});

export default connect(mapStateToProps, mapDispatchToProps)(XfqScreen);

const styles = StyleSheet.create({
    level: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    levelText: { fontSize: 18, color: Colors.White, fontWeight: 'bold' },
    contributionValueText: { marginTop: 4, fontSize: 12, color: Colors.White },
    levelPropaganda: { fontSize: 12, color: Colors.White },
    optionTouch: {
        flex: 1
    },
    optionItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionTitle: {
        marginTop: 8,
        fontSize: 14,
        color: Colors.grayFont
    },
    callWe: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // position: 'absolute',
        // bottom: 0,
        backgroundColor: Colors.transparent,
        marginVertical: 10
    },
    wiper: {
        height: 60,
        overflow: "hidden",
        marginVertical: 5,
        marginHorizontal: 15,
        borderRadius: 6
    },
    banner: {
        height: 60,
        width: '100%'
    },
    yuan1: {
        backgroundColor: Colors.main,
        height: 100,
        width: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    yuan2: {
        backgroundColor: Colors.backgroundColor,
        width: 85,
        height: 85,
        borderRadius: 42.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    miningItem: { flex: 1, marginHorizontal: 10, paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.C7 },
    miningItemHeader: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    miningItemName: { fontSize: 13, marginLeft: 5, color: Colors.White, marginTop: 5 },
    miningItemActivity: { fontSize: 16, marginLeft: 5, color: Colors.White },
})