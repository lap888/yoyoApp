import BloomAd from 'react-native-bloom-ad';
// import AdSdk from 'react-native-mobad'
// import { Pletfome} from 'react-native';
import { NativeModules } from 'react-native';

const FeiMa = NativeModules.FeiMaModule;

const Novel = NativeModules.NovelModule;

const Advert = {};

Advert.init = (callback) => {
    BloomAd.init("ba88b40c2c04cd5752")
        .then((appId) => {
            // 初始化成功
            callback && callback(true)
        })
        .catch((error) => {
            // 初始化失败
            callback && callback(false)
            console.log(error);
        });

    // AdSdk.init({
    //     appId: 'ba88b40c2c04cd5752',
    //     debug: false, // 是否调试模式，默认 false，请至少运行一次调试模式
    // }).then((appId) => {
    //     // 初始化成功
    //     callback && callback(true)
    // }).catch((error) => {
    //     // 初始化失败
    //     callback && callback(false)
    //     console.log(error);
    // });
}

Advert.setUserId = (userId) => {
    // 登录时请设置 userId
    BloomAd.setUserId(`${userId}`);
    // AdSdk.setUserId(userId);

}

Advert.setUserId = () => {
    // 登录时请设置 userId
    BloomAd.setUserId();
    // AdSdk.setUserId(null);
}

Advert.showSplash = () => {
    const interval = 1000 * 60 * 3;  // 设置时间间隔，单位是毫秒，切到后台后超过间隔返回时重新加载开屏
    BloomAd.showSplash({
        unitId: "s1", // 广告位 id
        time: interval,
        onAdDismiss(params) {
            // 广告被关闭
            console.log(params);
        },
        onError(params) {
            // 广告出错
            console.log(params);
        },
    });
    // AdSdk.setMinSplashInterval(3 * 60 * 1000); // 单位 ms
    // AdSdk.showSplashAd({
    //     onAdDismiss({ id }) {
    //         // 广告被关闭
    //         console.log(id);
    //     },
    //     onError({ id, code, message }) {
    //         // 广告出错
    //         console.log(id, code, message);
    //     },
    // });

}


Advert.rewardVideo = (callback) => {
    // AdSdk.showRewardVideoAd({
    //     unitId: 'rv1',
    //     onAdLoad({ id }) { },
    //     onVideoCached({ id }) { },
    //     onAdShow({ id }) { },
    //     onReward({ id }) { callback && callback(true) },
    //     onAdClick({ id }) { },
    //     onVideoComplete({ id }) { },
    //     onAdClose({ id }) { },
    //     onError({ id, code, message }) { callback && callback(false) },
    // });

    BloomAd.rewardVideo({
        unitId: "rv1", // 广告位 id
        showWhenCached: false, // 是否完全加载后才开始播放
        onAdLoad(params) {
            // 广告加载成功
            console.log('onAdLoad', params);
        },
        onVideoCached(params) {
            // 视频素材缓存成功
            console.log('onVideoCached', params);
        },
        onAdShow(params) {
            // 广告页面展示
            console.log('onAdShow', params);
        },
        onReward(params) {
            // 广告激励发放
            console.log('onReward', params);
            callback && callback(true)
        },
        onAdClick(params) {
            // 广告被点击
            console.log('onAdClick', params);
        },
        onVideoComplete(params) {
            // 广告播放完毕
            console.log('onVideoComplete', params);
            // callback && callback(true)
        },
        onAdClose(params) {
            // 广告被关闭
            console.log('onAdClose', params);
        },
        onError(params) {
            // 广告出错
            console.log('onError', params);
            callback && callback(false)
        },
    });
}

Advert.interstitial = () => {
    // AdSdk.showInterstitialAd({
    //     unitId: 'i1',
    //     onAdLoad({ id }) { },
    //     onAdShow({ id }) { },
    //     onAdClick({ id }) { },
    //     onAdClose({ id }) { },
    //     onError({ id, code, message }) { },
    // });
    BloomAd.interstitial({
        unitId: "i1", // 广告位 id
        width: 300, // 插屏广告广告宽度
        onAdLoad(params) {
            // 广告加载成功
            console.log(params);
        },
        onAdShow(params) {
            // 广告页面展示
            console.log(params);
        },
        onAdClick(params) {
            // 广告被点击
            console.log(params);
        },
        onAdClose(params) {
            // 广告被关闭
            console.log(params);
        },
        onError(params) {
            // 广告出错
            console.log(params);
        },
    });
}

Advert.FeiMaAndroid = (posid) => {
    FeiMa.openLookVideo('2510', posid, 'ohVkomWy');
}

Advert.initFmVideo = (posid) => {
    FeiMa.initFmVideo('2510', posid, 'ohVkomWy');
}


Advert.initNovel = (userId = '') => {
    Novel.initNovel("ba88b40c2c04cd5752", userId);
    // Novel.initNovel("ba0063bfbc1a5ad878", userId);
    
}

Advert.openNovel = () => {
    Novel.openNovel();
}

Advert.NovelSetUserId = (userId) => {
    // 登录时请设置 userId
    Novel.setUserId(`${userId}`);
}

Advert.NovelSetUserId = () => {
    //退出登录时候
    Novel.setUserIdNull();
}

export default Advert;