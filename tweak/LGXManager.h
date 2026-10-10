#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface LGXManager : NSObject

+ (instancetype)sharedInstance;
+ (BOOL)isEnabled;
+ (BOOL)isSafeModeEnabled;
+ (CGFloat)blurIntensity;
+ (CGFloat)glassOpacity;
+ (UIColor *)tintColor;
+ (NSString *)appearanceMode;
+ (void)registerDefaults;
+ (void)applySettings;
+ (void)toggleEnabled:(BOOL)enabled;

- (BOOL)isEnabled;
- (BOOL)isSafeModeEnabled;
- (CGFloat)blurIntensity;
- (CGFloat)glassOpacity;
- (UIColor *)tintColor;
- (NSString *)appearanceMode;
- (void)registerDefaults;
- (void)applySettings;

@end
