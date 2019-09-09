//
//  MessageBox.m
//  ReactNavigationConfig
//
//  Created by Sitorhy on 2019/9/9.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "MessageBox.h"
#import "../ReactNavigationConfig/AppDelegate.h";

@implementation MessageBox

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(doModal:(NSString *)withTitle withContent:(NSString *)content buttonType:(NSString *)type)
{
  NSLog(@"%@",withTitle);
  NSLog(@"%@",content);
  NSLog(@"%@",type);
  
  dispatch_async(dispatch_get_main_queue(), ^{
    UIAlertController * controller = [UIAlertController alertControllerWithTitle:withTitle message:content preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction * yes = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
      
    }];
    
    UIAlertAction * no = [UIAlertAction actionWithTitle:@"取消  " style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
      
    }];
    
    [controller addAction:yes];
    [controller addAction:no];
    
    
    AppDelegate * delegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
    [delegate.window.rootViewController presentViewController:controller animated:YES completion:nil];
  });
}

@end
