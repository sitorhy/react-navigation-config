//
//  NativeToJS.h
//  ReactNavigationConfig
//
//  Created by Sitorhy on 2019/9/15.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface NativeToJS : RCTEventEmitter<RCTBridgeModule>

- (void)sendNotification;

@end

NS_ASSUME_NONNULL_END
