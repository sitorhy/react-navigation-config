package com.reactnavigationconfig;

import android.net.Uri;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity
{

	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		Uri uri = getIntent().getData();
		if(uri != null)
		{
			String scheme = uri.getScheme();
			String host = uri.getHost();
			String path = uri.getPath();
			String query = uri.getQuery();

			System.out.println(scheme);
			System.out.println(host);
			System.out.println(path);
			System.out.println(query);
		}

		super.onCreate(savedInstanceState);
	}

	/**
	 * Returns the name of the main component registered from JavaScript.
	 * This is used to schedule rendering of the component.
	 */
	@Override
	protected String getMainComponentName()
	{
		return "ReactNavigationConfig";
	}

	@Override
	protected ReactActivityDelegate createReactActivityDelegate()
	{
		return new ReactActivityDelegate(this,getMainComponentName())
		{
			@Override
			protected ReactRootView createRootView()
			{
				return new RNGestureHandlerEnabledRootView(MainActivity.this);
			}
		};
	}
}
