//
//  NativeToJS.m
//  ReactNavigationConfig
//
//  Created by Sitorhy on 2019/9/15.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "NativeToJS.h"

@implementation NativeToJS

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"recite"];
}

- (void)sendNotification
{
  NSMutableDictionary * dict=[[NSMutableDictionary alloc] init];
  [dict setValue:@"赴戍登程口占示家人" forKey:@"title"];
  [dict setValue:@"林则徐" forKey:@"author"];
  [dict setValue:@"力微任重久神疲，再竭衰庸定不支。\n苟利国家生死以，岂因祸福避趋之！\n谪居正是君恩厚，养拙刚于戍卒宜。\n戏与山妻谈故事，试吟断送老头皮。" forKey:@"content"];
  
  [self sendEventWithName:@"recite" body:dict];
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(receiveNotification)
{
  [self sendNotification];
}

@end
