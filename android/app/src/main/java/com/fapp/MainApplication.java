package com.fapp;

import android.app.Application;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.ReactApplication;
import com.mustansirzia.fused.FusedLocationPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.burnweb.rnpermissions.RNPermissionsPackage;
import com.rnfs.RNFSPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }
	
	private CallbackManager mCallbackManager = CallbackManager.Factory.create();

	protected CallbackManager getCallbackManager() {
		return mCallbackManager;
	}

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new FusedLocationPackage(),
            new RNDeviceInfo(),
            new RNGeocoderPackage(),
            new ReactNativePushNotificationPackage(),
            new RNGoogleSigninPackage(),
            new VectorIconsPackage(),
			new MapsPackage(),
            new FBSDKPackage(mCallbackManager),
            new RNPermissionsPackage(),
            new RNFSPackage(),
            new ImageResizerPackage(),
            new ImagePickerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
