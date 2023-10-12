import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { Colors, Metrics } from '../../theme/Index';
import { Header } from '../../components/Index';
import { STAR_LEVEL } from '../../../config/Constants';
import { TeamListItem } from '../../components/Index';
import { Send } from '../../../utils/Http';
const OPTIONS = [
    { key: 0, name: "实名直推", route: "authCount" },
    { key: 1, name: "团队活跃度", route: "teamCandyH" },
    { key: 2, name: "大区活跃度", route: "bigCandyH" },
    { key: 3, name: "小区活跃度", route: "littleCandyH" },
];
const TRANSACTION_SEQUENCE = [
    { key: 0, title: '团队活跃度' },
    { key: 1, title: '团队人数' },
    { key: 2, title: '时间' },
];
class MyTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            active: 0,
            teamList: [],
            avatarUrl: '',
            authCount: 0,
            bigCandyH: 0,
            littleCandyH: 0,
            teamCandyH: 0,
            teamCount: 0,
            teamStart: 0,
            type: 0,
            order: 'desc',
        };
    }
    componentDidMount() {
        this.onHeaderRefresh();
    }
    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 })
        let params = {
            pageIndex: 1,
            pageSize: this.state.pageSize,
            type: this.state.type,
            order: this.state.order
        }
        Send('api/TeamInfos', params).then(res => {
            if (res.code == 200) {
                this.setState({
                    authCount: res.data.myTeamInfo.authCount,
                    active: res.data.myTeamInfo.active,
                    bigCandyH: res.data.myTeamInfo.bigCandyH,
                    littleCandyH: res.data.myTeamInfo.littleCandyH,
                    teamCandyH: res.data.myTeamInfo.teamCandyH,
                    teamCount: res.data.myTeamInfo.teamCount,
                    teamStart: res.data.myTeamInfo.teamStart,
                    teamList: res.data.teamInfoList,
                    avatarUrl: res.data.myTeamInfo.avatarUrl,
                    totalPage: res.recordCount,
                    refreshState: res.data.teamInfoList.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
                })
            } else {
                this.setState({
                    authCount: 0,
                    active: 0,
                    bigCandyH: 0,
                    littleCandyH: 0,
                    teamCandyH: 0,
                    teamCount: 0,
                    teamStart: 0,
                    teamList: [],
                    avatarUrl: '',
                    totalPage: 0,
                    refreshState: RefreshState.EmptyData
                })
            }
        });
    }

    onFooterRefresh = () => {
        let that = this;
        that.setState({
            refreshState: RefreshState.FooterRefreshing,
            pageIndex: this.state.pageIndex + 1
        }, () => {
            let params = {
                pageIndex: that.state.pageIndex,
                pageSize: that.state.pageSize,
                type: this.state.type,
                order: this.state.order
            }
            Send('api/TeamInfos', params).then(res => {
                if (res.code == 200) {
                    this.setState({
                        teamList: that.state.teamList.concat(res.data.teamInfoList),
                        totalPage: res.recordCount,
                        refreshState: this.state.teamList.length >= this.state.totalPage ? RefreshState.EmptyData : RefreshState.Idle,
                    })
                } else {
                    this.setState({
                        authCount: 0,
                        active: 0,
                        bigCandyH: 0,
                        littleCandyH: 0,
                        teamCandyH: 0,
                        teamCount: 0,
                        teamStart: 0,
                        teamList: [],
                        avatarUrl: '',
                        totalPage: 0,
                        refreshState: RefreshState.EmptyData
                    })
                }
            });
        });
    }
    keyExtractor = (item, index) => {
        return index.toString()
    }
    /**
     * 跳转-规则
     */
    onRightPress() {
        Send(`api/system/CopyWriting?type=myteam_rule`, {}, 'get').then(res => {
            Actions.push("CommonRules", { title: '团队规则', rules: res.data });
        });
    }

    /**
     * 排序条件变更
     * @param {*} key 
     */
    onChangeSequence(key) {
        let { order, type } = this.state;
        let newType = type;
        let newOrder = order;
        if (type === key) {
            if (order === 'desc') {
                newOrder = 'asc';
            } else {
                newOrder = 'desc';
            }
        } else {
            newType = key;
            newOrder = 'desc';
        }
        this.setState({ order: newOrder, type: newType }, () => {
            this.onHeaderRefresh();
        });
    }
    /**
     * 渲染团队列表
     */
    renderBody() {
        let { order, type } = this.state;
        return (
            <View style={{flex: 1, marginTop: -80, backgroundColor: Colors.White, marginHorizontal: 15, borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                <View style={Styles.sequence}>
                    {TRANSACTION_SEQUENCE.map(item => {
                        let { key, title } = item;
                        let itemSelected = type === key;
                        return (
                            <View style={Styles.sequenceItem} key={key}>
                                <TouchableOpacity key={key} style={{ flexDirection: 'row' }} onPress={() => this.onChangeSequence(key)}>
                                    <Text style={[Styles.sequenceTitle, { color: itemSelected ? Colors.C0 : Colors.C11 }]}>{title}</Text>
                                    <View style={{ justifyContent: 'center', marginTop: -4, marginLeft: 3 }}>
                                        {(itemSelected && order === 'desc') ?
                                            <FontAwesome name="caret-up" color={Colors.C6} size={12} />
                                            :
                                            <FontAwesome name="caret-up" color={Colors.C10} size={12} />
                                        }
                                        {(itemSelected && order === 'asc') ?
                                            <FontAwesome name="caret-down" color={Colors.C6} size={12} />
                                            :
                                            <FontAwesome name="caret-down" color={Colors.C10} size={12} />
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </View>
                <RefreshListView
                    data={this.state.teamList}
                    keyExtractor={this.keyExtractor}
                    renderItem={({ item, index }) =>
                        <TeamListItem
                            index={index}
                            item={item}
                        />
                    }
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this.onHeaderRefresh}
                    onFooterRefresh={this.onFooterRefresh}
                    // 可选
                    footerRefreshingText='正在玩命加载中...'
                    footerFailureText='我擦嘞，居然失败了 =.=!'
                    footerNoMoreDataText='我是有底线的 =.=!'
                    footerEmptyDataText='我是有底线的 =.=!'
                />
            </View>
            
        )
    }
    /**
     * 渲染Header
     */
    renderHeader() {
        return (
            <ImageBackground style={{width: Metrics.screenWidth, height: 220, paddingHorizontal: 15}} source={require('../../images/mine/team/teamBG.png')}>
                <View style={Styles.header}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{width: 45, height: 45 , overflow: 'hidden'}} >
                            {/* <Image style={{width: 45, height: 45, borderRadius: 22.5, overlayColor: Colors.transparent }} source={{uri: this.state.avatarUrl}}/> */}
                            <Image style={{width: 45, height: 45, borderRadius: 22.5, overlayColor: Colors.transparent }} source={require('../../images/logo.png')}/>
                            
                        </View>
                        <View style={{marginLeft: 12, flex: 1}}>
                            <TouchableOpacity style={Styles.starLevel} onPress={() => this.onRightPress()}>
                                <Text style={Styles.starLevelText}>{STAR_LEVEL[this.state.teamStart]}</Text>
                                <FontAwesome name="question-circle-o" color="#FFFFFF" size={16} />
                            </TouchableOpacity>
                            <View style={[Styles.starLevel, {marginTop: 10}]}>
                                <Text style={{ fontSize: 14, color: Colors.C8 }}>团队人数</Text>
                                <Text style={{ marginLeft: 6, fontSize: 15, color: Colors.C8 }}>{this.state.teamCount}</Text>
                            </View>
                        </View>
                        {/* <Text style={{color: Colors.White}}>活跃度: {this.state.active} </Text> */}
                    </View>
                    <View style={Styles.headerContainer}>
                        {OPTIONS.map(item => {
                            let { key, name, route } = item;
                            return (
                                <View style={Styles.headerItem} key={key}>
                                    <Text style={Styles.headerText}>{this.state[route]}</Text>
                                    <Text style={Styles.headerTitle}>{name}</Text>
                                </View>
                            )
                        })}
                    </View>
                </View>
            </ImageBackground >
        )
    }
    render() {
        return (
            <View style={Styles.container}>
                <Header title="我的团队" rightText="规则" onRightPress={() => this.onRightPress()} />
                {this.renderHeader()}
                {this.renderBody()}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(MyTeam);
const Styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundColor },
    header: { paddingBottom: 20, paddingTop: 20 },
    starLevel: { flexDirection: 'row', alignItems: 'center' },
    starLevelIcon: { paddingLeft: 8, paddingRight: 10 },
    starLevelText: { fontSize: 16, fontWeight: '500', color: '#FFFFFF', marginRight: 8 },
    headerContainer: { flexDirection: 'row', marginTop: 15 },
    headerItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { color: '#FFFFFF', fontSize: 14, marginTop: 6 },
    headerText: { color: '#FFFFFF', fontSize: 15 },
    bodyItem: { flexDirection: 'row', alignItems: 'center', marginLeft: 15, paddingTop: 10, paddingBottom: 10, paddingRight: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#eceff4' },
    avatar: { width: 50, height: 50, borderRadius: 25 },
    phoneNumber: { fontSize: 14, color: '#3c4d66' },
    teamNumber: { fontSize: 14, color: '#3c4d66' },
    teamActivity: { fontSize: 14, color: '#3c4d66' },
    isCertified: { textAlign: 'right', fontSize: 14, color: '#3c4d66' },
    sequence: { flexDirection: 'row', alignItems: 'center', margin: 10, marginTop: 15 },
    sequenceItem: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    sequenceTitle: { fontSize: 16, color: Colors.C11, fontWeight: 'bold', marginRight: 2 }
});