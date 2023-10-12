/*
 * @Author: top.brids 
 * @Date: 2019-12-01 21:55:56 
 * @Last Modified by: topbrids@gmail.com
 * @Last Modified time: 2023-09-28 08:07:31
 */

import React, { Component } from 'react';
import { View, Text, PermissionsAndroid, BackHandler, ToastAndroid, Platform, Modal, ImageBackground, RefreshControl, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar } from 'react-native';
import Swiper from 'react-native-swiper';
import WebView from 'react-native-webview';
import { Actions } from 'react-native-router-flux';
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { connect } from 'react-redux';
import Cookie from 'cross-cookie';
// import { Geolocation } from "react-native-amap-geolocation";
import { UPDATE_NOTICE_INFO, UPDATE_USER, UPDATE_NOTICE_STATUS, UPDATE_USER_LOCATION } from '../../../redux/ActionTypes';
import { Version } from '../../../config/Index';
import { ReadMore } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import MathFloat from '../../../utils/MathFloat';
import { HOME_OPTIONS, HOME_OPTIONS2, PROFILE_BAR } from '../../../config/Constants';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';
import { onPressSwiper } from '../../../utils/CommonFunction';
import GoodsListItem from '../shop/GoodsListItem';
import { ShopApi } from '../../../api';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import Advert from '../../screen/advert/Advert';
import { Body, Card, CardItem } from 'native-base';
import BloomAd, {
	BannerView,
	NativeExpress,
	DrawVideo,
	VideoStreaming,
	NewsPortal,
} from "react-native-bloom-ad";

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isRefreshing: false,
			refreshing: false,
			progress: 0,
			webViewHeight: 300,
			msgData: [],
			oneMsgData: { content: '' },
			bannerList: [],
			profileProgressList: [],
			doTaskUrl: '',
			doTaskImage: '/Banner/e55187aa-69ce-411a-afe8-d50752f2b453.png',
			city: '加载中...',
			noticeModalVisible: true,
			propagandaList: [],
			YokaAndChongzhiList: [],
			goodsList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
			pageIndex: 1,
			pageSize: 20,
		};
	}


	componentWillUnmount() {
		if (Platform.OS == "android") {
			BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
		}
	}

	onBackAndroid = () => {
		if (Actions.currentScene != "Index") {
			Actions.pop();
			return true;
		} else {
			let time = new Date();
			this.lastBackPressed = this.thisBackPressed;
			this.thisBackPressed = time.getTime();
			if (this.lastBackPressed && this.lastBackPressed + 2000 >= this.thisBackPressed) {
				BackHandler.exitApp();
				return false;
			}
			ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
			return true;
		}
	};

	async componentDidMount() {
		if (Platform.OS === "android") {
			await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
			await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
		}

		if (Platform.OS == "android") {
			BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
		}
		this.fetchBanner(0);
		this.fetchAd(2)
		// this.fetchYoKa(99);
		// this.fetchTodayTask(3);
		// this.reloadMessage();

		// if (Platform.OS == "android") {
		// 	Geolocation.getCurrentPosition(
		// 		position => {
		// 			this.props.updateUserLocatin(position.location);
		// 			this.setState({ city: position.location.city + position.location.district });
		// 		},
		// 		error => {
		// 			console.log('error', error)
		// 		}
		// 	);
		// } else {
		// 	Geolocation.getCurrentPosition(
		// 		position => {
		// 			let latitude = position.location.latitude.toFixed(6);
		// 			let longitude = position.location.longitude.toFixed(6);
		// 			let lUrl = `https://restapi.amap.com/v3/geocode/regeo?output=json&location=${longitude},${latitude}&key=a4012f914b81a86e10f859e75f5e59aa&radius=1000&extensions=base`;
		// 			// 逆向地理位置信息获取
		// 			fetch(lUrl)
		// 				.then(renderReverseText => {
		// 					return renderReverseText.json();
		// 				})
		// 				.then(renderReverse => {
		// 					if (renderReverse && renderReverse['status'] == 1) {
		// 						let addressComponent = renderReverse['regeocode']['addressComponent'];
		// 						let province = addressComponent['province'];
		// 						let city = addressComponent['city'];
		// 						let district = addressComponent['district']
		// 						let cityCode = addressComponent['citycode'];
		// 						let adCode = addressComponent['adcode'];
		// 						let nextLocation = { latitude, longitude, province, city, cityCode, district, adCode };
		// 						this.props.updateUserLocatin(nextLocation);
		// 						this.setState({ city: nextLocation.city + nextLocation.district });
		// 					}
		// 				})
		// 				.catch(error => console.log(error));
		// 		},
		// 		error => {
		// 			console.log('error', error)
		// 		}
		// 	);
		// }
		if (Version >= this.props.warnVersion) {
			this.fetchMessage();
			return;
		}
	}
	/**
	 * 获取系统Banner列表
	 * @param {*} source 
	 */
	fetchBanner(source) {
		var that = this;
		let params = {
			pageIndex: 1,
			type: 0,
		};
		Send("api/system/banners?source=" + source, {}, 'GET').then(res => {
			if (res.code == 200) {
				Send("api/system/banners?source=99", {}, 'GET').then(res1 => {
					if (res1.code == 200) {
						Send("api/system/TodayTask?source=3", {}, 'GET').then(res2 => {
							if (res2.code == 200) {
								Send("api/system/notices", params).then(res3 => {
									if (res3.code == 200) {
										// this.getGoodsList(1);
										that.setState({ bannerList: res.data, YokaAndChongzhiList: res1.data, doTaskImage: res2.data.imageUrl, doTaskUrl: res2.data, msgData: res3.data })
									}
								});

							}
						})
					}
				})
				// that.setState({ bannerList: res.data });
			} else {
				Toast.tipBottom(res.message);
			}
		})
		
	}

	fetchYoKa(source) {
		var that = this;
		Send("api/system/banners?source=" + source, {}, 'GET').then(res => {
			if (res.code == 200) {
				that.setState({ YokaAndChongzhiList: res.data });
			} else {
				Toast.tipBottom(res.message);
			}
		})
	}
	fetchTodayTask(source) {
		var that = this;
		Send("api/system/TodayTask?source=" + source, {}, 'GET').then(res => {
			if (res.code == 200) {
				that.setState({ doTaskImage: res.data.imageUrl, doTaskUrl: res.data });
			} else {
				Toast.tipBottom(res.message);
			}
		})
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
	onHeaderRefresh = () => {
		this.setState({
			refreshState: RefreshState.HeaderRefreshing,
			pageIndex: 1
		}, () => {
			this.getGoodsList(1)
		});
	}
	onFooterRefresh = () => {
		this.setState({
			refreshState: RefreshState.FooterRefreshing,
			pageIndex: this.state.pageIndex + 1
		}, () => {
			this.getGoodsList(this.state.pageIndex)
		});
	}

	/**
	 * 加载系统消息
	 */
	reloadMessage() {
		let that = this;
		let params = {
			pageIndex: 1,
			type: 0,
		};
		Send("api/system/notices", params).then(res => {
			if (res.code == 200) {
				that.setState({
					msgData: res.data,
				})
			} else {
				that.setState({
					msgData: [],
				})
			}
		});
	}
	/**
	 * Options跳转事件
	 * @param {*} route 
	 */
	onOptionPress(route) {
		if (!this.props.logged) {
			Actions.push("Login");
			return;
		}
		if (route == 'NULL') {
			Toast.tip('暂未开放');
			return;
		}

		if (route == 'xBook') {
			Advert.openNovel()
		}
		else if (route == 'YouKa') {
			this.state.YokaAndChongzhiList.map((v) => {
				if (v.id == 1) {
					onPressSwiper(v, this.props.mobile, this.props.userId);
				}
			});
		} else if (route == 'Home2Screen' || route == 'Block' || route == 'Game') {
			if (this.props.auditState !== 2) {
				Toast.tip('暂未开放');
				return;
			} else {
				Actions.push(route);
			}
		}
		else if (route == 'CityShow') {
			Actions.push(route);
		}
		else if (route == 'PinDuoduoShop') {
			this.state.YokaAndChongzhiList.map((item) => {
				if (item.id == 4) {
					let params = JSON.parse(item.params);
					let url = params.url;
					//处理url
					let p1 = '{YoyoUserMobilePhone}';
					let p2 = '{YoyoUserID}';
					if (url.indexOf(p1) > 0) {
						url = url.replace(p1, this.props.mobile)
					}
					if (url.indexOf(p2) > 0) {
						url = url.replace(p2, this.props.userId)
					}
					Cookie.get('token')
						.then(value => {
							let token = value == null || value == '' ? '' : value;
							Actions.AdReward({ url: url, ty: 5, title: item.title, thumbImage: item.imageUrl, bannerId: item.id, token: token });
						});
				}
			});
		} else {
			Actions.push(route);
		}
	}

	onOptionPress2(route) {
		if (!this.props.logged) {
			Actions.push("Login");
			return;
		}
		if (route == 'YouKa') {
			this.state.YokaAndChongzhiList.map((v) => {
				if (v.id == 1) {
					onPressSwiper(v, this.props.mobile, this.props.userId);
				}
			});
		} else if (route == 'PinDuoduoShop') {
			this.state.YokaAndChongzhiList.map((item) => {
				if (item.id == 4) {
					let params = JSON.parse(item.params);
					let url = params.url;
					//处理url
					let p1 = '{YoyoUserMobilePhone}';
					let p2 = '{YoyoUserID}';
					if (url.indexOf(p1) > 0) {
						url = url.replace(p1, this.props.mobile)
					}
					if (url.indexOf(p2) > 0) {
						url = url.replace(p2, this.props.userId)
					}
					Cookie.get('token')
						.then(value => {
							let token = value == null || value == '' ? '' : value;
							Actions.AdReward({ url: url, ty: 5, title: item.title, thumbImage: item.imageUrl, bannerId: item.id, token: token });
						});
				}
			});
		} else if (route == 'GoToReward') {
			this.state.YokaAndChongzhiList.map((item) => {
				if (item.id == 3) {
					let params = JSON.parse(item.params);
					let url = params.url;
					Cookie.get('token')
						.then(value => {
							let token = value == null || value == '' ? '' : value;
							Actions.AdReward({ url: url, ty: 5, title: item.title, thumbImage: item.imageUrl, bannerId: item.id, token: token });
						});
				}
			});
		}
		else if (route == 'TaoBaoShop') {
			this.state.YokaAndChongzhiList.map((item) => {
				if (item.id == 5) {
					let params = JSON.parse(item.params);
					let url = params.url;
					Cookie.get('token')
						.then(value => {
							let token = value == null || value == '' ? '' : value;
							Actions.AdReward({ url: url, ty: 5, title: item.title, thumbImage: item.imageUrl, bannerId: item.id, token: token });
						});
				}
			});
		} else if (route == 'PushUserBang') {
			this.state.YokaAndChongzhiList.map((item) => {
				if (item.id == 6) {
					let params = JSON.parse(item.params);
					let url = params.url;
					Cookie.get('token')
						.then(value => {
							let token = value == null || value == '' ? '' : value;
							let _token = encodeURIComponent(token)
							Actions.AdReward({ url: `${url}?token=${_token}`, ty: 5, title: item.title, thumbImage: item.imageUrl, bannerId: item.id, token: token });
						});
				}
			});
		} else if (route == 'notOpen') {
			Toast.tip('暂未开放')
		} else {
			Actions.push(route);
		}
	}
	fetchAd(source) {
		var that = this;
		Send("api/system/banners?source=" + source, {}, 'GET').then(res => {
			if (res.code == 200) {
				that.setState({ propagandaList: res.data });
			} else {
				Toast.tipBottom(res.message)
				// Toast.show({
				//   text: res.message,
				//   textStyle: { color: '#FFFFFF', textAlign: 'center' },
				//   position: "bottom",
				//   duration: 2000
				// });
			}
		})
	}

	descTask = () => {
		Send(`api/system/CopyWriting?type=do_task_rule`, {}, 'get').then(res => {
			Actions.push('CommonRules', { title: '任务说明', rules: res.data });
		});
	}
	imageAdvert = () => {
		if (this.props.logged) {
			onPressSwiper(this.state.doTaskUrl, this.props.mobile, this.props.userId)
		} else {
			Actions.push('Login')
		}
	}
	/**
	 * 显示系统消息
	 */
	renderBroadcast() {
		return (
			<TouchableOpacity style={[Styles.bordercast, { marginHorizontal: 10 }]} onPress={() => Actions.Message({ idx: 0 })}>
				<Text style={{ color: Colors.main }}>公告</Text>
				<Icon name="ios-volume-medium" color={Colors.main} size={20} />
				<Swiper
					style={{ marginLeft: 10 }}
					key={this.state.msgData.length}
					height={20}
					loop={true}
					removeClippedSubviews={false}
					horizontal={true}
					autoplay={true}
					autoplayTimeout={20}
					showsPagination={false}
					showsButtons={false}
				>
					{this.state.msgData.map((item, key) =>
						<Text key={key} style={{ fontSize: 14, lineHeight: 21, color: Colors.grayFont }}>{item.title}</Text>
					)}
				</Swiper>
			</TouchableOpacity>
		)
	}
	descAd = () => {
		let rules = [
			{ key: '0', title: `如何上架自己广告`, text: `上架自己广告 需要和公司联系 公司即可将您需要的广告上架到广告栏 说明:上架广告需要支付一定费用，收费标准:\r\n上架一天时间需要支付1000￥「广告费用支持全糖果支付 糖果抵扣价 按当日交易大厅最高价溢价0.5元抵扣」\r\n如:交易大厅今日最高价为3元，则上架广告糖果抵扣价为3.5元\r\nAPP内浏览广告不计次数,APP外，每用户浏览增加1阅读「数据追踪可统计」` },
			{
				key: '1', title: `广告类型`, text: `广告类型分三种\r\n1.说明图片+文字说明+App下载链接类型，该类型广告，用户点击说明图就会下载您提供链接的App\r\n2.说明图片+文字说明+文案超链接，该类型广告，用户点击说明图就会跳转到您提供文案超链接内容`
			}
		];
		Actions.push('CommonRules', { title: '广告说明', rules });
	}

	renderAd() {
		return (
			<TouchableOpacity style={[Styles.bordercast, { marginHorizontal: 10, marginTop: 20 }]}>
				<Icon name="rocket-sharp" color={Colors.main} size={22} />
				<Text style={{ fontSize: 14, lineHeight: 21, color: Colors.main, marginLeft: 10 }}>虚位以待</Text>
			</TouchableOpacity>
		)
	}
	/**
	 * 游戏插图
	 */
	illustration(imgs) {
		if (imgs != undefined) {
			return (
				imgs.map((item, index) =>
					<View key={index} style={{ flexDirection: 'column', width: 100, margin: 5, }}>
						<TouchableOpacity onPress={() => onPressSwiper(item, this.props.mobile, this.props.userId)}>
							<Image
								source={{ uri: item['imageUrl'] }}
								style={{ height: 160, width: 100, borderRadius: 10, resizeMode: 'stretch', marginBottom: 5 }}
							/>
						</TouchableOpacity>
						<ReadMore
							numberOfLines={1}
						>
							<Text style={{ fontSize: 14, textAlign: 'left', color: 'gray' }}>
								{item.title}
							</Text>
						</ReadMore>
					</View>
				)
			)
		}
		return <View />
	}

	renderAdContent() {
		return (
			<Card>
				<CardItem>
					<Body>
						<ScrollView horizontal={true}>
							<View style={{ flex: 1, flexDirection: "row" }}>
								{this.illustration(this.state.propagandaList)}
							</View>
						</ScrollView>
					</Body>
				</CardItem>
				<CardItem footer>
				</CardItem>
			</Card>
		);
	}

	/**
	 * 渲染轮播图
	 */
	renderSwiper() {
		return (
			<View style={Styles.wiper}>
				<Swiper
					key={this.state.bannerList.length}
					horizontal={true}
					loop={true}
					autoplay={true}
					autoplayTimeout={16}
					removeClippedSubviews={false}
					paginationStyle={{ bottom: 20 }}
					showsButtons={false}
					activeDotStyle={{ width: 15, height: 3, backgroundColor: Colors.White, borderRadius: 1 }}
					dotStyle={{ width: 15, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 1 }}
				>
					{this.state.bannerList.map((item, index) =>
						<TouchableOpacity key={index} onPress={() => onPressSwiper(item, this.props.mobile, this.props.userId)}>
							<Image style={Styles.banner} source={{ uri: item['imageUrl'] }} />
						</TouchableOpacity>
					)}
				</Swiper>
			</View >
		)
	}
	/**
	 * 渲染功能组件区
	 */
	renderOptions() {
		return (
			<View style={Styles.options}>
				{HOME_OPTIONS.map(item => {
					let { key, name, route, image } = item;
					return (
						<TouchableOpacity key={key} style={Styles.optionTouch} onPress={() => this.onOptionPress(route)}>
							<Image source={image} style={{ width: 35, height: 35 }} />
							<Text style={Styles.optionTitle}>{name}</Text>
						</TouchableOpacity>
					)
				})}
			</View>
		)
	}
	/**
	 * 
	 */
	renderOptions2() {
		return (
			<View style={Styles.options}>
				{HOME_OPTIONS2.map(item => {
					let { key, name, route, icon } = item;
					return (
						<TouchableOpacity key={key} style={Styles.optionTouch} onPress={() => this.onOptionPress2(route)}>
							<View style={Styles.optionItem}>
								{route == 'PinDuoduoShop' ?
									<Image source={require('../../images/mine/pinduodu_2.png')} style={{ width: 36, height: 36 }} /> :
									route == 'TaoBaoShop' ?
										<Image source={require('../../images/mine/taobao.png')} style={{ width: 36, height: 36 }} /> :
										route == 'TelphoneRecharge' ?
											<Image source={require('../../images/mine/huafeichongzhi.png')} style={{ width: 36, height: 36 }} /> :
											route == 'YouKa' ?
												<Image source={require('../../images/mine/yijianjiayou.png')} style={{ width: 36, height: 36 }} /> :
												route == 'GoToReward' ?
													<Image source={require('../../images/mine/yoyochoujiang.png')} style={{ width: 36, height: 36 }} /> :
													route == 'notOpen' ?
														<Image source={require('../../images/mine/xingyunduobao.png')} style={{ width: 36, height: 36 }} /> :
														route == 'BuyCandyBang' ?
															<Image source={require('../../images/mine/fenxiangpaihang.png')} style={{ width: 36, height: 36 }} /> :
															route == 'Otc' ?
																<Image source={require('../../images/mine/jiaoyi.png')} style={{ width: 36, height: 36 }} /> :
																<FontAwesome name={icon} color={Colors.C6} size={28} />
								}
								<Text style={Styles.optionTitle}>{name}</Text>
							</View>
						</TouchableOpacity>
					)
				})}
			</View>
		)
	}
	/**
	 * 渲染任务说明
	 */
	renderTask() {
		return (
			<View style={{ alignItems: 'center' }}>
				<View style={Styles.task}>
					<View style={{ width: 210, height: 74, overflow: 'hidden', borderRadius: 5 }} >
						<ImageBackground style={Styles.taskGif} source={{ uri: this.state.doTaskImage }} >
							<TouchableOpacity style={{ flex: 1, padding: 10, flexWrap: 'wrap' }} onPress={this.imageAdvert}>
								{/* <Text style={{ fontSize: 16, color: Colors.notice, fontWeight: 'bold' }}>{this.state.doTaskUrl.title}</Text> */}
							</TouchableOpacity>
						</ImageBackground>
					</View>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<TouchableOpacity onPress={() => {
							if (this.props.logged) {
								if (this.props.auditState !== 2) {
									Toast.tip('暂未开放');
									return;
								} else {
									Actions.push('Home2Screen');
								}
							} else {
								Actions.push('Login')
							}
						}}>
							<Image source={require('../../images/home/dotask.png')} />
						</TouchableOpacity>
					</View>
				</View >
				{/* <Text style={Styles.yieldText}>今日已产出糖果: {this.props.dayNum.toFixed(2)}</Text> */}
			</View>

		)
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
					if (key === 'candyH') {
						value = value.toFixed(2);
					} else if (key === 'candyP' || key === 'candyNum') {
						value = value.toFixed(2);
					} else if (key === 'balance') {
						value = MathFloat.floor(this.props.userBalanceNormal, 2) + MathFloat.floor(this.props.userBalanceLock, 2);
						value = value.toFixed(2);
					} else {
						value = '¥' + MathFloat.floor(value, 2);
					}
					return (
						<TouchableOpacity style={{ flex: 1 }} key={key} onPress={() => {
							Actions.push(this.props.logged ? router : 'Login')
						}}>
							<View style={Styles.profileItem}>
								<Text style={[Styles.profileText]}>{value}</Text>
								<Text style={Styles.profileTitle}>{title}</Text>
							</View>
						</TouchableOpacity>
					)
				})}
			</View>
		)
	}
	/**
	 * 获取系统公告
	 */
	fetchMessage() {
		let that = this;
		Send("api/system/OneNotice", {}, 'get').then(res => {
			if (res.code == 200) {
				that.setState({
					oneMsgData: res.data,
				})
			}
		});
	}

	onMessage = (e) => {
		const data = JSON.parse(e.nativeEvent.data);
		if (data.height) {
			this.setState({
				webViewHeight: data.height < 500 ? 500 : data.height
			});
		}
	}
	webViewLoadedEnd = () => {
		this.webview.injectJavaScript(`
                const height = document.body.clientHeight;
                window.ReactNativeWebView.postMessage(JSON.stringify({height: height}));
            `);
	}
	/**
	 * 渲染系统公告Modal
	 */
	renderNoticeModal() {
		let _html = `<!DOCTYPE html>
        <html>
        <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <body>
        ${this.state.oneMsgData.content}
        <script>
        function ResizeImages(){
          var myimg;
          for(i=0;i <document.images.length;i++){
            myimg = document.images[i];
            myimg.width = ${Metrics.screenWidth - 100};
          }
        }
        window.onload=function(){ 
          ResizeImages()
          window.location.hash = '#' + document.body.clientHeight;
          document.title = document.body.clientHeight;
        }
        </script></body></html>`
		return (
			<Modal animationType='slide' transparent visible={this.state.noticeModalVisible} onRequestClose={() => { }}>
				<View style={{ flex: 1, backgroundColor: "black", opacity: 0.3 }} />
				<View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<View style={{ width: 280, height: 350, borderRadius: 10, backgroundColor: '#FFFFFF' }}>
						<Text style={{ textAlign: 'center', fontSize: 16, color: Colors.main, fontWeight: 'bold', marginTop: 20, }}>{this.state.oneMsgData.title}</Text>
						<Text style={{ fontSize: 12, padding: 10, paddingLeft: 15, color: "gray" }}>
							发布时间: {this.state.oneMsgData.ceratedAt}
						</Text>
						<ScrollView contentContainerStyle={{ padding: 5, paddingLeft: 5, paddingRight: 5 }}>
							<View style={{ height: this.state.webViewHeight, }}>
								<WebView
									ref={(ref) => this.webview = ref}
									style={{ flex: 1, height: this.state.webViewHeight }}
									source={{ html: _html }}
									originWhitelist={["*"]}
									onMessage={this.onMessage}
									onLoadEnd={this.webViewLoadedEnd}
									javaScriptEnabled={true}
								/>
							</View>
						</ScrollView>
						<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
							<TouchableOpacity onPress={() => this.setState({ noticeModalVisible: false })}>
								<View style={{ marginTop: 6, height: 30, width: 100, marginRight: 5, borderRadius: 10, backgroundColor: Colors.main, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ fontSize: 14, color: Colors.C8 }}>关闭</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		)
	}
	descShop = () => {
		Send(`api/system/CopyWriting?type=today_common_rule`, {}, 'get').then(res => {
			Actions.push('CommonRules', { title: '今日推荐说明', rules: res.data });
		});
	}

	renderShopHeader() {
		return (
			<View style={{ paddingHorizontal: 10, marginVertical: 10 }}>
				<TouchableOpacity style={Styles.bordercast1} onPress={() => { Advert.interstitial() }}>
					<Image source={require('../../images/home/jinrituijian.png')} />
				</TouchableOpacity>
			</View>

		)
	}

	listHeaderComponent = () => {
		return (
			// <View style={{ flex: 1, marginBottom: 100 }}>

			// </View>
			<ScrollView style={{ flex: 1 }} >
				{this.renderSwiper()}
				{this.renderOptions()}
				{this.renderBroadcast()}
				{/* {this.renderOptions2()} */}
				{this.renderTask()}
				{/* {this.renderProfile()} */}
				{this.renderAd()}
				{this.renderAdContent()}
				{this.renderShopHeader()}
				{/* <BannerView
					style={{
						width: 332,
						height: 82
					}}
					unitId={"b1"}
					onChange={(params) => {
						console.warn(params);
					}}
				/> */}


			</ScrollView>
		)
	}

	render() {
		return (
			<View style={Styles.container}>
				<StatusBar backgroundColor={Colors.main} />
				{/* <RefreshListView
					ListHeaderComponent={this.listHeaderComponent()}
					data={this.state.goodsList}
					keyExtractor={(item, index) => index + '1'}
					renderItem={({ item, index }) => <GoodsListItem data={item} index={index} />}
					refreshState={this.state.refreshState}
					onHeaderRefresh={this.onHeaderRefresh}
					onFooterRefresh={this.onFooterRefresh}
					// 可选
					footerRefreshingText='正在玩命加载中...'
					footerFailureText='我擦嘞，居然失败了 =.=!'
					footerNoMoreDataText='我是有底线的 =.=!'
					footerEmptyDataText='我是有底线的 =.=!'
				/> */}

				{/* <ScrollView style={{ paddingTop: 10, marginBottom: 50, }} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />} > */}
				{this.listHeaderComponent()}
				{/* <ScrollView style={{ paddingTop: 10, flex: 1 }} >
					{this.state.goodsList.map((item, index) => <GoodsListItem key={index} data={item} index={index} />)}

					
				</ScrollView> */}
				{this.renderNoticeModal()}
			</View>
		);
	}
}
const mapStateToProps = state => ({
	logged: state.user.logged,
	userId: state.user.id,
	mobile: state.user.mobile,
	level: state.user.level,
	auditState: state.user.auditState,
	candyH: state.user.candyH || 0,
	candyP: state.user.candyP,
	candyNum: state.user.candyNum,
	location: state.user.location,
	warnVersion: state.router.warnVersion,
	isReaded: state.notice.isReaded,
	id: state.notice.id,
	uuid: state.user.uuid,
	isDoTask: state.user.isDoTask,
	dayNum: state.user.dayNum,
	title: state.notice.title,
	content: state.notice.content,
	userBalanceNormal: state.user.userBalanceNormal,
	userBalanceLock: state.user.userBalanceLock
});

