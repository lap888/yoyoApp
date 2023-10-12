import React, { Component } from 'react';
import { StyleSheet, Platform, StatusBar, Image, View, Text } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';

import { isIphoneX } from 'react-native-iphone-x-helper';
import { connect } from 'react-redux';
import Home from './home/Home';
import Game from './game/Game';
import GameHtml from './game/GameHtml';

import Otc from './otc/Otc';
import Block from './blockchian/Block';
import Colors from '../theme/Colors';
import { Send } from '../../utils/Http';
import { UPDATE_USER } from '../../redux/ActionTypes';
import Information from './news/Information';
import { Toast } from '../common';
import MineScreen from './mine/MineScreen';
import PinDuoduoShop from './shop/PinDuoduoShop';
import ClassfiyScreen from './shop/ClassfiyScreen';
import StoreScreen from './store/StoreScreen';
const TabBarComponent = props => <BottomTabBar {...props} />;

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: "home",
            badgeValue: "···"
        };
    }

    componentDidMount() {
        this.updateUserInfo(-1);
    }

    /**
	 * 刷新用户信息
	 */
    updateUserInfo(key) {
        if (key !== -1) {
            if (["home", "otc", "mine"].indexOf(key) === -1) return;
        }
        if (!this.props.logged) return;
        var that = this;
        Send("api/system/InitInfo", {}, 'GET').then(res => {
            if (res.code == 200) {
                that.props.updateUserInfo(res.data)
            } else {
                Toast.tipBottom(res.message)
            }
        });
    }
    /**
     * 切换Tab
     * @param {*} key 
     */
    switchTab(key) {
        // 修改状态栏样式
        if (Platform.OS === 'android') this.changeStatusBar(key);
        this.updateUserInfo(key);
        this.setState({ selectedTab: key });
    }

    changeStatusBar(key) {
        StatusBar.setTranslucent(false);
        StatusBar.setBackgroundColor(Colors.main, true);
    }

    /**
     * 渲染选项卡
     * @param {string} title 
     * @param {string} tabName 组件名字
     * @param {*} isBadge 
     */
    renderTabView(title, tabName, isBadge) {
        let unSelectIcon;
        let selectIcon;
        let tabPage;
        switch (tabName) {
            case 'home':
                unSelectIcon = require('../images/main/shouye0.png');
                selectIcon = require('../images/main/shouye1.png');
                tabPage = <Home />;
                break;
            case 'game':
                unSelectIcon = require('../images/main/svgmoban0.png');
                selectIcon = require('../images/main/svgmoban14.png');
                tabPage = <Game />;
                break;
            case 'news':
                unSelectIcon = require('../images/main/zixun0.png');
                selectIcon = require('../images/main/zixun_huaban.png');
                tabPage = <Information />;
                break;
            case 'shop':
                unSelectIcon = require('../images/main/tabShop0.png');
                selectIcon = require('../images/main/tabShop.png');
                tabPage = <ClassfiyScreen />;
                break;
            case 'block':
                unSelectIcon = require('../images/main/renwu0.png');
                selectIcon = require('../images/main/renwu.png');
                tabPage = <Block />;
                break;
            case 'store':
                unSelectIcon = require('../images/main/fujin0.png');
                selectIcon = require('../images/main/fujin.png');
                tabPage = <StoreScreen />;
                break;
            case 'mine':
                unSelectIcon = require('../images/main/wode0.png');
                selectIcon = require('../images/main/wode.png');
                tabPage = <MineScreen />;
                break;
        }

        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === tabName}
                title={title}
                titleStyle={styles.tabText}
                selectedTitleStyle={styles.tabTextSelected}
                renderIcon={() => <Image style={styles.imagestyle} source={unSelectIcon} />}
                renderSelectedIcon={() => <Image style={styles.imagestyle} source={selectIcon} />}

                onPress={() => this.switchTab(tabName)}
                renderBadge={() => isBadge ? <View style={styles.badgeView}><Text style={styles.badgeText}>{this.state.badgeValue}</Text></View> : null}
            >
                {tabPage}
            </TabNavigator.Item>
        );
    }
    //自定义tabBar simple seal for tabNavigatorItem
    renderTabBarView() {
        return (
            <TabNavigator
                tabBarStyle={styles.tab}>
                {this.renderTabView('首页', 'home', false)}
                {this.renderTabView('游戏', 'game', false)}
                {/* {this.renderTabView('YOYO', 'block', true)} */}
                {this.renderTabView('商城', 'shop', false)}
                {this.renderTabView('附近', 'store', false)}
                {this.renderTabView('我的', 'mine', false)}
            </TabNavigator>
        );
    }
    //自定义tabBar simple seal for tabNavigatorItem
    renderNavigatorTabBarView() {

        const TabScreens = createBottomTabNavigator(
            {
                Home: {
                    screen: Home,
                    navigationOptions: ({ navigation, screenProps }) => ({
                    // tabBarLabel: `${I18n.t('home.tab_home')}`,
                    // tabBarVisible: navigation.state.index === 0,
                    }),
                },
                Game: {
                    screen: Game,
                    navigationOptions: ({ navigation, screenProps }) => ({
                    // tabBarLabel: `${I18n.t('home.tab_home')}`,
                    // tabBarVisible: navigation.state.index === 0,
                    }),
                },
                Otc: {
                    screen: Otc,
                    navigationOptions: ({ navigation, screenProps }) => ({
                    // tabBarLabel: `${I18n.t('home.tab_home')}`,
                    // tabBarVisible: navigation.state.index === 0,
                    }),
                },
                // Block: {
                //     screen: Block,
                //     navigationOptions: ({ navigation, screenProps }) => ({
                //     // tabBarLabel: `${I18n.t('home.tab_home')}`,
                //     // tabBarVisible: navigation.state.index === 0,
                //     }),
                // },
                StoreScreen: {
                    screen: StoreScreen,
                    navigationOptions: ({ navigation, screenProps }) => ({
                    // tabBarLabel: `${I18n.t('home.tab_home')}`,
                    // tabBarVisible: navigation.state.index === 0,
                    }),
                },
                MineScreen: {
                    screen: MineScreen,
                    navigationOptions: ({ navigation, screenProps }) => ({
                    // tabBarLabel: `${I18n.t('home.tab_home')}`,
                    // tabBarVisible: navigation.state.index === 0,
                    }),
                },
            },
            {
            tabBarComponent: props => (
                <TabBarComponent {...props} style={{ borderTopColor: '#fff' }} />
                ),
            }
        );

        return (
            <TabScreens/>
        );
    }

    render() {
        return (
            this.renderTabBarView()
            // this.renderNavigatorTabBarView()
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged
});

const mapDispatchToProps = dispatch => ({

    updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })

});
export default connect(mapStateToProps, mapDispatchToProps)(Index);
const styles = StyleSheet.create({
    imagestyle: { width: 22, height: 22 },
    tabTextSelected: { color: Colors.C6, fontSize: 12, paddingTop: 0, fontWeight: 'bold' },
    tabText: { color: Colors.C10, fontSize: 12, fontWeight: 'bold' },
    tab: {
        flex: 1,
        // borderTopWidth: 1,
        borderColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
        overflow: 'visible',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50 + (isIphoneX() ? 15 : 0),
        paddingBottom: isIphoneX() ? 15 : 0,
    },
    badgeView: {
        width: 14,
        height: 14,
        backgroundColor: Colors.main,
        borderWidth: 1,
        marginLeft: 10,
        marginTop: 3,
        borderColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    badgeText: {
        color: '#ffffff',
        fontSize: 8,
    }
})

