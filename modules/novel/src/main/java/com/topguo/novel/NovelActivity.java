package com.topguo.novel;

import android.os.Bundle;
import android.view.KeyEvent;

import androidx.appcompat.app.AppCompatActivity;

import com.mob.novelsdk.NovelFragment;

public class NovelActivity extends AppCompatActivity {

    private NovelFragment mNovelFragment;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_novel);

        mNovelFragment = NovelFragment.newInstance();
        getSupportFragmentManager() // fragment 嵌套替换成 getChildFragmentManager()
                .beginTransaction()
                .replace(R.id.container, mNovelFragment)
                .commitNowAllowingStateLoss();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (mNovelFragment.onKeyDown(keyCode, event)) {
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
