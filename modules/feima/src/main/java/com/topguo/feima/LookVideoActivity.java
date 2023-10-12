package com.topguo.feima;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.widget.Toast;

//import com.alibaba.fastjson.JSON;
import com.mob68.ad.RewardVideoAd;
import com.mob68.ad.listener.IRewardVideoAdListener;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.HashMap;

public class LookVideoActivity extends AppCompatActivity {

    private RewardVideoAd mRewardVideoAd;
    private Context mContext;
    private String _imei;
//    private String _token;
//    private String _timeSpan;
//    private String _url;
//    private String _sign;
    private String appid;
    private String posid;
    private String secret;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.mContext = this;
        Intent intent = getIntent();
        appid = intent.getStringExtra("appid");
        posid = intent.getStringExtra("posid");
        secret = intent.getStringExtra("secret");

//        _token = intent.getStringExtra("token");
//        _timeSpan=intent.getStringExtra("timeSpan");
//        _url=intent.getStringExtra("url");
//        String api=intent.getStringExtra("api");
//        String auth=intent.getStringExtra("auth");
//        _sign=intent.getStringExtra("sign");//Sign(api,_token,_timeSpan,auth);
        setContentView(R.layout.activity_look_video);

        if (ActivityCompat.checkSelfPermission(this, "android.permission.READ_PHONE_STATE") != 0) {
            _imei="999";
            ActivityCompat.requestPermissions(this, new String[] { "android.permission.READ_PHONE_STATE" }, 100);
        } else {
            TelephonyManager telephonyMgr = (TelephonyManager)getSystemService(TELEPHONY_SERVICE);
            if (telephonyMgr != null) {
//                _imei = telephonyMgr.getDeviceId();
                if (_imei==null) _imei="888";
            }else {
                _imei="999";
            }
            onCallPermission();
        }

//         RewardVideoAd.getInstance().init(this, appid,posid,secret);

        RewardVideoAd.getInstance().loadAd(this,new IRewardVideoAdListener() {
            @Override
            public void onAdSuccess() {
                if (RewardVideoAd.getInstance().isReady()) {
                    RewardVideoAd.getInstance().showAd();
                }else {
                    Toast.makeText(LookVideoActivity.this, "还未获取到广告", Toast.LENGTH_LONG).show();
                }
            }
            @Override
            public void onAdFailed(String s) {
                printStatusMsg("视频onAdFailed:"+s);
            }
            @Override
            public void onAdClick(long l) {
                printStatusMsg("视频onAdClick.");
            }
            @Override
            public void onVideoPlayStart() {
                printStatusMsg("视频onVideoPlayStart.");
            }
            @Override
            public void onVideoPlayComplete() {
                printStatusMsg("视频onVideoPlayComplete.");
            }
            @Override
            public void onVideoPlayError(String s) {
                printStatusMsg("视频onAdClick.");
            }
            @Override
            public void onVideoPlayClose(long l) {
                printStatusMsg("视频onVideoPlayClose.");
            }
            @Override
            public void onAdPreSuccess() {
                printStatusMsg("视频onAdPreSuccess.");
            }
            @Override
            public void onLandingPageOpen() {
                printStatusMsg("视频onLandingPageOpen.");
            }
            @Override
            public void onLandingPageClose() {
                printStatusMsg("视频onLandingPageClose.");
//                Toast.makeText(LookVideoActivity.this, "视频onLandingPageClose", Toast.LENGTH_SHORT).show();
//                LookVideoActivity.this.finish();
//                try {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            LookVideoActivity.this.finish();
                        }
                    });
//                } catch (InterruptedException e) {
//                    e.printStackTrace();
//                }
            }
            @Override
            public void onReward(HashMap<String, String> hashMap) {
            }
        });

    }

    public String Sign(String api,String token,String timeSpan,String AUTH_SECRET)
    {
        String stringArray[] = {timeSpan,api, token,  AUTH_SECRET};
        String stringArray2[] =new  String[4];
        StringBuffer str = new StringBuffer();
        for (String s : stringArray) {
//            str.append(s.toUpperCase());
//            stringArray2.add(s);
        }
        for (String s : stringArray) {
            str.append(s.toUpperCase());
        }
        Arrays.sort(stringArray);
        String signStr=str.toString();
        String signMd5=Md5(signStr).substring(5,29);
        return signMd5;
    }

    public String Md5(String content) {
        byte[] hash;
        try {
            hash = MessageDigest.getInstance("MD5").digest(content.getBytes("UTF-8"));
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("NoSuchAlgorithmException",e);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("UnsupportedEncodingException", e);
        }
        //对生成的16字节数组进行补零操作
        StringBuilder hex = new StringBuilder(hash.length * 2);
        for (byte b : hash) {
            if ((b & 0xFF) < 0x10){
                hex.append("0");
            }
            hex.append(Integer.toHexString(b & 0xFF));
        }
        return hex.toString();
    }

    public void onCallPermission()
    {
        if (Build.VERSION.SDK_INT >= 23)
        {
            if (checkSelfPermission("android.permission.WRITE_EXTERNAL_STORAGE") != PackageManager.PERMISSION_GRANTED)
            {
                if (shouldShowRequestPermissionRationale("android.permission.RECORD_AUDIO"))
                {
                    Toast.makeText(this, "Please grant the permission this time", Toast.LENGTH_LONG).show();
                }

                ActivityCompat.requestPermissions(this, new String[] { "android.permission.WRITE_EXTERNAL_STORAGE" }, 102);
            } else {
                Log.i("wei", "onClick granted");
            }
        }
    }

    protected void onResume()
    {
        super.onResume();
    }


    protected void onDestroy()
    {
        this.mContext = null;
        super.onDestroy();
    }

    private void printStatusMsg(String txt) {
        if (null != txt) {
            Log.d("----", txt);
        }
    }

}
