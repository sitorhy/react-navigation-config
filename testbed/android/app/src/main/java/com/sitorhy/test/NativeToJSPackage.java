package com.sitorhy.test;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import javax.annotation.Nonnull;
import java.util.ArrayList;
import java.util.List;

public class NativeToJSPackage implements ReactPackage
{
	@Nonnull
	@Override
	public List<NativeModule> createNativeModules(@Nonnull ReactApplicationContext reactContext)
	{
		List<NativeModule> modules = new ArrayList<>();
		modules.add(new NativeToJS(reactContext));
		return modules;
	}

	@Nonnull
	@Override
	public List<ViewManager> createViewManagers(@Nonnull ReactApplicationContext reactContext)
	{
		return new ArrayList<ViewManager>(0);
	}
}
