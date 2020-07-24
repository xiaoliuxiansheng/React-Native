package com.firstreactdemol;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // 1.导入启动屏包
public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "firstReactDemoL";
  }
   @Override
      protected void onCreate(Bundle savedInstanceState) {
          SplashScreen.show(this); // 2. 显示启动方法
          super.onCreate(savedInstanceState);
          ActivityCompat.requestPermissions(this, new String[]{android
          .Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
      }
}
