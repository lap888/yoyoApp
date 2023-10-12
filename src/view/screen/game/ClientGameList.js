import React, { Component } from 'react';
import { View, Image, Platform, StyleSheet, InteractionManager, Linking, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
// import { Toast } from 'native-base';
import { GameList, TodayAn } from '../../components/Index';
import { Colors } from '../../theme/Index';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';
import { upgrade } from 'rn-app-upgrade';
import { Actions } from 'react-native-router-flux';
import Cookie from 'cross-cookie';
import { connect } from 'react-redux';
import { onPressSwiper } from '../../../utils/CommonFunction';
class ClientGameList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameList: [],
            currentPage: 1,
            totalPage: 1,
            firstLoading: true,
            loadingMore: false,
            recommendation: {},
            bannerList: []
        }

    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchFirstGame(this.props.type);
            this.fetchList(this.state.currentPage);
            if (this.props.type === 0) this.fetchBanner(1);
        });
    }
    /**
     * 获取游戏Banner列表
     * @param {*} source 
     */
    fetchBanner(source) {
        var that = this;
        Send("api/system/banners?source=" + source, {}, 'GET').then(res => {
            if (res.code == 200) {
                that.setState({ bannerList: res.data });
            } else {
                Toast.tipBottom(res.message)
                // Toast.show({
                //     text: res.message,
                //     textStyle: { color: '#FFFFFF', textAlign: 'center' },
                //     position: "bottom",
                //     duration: 2000
                // });
            }
        })
    }
    /**
     * 首发游戏获取
     */
    fetchFirstGame(type) {
        var that = this;
        Send(`api/Game/FristGame?type=${type}&platform=${Platform.OS}`, {}, 'get').then(res => {
            if (res.code == 200) {
                that.setState({ recommendation: res.data });
            }
        });
    }
    /**
     * 获取游戏列表信息
     * @param {*} page 
     */
    fetchList(page) {
        this.setState({ currentPage: page });
        var that = this;
        Send("api/Game/GameList", { type: this.props.type, pageIndex: page, platform: Platform.OS }).then(res => {
            if (that.state.firstLoading) that.setState({ firstLoading: false });
            if (that.state.loadingMore) that.setState({ loadingMore: false });

            if (res.code == 200) {
                // 初始化
                if (page === 1) {
                    that.setState({ gameList: res.data, totalPage: res.recordCount });
                } else {
                    let gameListTemp = [...that.state.gameList];
                    that.setState({ gameList: gameListTemp.concat(res.data), totalPage: res.recordCount });
                }
            } else {
                Toast.tipBottom(res.message);
            }
        });
    }

    /**
     * 渲染游戏轮播图
     */
    renderSwiper() {
        if (this.props.type !== 0) return <View />;
        return (
            <View style={Styles.cardItemForGraph}>
                <Swiper
                    key={this.state.bannerList.length}
                    loop={true}
                    horizontal={true}
                    autoplay={true}
                    autoplayTimeout={4}
                    paginationStyle={{ bottom: 5 }}
                    showsButtons={false}
                    activeDotStyle={{ width: 15, height: 3, backgroundColor: Colors.White, borderRadius: 1 }}
                    dotStyle={{  width: 15, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 1 }}>
                    {this.state.bannerList.map(item =>
                        <TouchableOpacity key={item['id'].toString()} onPress={() => onPressSwiper(item, this.props.mobile, this.props.userId)}>
                            <Image
                                source={{ uri: item['imageUrl'] }}
                                style={Styles.img}
                            />
                        </TouchableOpacity>
                    )}
                </Swiper>
            </View>
        )
    }
    /**
     * 渲染列表Header
     */
    renderHeader() {
        return (
            <View>
                {this.renderSwiper()}
                <TodayAn>{this.state.recommendation}</TodayAn>
            </View>
        )
    }
    render() {
        let { gameList, firstLoading, loadingMore, currentPage, totalPage } = this.state;
        return (
            <View style={Styles.container}>
                <GameList
                    data={gameList}
                    firstLoading={firstLoading}
                    loadingMore={loadingMore}
                    currentPage={currentPage}
                    totalPage={totalPage}
                    ListHeaderComponent={this.renderHeader()}
                    fetchList={page => this.fetchList(page)}
                />
            </View>
        );
    }
}
const mapStateToProps = state => ({
    userId: state.user.id,
    mobile: state.user.mobile,
});

const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(ClientGameList);
const Styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    img: {
        height: '100%',
        width: '100%',
        borderRadius: 5,
    },
    cardItemForGraph: {
        height: 150,
        margin: 5,
        flexDirection: "row",
        overflow: "hidden"
    },
});