package com.sitorhy.test;

import android.content.DialogInterface;

import androidx.appcompat.app.AlertDialog;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class MessageBox extends ReactContextBaseJavaModule
{
    public static final String MB_OK="MB_OK";
    public static final String MB_YESNO="MB_YESNO";
    public static final String MB_OKCANCEL="MB_OKCANCEL";

    public MessageBox(@Nonnull ReactApplicationContext reactContext)
    {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName()
    {
        return "MessageBox";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants()
    {
        Map<String,Object> constants = new HashMap<>();
        constants.put(MessageBox.MB_OK,MessageBox.MB_OK);
        constants.put(MessageBox.MB_OKCANCEL,MessageBox.MB_OKCANCEL);
        constants.put(MessageBox.MB_YESNO,MessageBox.MB_YESNO);

        return constants;
    }

    @ReactMethod
    public void doModal(String title,String content,String type)
    {
        AlertDialog alertDialog;

        if(title.isEmpty())
        {
            title="[标题]";
        }
        if(content.isEmpty())
        {
            content="[内容]";
        }
        @SuppressWarnings("ResourceType")
        AlertDialog.Builder builder = new AlertDialog.Builder(this.getCurrentActivity());
        builder.setTitle(title);
        builder.setMessage(content);

        switch (type)
        {
            case MB_OKCANCEL:{
                builder.setPositiveButton("确认", (DialogInterface dialog, int which)->{
                    dialog.dismiss();
                });
                builder.setNegativeButton("取消", (DialogInterface dialog, int which)->{
                    dialog.dismiss();
                });
            }
            break;
            case MB_YESNO:
            {
                builder.setPositiveButton("是", (DialogInterface dialog, int which)->{
                    dialog.dismiss();
                });
                builder.setNegativeButton("否", (DialogInterface dialog, int which)->{
                    dialog.dismiss();
                });
            }
            break;
            case MB_OK:
            default:
            {
                builder.setPositiveButton("确定",(DialogInterface dialog, int which)->{
                    dialog.dismiss();
                });
            }
        }

        alertDialog = builder.create();
        alertDialog.show();
    }
}
