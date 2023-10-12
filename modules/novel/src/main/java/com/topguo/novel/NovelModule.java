package com.topguo.novel;


import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
//import com.mob.adsdk.AdConfig;
//import com.mob.adsdk.AdSdk;
//import com.mob.adsdk.so.BuildConfig;
import com.mob.novelsdk.NovelConfig;
import com.mob.novelsdk.NovelSdk;

import java.util.HashMap;

public class NovelModule extends ReactContextBaseJavaModule {
    private static final String TAG = NovelModule.class.getSimpleName();

    private ReactContext mReactContext;



    public NovelModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mReactContext = reactContext;
    }
    @NonNull
    @Override
    public String getName() {
        return "NovelModule";
    }

    @ReactMethod
    public void initNovel(String APP_ID,String userId) {
        // 初始化 AdSdk，小说中可以展现广告
//        AdSdk.getInstance().init(getReactApplicationContext(),
//                new AdConfig.Builder()
//                        .appId(APP_ID)
//                        .userId(userId) // 未登录可不设置 userId，登录时再设置
//                        .debug(BuildConfig.DEBUG)
//                        .build(),
//                null);

        NovelSdk.getInstance().init(getReactApplicationContext(),
                new NovelConfig.Builder()
                        .appId(APP_ID)
                        .debug(false)
                        .build(),
                null);
    }

    @ReactMethod
    public void setUserId(String userId) {
        NovelSdk.getInstance().setUserId(userId);
    }

    @ReactMethod
    public void setUserIdNull() {
        NovelSdk.getInstance().setUserId(null);
    }


    @ReactMethod
    public void openNovel() {
        Intent intent = new Intent();
        intent.setClass(mReactContext, NovelActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        mReactContext.startActivity(intent);
    }
}