const mapDispatchToProps = dispatch => ({
	updateNoticeInfo: ({ id, title, content, ceratedAt }) => dispatch({ type: UPDATE_NOTICE_INFO, payload: { id, title, content, ceratedAt } }),
	updateNoticeStatus: () => dispatch({ type: UPDATE_NOTICE_STATUS }),
	updateUserLocatin: (location) => dispatch({ type: UPDATE_USER_LOCATION, payload: { location } }),
	updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })

});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
const Styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: Colors.backgroundColor },
	wiper: { height: 160, overflow: "hidden" },
	banner: { height: 160, width: '100%' },
	bordercast: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
		overflow: "hidden"
	},
	bordercast1: {
		// flex: 1,
		marginBottom: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: 'center',
	},
	options: {
		flexDirection: 'row',
		marginTop: -20,
		marginHorizontal: 10,
		paddingBottom: 10,
		borderRadius: 5,
		flexWrap: 'wrap',
		backgroundColor: Colors.White,
	},
	optionTouch: {
		justifyContent: 'center',
		alignItems: 'center',
		width: (Metrics.screenWidth - 20) / 5,
		marginTop: 10
	},
	optionTitle: { marginTop: 4, fontSize: 12 },
	task: {
		marginHorizontal: 10,
		flexDirection: 'row',
		alignItems: 'center'
	},
	taskGif: {
		width: 210,
		height: 74,
		borderRadius: 5
	},
	yieldText: { fontSize: 12, color: Colors.grayFont, marginTop: 5 },
	profileText: {
		fontSize: 16,
		color: Colors.main,
		includeFontPadding: false,
		textAlignVertical: 'center',
		maxWidth: 100
	},
	profileTitle: {
		marginTop: 2,
		fontSize: 13,
		color: Colors.fontColor,
	},
	itemView: {
		width: (Metrics.screenWidth - 25) / 2,
		borderRadius: 2,
		marginBottom: 5,
		backgroundColor: Colors.White,
	},


	yield: { marginRight: 40, marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
	yieldInfo: { padding: 6, borderRadius: 6 },
	cdtPrompt: {
		height: 25,
		width: 40,
		borderTopRightRadius: 20,
		borderBottomRightRadius: 20,
		backgroundColor: Colors.C6,
		justifyContent: "center",
		marginLeft: 5,
		marginTop: 5,
		zIndex: 2,
	},
	yieldInfoText: { fontSize: 14, color: '#6b5a2e' },
	profile: {
		flex: 1,
		flexWrap: 'wrap',
		flexDirection: 'row',
		alignItems: 'center',
		paddingBottom: 5,
		marginTop: 10
	},
	profileItem: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1
	},
});
