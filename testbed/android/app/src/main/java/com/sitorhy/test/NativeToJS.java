package com.sitorhy.test;

import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class NativeToJS extends ReactContextBaseJavaModule
{
	public NativeToJS(@Nonnull ReactApplicationContext reactContext)
	{
		super(reactContext);
	}

	@Nonnull
	@Override
	public String getName()
	{
		return "NativeToJS";
	}

	private void sendNotification(ReactContext reactContext,String eventName,@Nullable WritableMap params)
	{
		reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
	}

	@ReactMethod
	public void receiveNotification()
	{
		WritableMap map = Arguments.createMap();
		map.putString("title","赴戍登程口占示家人");
		map.putString("author","林则徐");
		map.putString("content","力微任重久神疲，再竭衰庸定不支。\n"+"苟利国家生死以，岂因祸福避趋之！\n"+"谪居正是君恩厚，养拙刚于戍卒宜。\n"+"戏与山妻谈故事，试吟断送老头皮。");

		this.sendNotification(this.getReactApplicationContext(),"recite",map);
	}
}
