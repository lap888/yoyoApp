import React, { Component } from 'react';
import { View, Text, NativeModules, StatusBar, Pressable, StyleSheet, ScrollView, TouchableWithoutFeedback, Linking, Image, Platform, TouchableOpacity, ImageBackground, SafeAreaView, ToastAndroid, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Toast from '../../common/Toast';
import Cookie from 'cross-cookie';
import * as WeChat from 'react-native-wechat-lib';

import { Colors, Metrics } from '../../theme/Index';
import { LOGOUT, UPDATE_USER } from '../../../redux/ActionTypes';
import { AUTH_SECRET, API_PATH, Env, Version } from '../../../config/Index';
import MathFloat from '../../../utils/MathFloat';
import { PROFILE_BAR } from '../../../config/Constants';
import { Send } from '../../../utils/Http';
import { OtherApi } from '../../../api';
import { bold } from '../../../config/Env';

const FeiMa = NativeModules.FeiMaModule;

// 交易
let TRANSACTION_BAR = [
	{ key: "0", title: "买单", icon: 'buysellads', businessType: 0, router: "BuyOrder" },
	{ key: "1", title: "卖单", icon: 'buysellads', businessType: 1, router: "SellOrder" },
	{ key: "2", title: "交易中", icon: 'exchange', businessType: 2, router: "BuyingOrder" },
	{ key: "3", title: "已完成", icon: 'snapchat', businessType: 3, router: "BuyedOrder" },
	// { key: "4", title: "消息", icon: 'wechat', router: "Message" },
];
// 基本信息
let BASICINFO_BAR = [
	{ key: "0", title: "实名认证", icon: 'credit-card', router: 'Certification' },
	// { key: "1", title: "二次认证", icon: 'credit-card-alt', router: 'PayPage2' },
	{ key: "2", title: "我的团队", icon: 'user-md', router: 'MyTeam' },
	{ key: "3", title: "邀请好友", icon: 'steam-square', router: 'Invitation' }
];
let BASICINFO_BAR2 = [
	{ key: "4", title: "地址管理", icon: 'address-book', router: 'Adress' },
	// { key: "5", title: '城市大厅', icon: 'home', router: 'CityShow' },
	{ key: "6", title: "置换", icon: 'address-book', router: 'EquityExchange' },
	{ key: "5", title: "问题反馈", icon: 'microchip', router: 'YoTaskApeal' },
];

let SERVICE_BAR = [
	{ key: "0", title: "YOYO管理", icon: 'eercast', router: 'YoTaskSetting' },
	{ key: "1", title: "我的任务", icon: 'superpowers', router: 'MyYoTask' },
	{ key: "2", title: "问题反馈", icon: 'microchip', router: 'YoTaskApeal' },
	// { key: "3", title: "绑定微信", icon: 'bindWeChat', router: 'BindWeChat' },
];

let HUODONG_BAR = [
	// { key: "2", title: "收购排行", router: 'AcquisitionRanking', icon: 'user-md' },
	{ key: "1", title: "幸运抽奖", icon: 'superpowers', router: 'ZpLuck' },
	{ key: "0", title: "超级夺宝", icon: 'eercast', router: 'GoodLuck' }
];
class Mine extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	/**
	 * 渲染用户收益
	 */
	renderProfile() {
		return (
			<View style={Styles.profile}>
				{PROFILE_BAR.map(item => {
					let { key, title, router } = item;
					let value = (this.props[key] == 'undefined' || this.props[key] == null) ? 0 : this.props[key];
					if (key === 'commission') {
						value = 0;
						value = value.toFixed(2);
					} else if (key === 'balance') {
						value = MathFloat.floor(this.props.userBalanceNormal, 2) + MathFloat.floor(this.props.userBalanceLock, 2);
						value = value.toFixed(2);
					} else {
						value = '¥' + MathFloat.floor(value, 2);
					}
					return (
						<TouchableWithoutFeedback key={key} onPress={() => Actions.push(this.props.logged ? router : 'Login')}>
							<View style={Styles.profileItem}>
								<Text style={[Styles.profileText]}>{value}</Text>
								<Text style={Styles.profileTitle}>{title}</Text>
							</View>
						</TouchableWithoutFeedback>
					)
				})}
			</View>
		)
	}
	onClickLevelBar() {
		if (this.props.logged) {
			Actions.push('Level');
		} else {
			Actions.push('Login');
		}
	}
	/**
		 * 交易Bar 点击事件
		 */
	handleTransactionBar(item) {
		if (this.props.logged) {
			if (item.hasOwnProperty('businessType')) {
				Actions.push('BusinessPage', { businessType: item['businessType'] });
			} else {
				Actions.push(item['router']);
			}
		} else {
			Actions.push('Login');
		}
	}
	/**
		 * 联系QQ客服
		 */
	onClickQQ() {
		Send(`api/system/CopyWriting?type=call_me`, {}, 'get').then(res => {
			Actions.push('CommonRules', { title: '联系我们', rules: res.data });
		});
	}
	/**
		 * 服务Bar 点击事件
		 */
	handleServiceBar(item) {
		if (this.props.logged) {
			if (item.hasOwnProperty('router')) {
				if (item['router'] === 'CommonRules') {
					this.onServicePress()
				} else if (item['router'] === 'qq') {
					this.onClickQQ();
				} else {
					Actions.push(item['router']);
				}
			} else {
				if (item['key'] === '0') this.onClickQQ();
			}
		} else {
			Actions.push('Login');
		}
	}
	onServicePress() {
		Send(`api/system/CopyWriting?type=day_q`, {}, 'get').then(res => {
			Actions.push('CommonRules', { title: '常见问题', rules: res.data });
		});
	}

	/**
	 * 进入隐私政策界面
	 */
	privacyPolicy = () => {
		Send(`api/system/CopyWriting?type=pro_rule`, {}, 'get').then(res => {
			Actions.push('CommonRules', { title: '隐私政策', rules: res.data });
		});
	}

	/**
		 * 渲染我的服务
		 */
	renderService() {
		return (
			<View>
				<Pressable onPress={() => Actions.push('NewTicket')}>
					<View style={{ flexDirection: 'row', paddingLeft: 20, backgroundColor: Colors.White, height: 50, alignItems: 'center', marginTop: 10, paddingHorizontal: 10 }}>
						<Image style={{ height: 18, width: 18 }} source={require('../../images/mine/wallet/juan.png')} />
						<Text style={{ fontSize: 13, color: '#333', marginLeft: 5 }}>新人券</Text>
					</View>
				</Pressable>

				<TouchableOpacity
					style={{ height: 50, backgroundColor: Colors.White, marginTop: 10, paddingLeft: 20, flexDirection: 'row', alignItems: 'center' }}
					onPress={() => Actions.push('Help')}>
					<Image style={{ height: 18, width: 18 }} source={require('../../images/mine/helpicon.png')} />
					<Text style={{ marginLeft: 5,fontSize: 13,color: '#333'  }}>帮助中心</Text>
				</TouchableOpacity>
			</View>
		)
	}
	/**
		 * 服务Bar 点击事件
		 */
	handleServiceYoBang(item) {
		if (this.props.logged) {
			if (item.hasOwnProperty('router')) {
				if (item['router'] === 'CommonRules') {
					this.onServicePress()
				} else if (item['router'] === 'GoodLuck') {
					Toast.tipBottom('暂未开放')
				} else if (item['router'] === 'BindWeChat') {
					console.warn('绑定微信');
					WeChat.sendAuthRequest('snsapi_userinfo', 'wechat_sdk_demo')
						.then((responseCode) => {
							console.log('responseCode: ', responseCode);
							let code = responseCode.code;
							return OtherApi.getWechatToken(code)
						})
						.then((data) => {
							console.log('data', data);
							return OtherApi.getWechatUser(data.access_token, data.openid)
						})
						.then((userinfo) => {
							console.log('userinfo', userinfo);
						}).catch((err) => console.log('err', err))
				} else {
					Actions.push(item['router']);
				}
			} else {
				// if (item['key'] === '0') {
				// 	this.onClickQQ()
				// };
			}
		} else {
			Actions.push('Login');
		}
	}
	/**
	 * 头部背景
	 *  */
	renderHeaderCard = () => {
		return (
			<ImageBackground source={require('../../images/my/headerbg.png')} resizeMode={'stretch'} style={{ height: 133, paddingHorizontal: 10 }}>
				<View style={{ height: 80, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5 }}>
					<Text style={Styles.version}>{`版本号：${Env === 'dev' ? Env : ''}${Version}`}</Text>
					<View style={{ flexDirection: 'row' }}>
						<TouchableOpacity style={{ alignItems: 'center', marginRight: 20 }} onPress={() => Actions.push('Message')}>
							<Image source={require('../../images/my/xiaoxi.png')} />
							<Text style={{ fontSize: 9, color: Colors.White }}>消息</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{ alignItems: 'center', marginRight: 20 }} onPress={() => Actions.push(this.props.logged ? 'UserInfo' : 'Login')}>
							<Image source={require('../../images/my/shezhi.png')} />
							<Text style={{ fontSize: 9, color: Colors.White }}>设置</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ImageBackground>
		)
	}
	/**
	 * 用户信息板块
	 *  */
	renderUserCard = () => {
		let { avatar, nickname, rcode } = this.props;
		return (
			<View style={{ backgroundColor: Colors.transparent, marginHorizontal: 10, marginTop: -80, paddingTop: 12 }}>
				<View style={{ flex: 1, backgroundColor: Colors.White, borderTopLeftRadius: 2, borderTopRightRadius: 2 }}>
					{this.props.logged ?
						<View style={{ flex: 1, flexDirection: 'row', }}>
							<View style={{ flex: 1, marginLeft: 85, marginTop: 10 }}>
								<Text style={Styles.nickname} numberOfLines={2}>{nickname || "该用户很懒，还没有修改昵称"}</Text>
								<TouchableOpacity onPress={() => Actions.push('EditInviterCode')}>
									<Text style={Styles.inviteCode} numberOfLines={2}>{rcode == "0" ? "申请邀请码" : `邀请码:${rcode}`}</Text>
								</TouchableOpacity>
							</View>
						</View>
						:
						<View style={{ flex: 1 }}>
							<TouchableWithoutFeedback onPress={() => Actions.push('Login')}>
								<View style={{ flex: 1, marginLeft: 25, marginTop: 10 }}>
									<Text style={{ fontSize: 20, fontWeight: '600', }} numberOfLines={2}>{"登录"}</Text>
								</View>
							</TouchableWithoutFeedback>
						</View>
					}
				</View>
				{this.renderProfile()}
				{this.props.logged ? <TouchableOpacity style={{ position: 'absolute', height: 60, width: 60, marginLeft: 15, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 30, overflow: 'hidden' }} onPress={() => Actions.push('UserInfo')}>
					{/* <Image source={{ uri: avatar }} style={Styles.avatar} /> */}
					<Image source={require('../../images/logo.png')} style={Styles.avatar}/>
				</TouchableOpacity> : null}
			</View>
		)
	}
	/**
	 *  交易板块
	 * */
	renderTransactionCard = () => {
		return (
			<View style={Styles.transactionBody}>
				{TRANSACTION_BAR.map(item =>
					<TouchableOpacity style={{ flex: 1 }} key={item['key']} onPress={() => this.handleTransactionBar(item)}>
						<View style={Styles.barBodyItem}>
							{item['router'] == 'BuyOrder' ?
								<Image source={require('../../images/my/mai.png')} /> :
								item['router'] == 'SellOrder' ?
									<Image source={require('../../images/my/maichu.png')} /> :
									item['router'] == 'BuyingOrder' ?
										<Image source={require('../../images/my/jinxingzhong.png')} /> :
										item['router'] == 'BuyedOrder' ?
											<Image source={require('../../images/my/yiwancheng.png')} /> :
											<FontAwesome name={item['icon']} color={Colors.C6} size={28} />
							}
							<Text style={Styles.barText}>{item['title']}</Text>
						</View>
					</TouchableOpacity>
				)}
			</View>
		)
	}
	/**
	 *  用户等级
	 * */
	renderLevelCard = () => {
		let { golds, level } = this.props;
		return (
			<View style={{ height: 70, backgroundColor: Colors.White, marginTop: 10, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
				<ImageBackground resizeMode={'contain'} style={{ width: Metrics.screenWidth - 20, height: (Metrics.screenWidth - 20) / 6.74 }} source={require('../../images/my/gongxianbg.png')}>
					<TouchableOpacity style={Styles.level} onPress={() => this.onClickLevelBar()}>
						<View style={{ flex: 1, marginLeft: 15, marginRight: 12, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={Styles.levelText}>{level}</Text>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Text style={Styles.contributionValueText}>{`贡献值${golds}`}</Text>
							</View>
						</View>
						<View style={{ height: 30, width: 1, backgroundColor: Colors.White }} />
						<View style={{ flex: 2, paddingLeft: 12, alignItems: 'center' }}>
							<Text style={Styles.levelPropaganda}>{`推广越多 等级越高 手续费越低`}</Text>
							<Text style={[Styles.levelPropaganda, { marginTop: 4, fontSize: 11 }]}>点击查看贡献值规则</Text>
						</View>
					</TouchableOpacity>
				</ImageBackground>
			</View>

		)
	}
	/** 
	 * 基本信息
	*/
	renderBasicInfoCard = () => {
		return (
			<View style={Styles.barContainer}>
				<View style={Styles.barHeader}>
					<Text style={Styles.barTitle}>——基本信息——</Text>
				</View>
				<View style={Styles.barBody}>
					{BASICINFO_BAR.map(item =>
						<TouchableOpacity style={Styles.barBodyItem} key={item['key']} onPress={() => {
							if (item['router'] == "PayPage2" && this.props.alipayUid != '') {
								Toast.tipBottom('无需二次认证')
								return;
							}
							Actions.push(this.props.logged ? (item['router'] == "Certification" && !this.props.isPay) ? "PayPage" : item['router'] : 'Login')
						}}>
							<View style={Styles.barBodyItem}>
								{item['router'] == 'Certification' ?
									<Image source={require('../../images/my/shimingrenzheng.png')} /> :
									item['router'] == 'MyTeam' ?
										<Image source={require('../../images/my/wodetuandui.png')} /> :
										item['router'] == 'Invitation' ?
											<Image source={require('../../images/my/yaoqinghaoyou.png')} /> :
											<FontAwesome name={item['icon']} color={Colors.C6} size={28} />
								}
								<Text style={Styles.barText}>{item['title']}</Text>
							</View>
						</TouchableOpacity>
					)}
				</View>
				<View style={Styles.barBody}>
					{BASICINFO_BAR2.map(item =>
						item.title == '' ? <View style={Styles.barBodyItem} /> :
							<TouchableOpacity style={Styles.barBodyItem} key={item['key']} onPress={() => {
								if (item['router'] === 'EquityExchange' && this.props.auditState != 2) {
									Toast.tip('暂未开放')
									return;
								}
								Actions.push(this.props.logged ? item['router'] : 'Login')
							}}>
								<View style={Styles.barBodyItem}>
									{item['router'] == 'CityShow' ?
										<Image source={require('../../images/my/chengshidating.png')} /> :
										item['router'] == 'PayPage2' ?
											<Image source={require('../../images/mine/ercirenzheng.png')} /> :
											item['router'] == 'Adress' ?
												<Image source={require('../../images/my/dizhiguanli.png')} /> :
												item['router'] == 'EquityExchange' ?
													<Image source={require('../../images/my/guquanhuangou.png')} /> :
													item['router'] == 'YoTaskApeal' ?
														<Image source={require('../../images/my/woderenwu.png')} /> :
														<FontAwesome name={item['icon']} color={Colors.C6} size={28} />
									}
									<Text style={Styles.barText}>{item['title']}</Text>
								</View>
							</TouchableOpacity>
					)}
				</View>
			</View>
		)
	}
	openWWGS = () => {
		let deepLinkURL = 'wwgsapp://wwgsapp/EmpowerScreen';
		Linking.openURL(deepLinkURL).catch(err => console.error('An error occurred', err));
	}
	/**
	 * 渲染哟帮
	 */
	renderYoBangCard = () => {
		return (
			<View style={Styles.yoContainer}>
				<View style={Styles.barHeader}>
					<Text style={Styles.barTitle} onPress={this.openWWGS}>——管理——</Text>
				</View>
				<View style={Styles.barBody}>
					{SERVICE_BAR.map(item =>
						<TouchableWithoutFeedback key={item['key']} onPress={() => this.handleServiceYoBang(item)}>
							<View style={Styles.barBodyItem}>
								{item['router'] == 'YoTaskSetting' ?
									<Image source={require('../../images/my/xuanshangguanli.png')} /> :
									item['router'] == 'MyYoTask' ?
										<Image source={require('../../images/my/woderenwu.png')} /> :
										item['router'] == 'YoTaskApeal' ?
											<Image source={require('../../images/my/jubaoweiquan.png')} /> :
											item['router'] == 'BindWeChat' ?
												<Image source={require('../../images/my/bindWeChat.png')} /> :
												<FontAwesome name={item['icon']} color={Colors.C6} size={28} />
								}
								<Text style={Styles.barText}>{item['title']}</Text>
							</View>
						</TouchableWithoutFeedback>
					)}
				</View>
			</View>
		)
	}

	/**
	 * ——活动——
	 */
	renderHuoDong = () => {
		return (
			<View style={Styles.yoContainer}>
				<View style={Styles.barHeader}>
					<Text style={Styles.barTitle}>——活动——</Text>
				</View>
				<View style={Styles.barBody}>
					{HUODONG_BAR.map(item =>
						<TouchableWithoutFeedback key={item['key']} onPress={() => this.handleServiceYoBang(item)}>
							<View style={Styles.barBodyItem}>
								{item['router'] == 'GoodLuck' ?
									<Image source={require('../../images/mine/xingyunduobao.png')} style={{ width: 40, height: 40 }} /> :
									item['router'] == 'ZpLuck' ?
										<Image source={require('../../images/mine/yoyochoujiang.png')} style={{ width: 40, height: 40 }} /> :
										item['router'] == 'AcquisitionRanking' ?
											<Image source={require('../../images/mine/fenxiangpaihang.png')} style={{ width: 40, height: 40 }} /> :
											<FontAwesome name={item['icon']} color={Colors.C6} size={28} />
								}
								<Text style={Styles.barText}>{item['title']}</Text>
							</View>
						</TouchableWithoutFeedback>
					)}
				</View>
			</View>
		)
	}
	render() {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
				<StatusBar backgroundColor={Colors.main} showHideTransition={'slide'} barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
				{/* <Header title="我的" isTabBar={true} rightIcon="gear" rightIconSize={24} onRightPress={() => { Actions.push(this.props.logged ? 'UserInfo' : 'Login') }} /> */}

				<ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
					{this.renderHeaderCard()}
					{this.renderUserCard()}
					{/* {this.renderTransactionCard()} */}
					{/* {this.renderLevelCard()} */}
					{this.renderBasicInfoCard()}
					{this.renderHuoDong()}
					{this.renderService()}

					<View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
						<Text style={{ fontSize: 14, color: Colors.C10 }}>用户<Text style={{ fontSize: 14, color: Colors.Alipay }} onPress={this.privacyPolicy}>《隐私协议》</Text></Text>
					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}
}
const mapStateToProps = state => ({
	name: state.user.name,
	isPay: state.user.isPay,
	alipayUid: state.user.alipayUid,
	auditState: state.user.auditState,
	logged: state.user.logged,
	userId: state.user.id,
	level: state.user.level,
	rcode: state.user.rcode,
	golds: state.user.golds,
	mobile: state.user.mobile,
	nickname: state.user.name,
	avatar: state.user.avatarUrl,
	balance: state.dividend.userBalance,
	candyH: state.user.candyH || 0,
	candyP: state.user.candyP,
	candyNum: state.user.candyNum,
	userBalanceNormal: state.dividend.userBalanceNormal,
	userBalanceLock: state.dividend.userBalanceLock
});
const mapDispatchToProps = dispatch => ({
	logout: () => dispatch({ type: LOGOUT }),
	updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })
});
export default connect(mapStateToProps, mapDispatchToProps)(Mine);

const Styles = StyleSheet.create({
	gradient: { padding: 15, paddingTop: 10, paddingBottom: 20 },
	avatar: { width: 52, height: 52, borderRadius: 26, overlayColor: '#fff' },
	nickname: { fontSize: 16, color: "#333", fontWeight: '500' },
	inviteCode: { fontSize: 12, color: "#666", },
	setting: { alignItems: 'flex-end' },
	version: { marginTop: 2, fontSize: 11, color: Colors.C8 },
	profile: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.White, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 },
	profileItem: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 60 },
	profileTitle: { marginTop: 2, fontSize: 12, color: Colors.grayFont },
	profileText: { fontSize: 14, color: Colors.C6 },
	level: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
	levelText: { fontSize: 18, color: Colors.White, fontWeight: 'bold' },
	contributionValueText: { marginTop: 4, fontSize: 12, color: Colors.White },
	levelPropaganda: { fontSize: 12, color: Colors.White },
	icon: { width: 30, height: 30 },
	barContainer: { height: 165, flex: 1, backgroundColor: Colors.C8, marginTop: 10, paddingBottom: 10 },
	yoContainer: { height: 105, backgroundColor: Colors.White, marginTop: 10, paddingBottom: 10 },
	helpContainer: { height: 105, backgroundColor: Colors.White, marginTop: 10, paddingBottom: 10 },
	barHeader: { flex: 1, justifyContent: 'center', alignItems: 'center', },
	barTitle: { fontSize: 14, color: Colors.fontColor, fontWeight: '600' },
	barHeaderRight: { flex: 1 },
	barMore: { textAlign: 'right', fontSize: 14, color: Colors.C10 },
	barBody: { flexDirection: 'row', height: 60, marginTop: 5 },
	transactionBody: { flexDirection: 'row', height: 60, backgroundColor: Colors.White, marginTop: 10 },
	barBodyItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	barText: { marginTop: 6, fontSize: 12, color: Colors.fontColor },
	badge: { position: 'absolute', left: 20, top: -2 },
});