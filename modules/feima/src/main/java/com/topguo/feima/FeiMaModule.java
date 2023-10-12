package com.topguo.feima;

import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.mob68.ad.RewardVideoAd;
import com.mob68.ad.listener.IRewardVideoAdListener;
import java.util.HashMap;

public class FeiMaModule extends ReactContextBaseJavaModule {

    private static final String TAG = FeiMaModule.class.getSimpleName();


    private ReactContext mReactContext;



    public FeiMaModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "FeiMaModule";
    }

    @ReactMethod
    public void initFmVideo(String appid,String posid, String secret) {
        RewardVideoAd.getInstance().init(getReactApplicationContext(), appid,posid,secret);
    }

    @ReactMethod
    public void openLookVideo(String appid,String posid,String secret) {
        Intent intent = new Intent();
        intent.setClass(mReactContext, LookVideoActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtra("appid",appid);
        intent.putExtra("posid",posid);
        intent.putExtra("secret",secret);
        mReactContext.startActivity(intent);
    }
}
