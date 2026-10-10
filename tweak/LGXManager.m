#import "LGXManager.h"

@interface LGXManager ()
@property (nonatomic, assign) BOOL enabled;
@property (nonatomic, assign) BOOL safeMode;
@property (nonatomic, assign) CGFloat blurIntensity;
@property (nonatomic, assign) CGFloat glassOpacity;
@property (nonatomic, strong) UIColor *tintColor;
@property (nonatomic, copy) NSString *appearanceMode;
@end

static NSUserDefaults *LGXPreferencesDefaults(void) {
    return [[NSUserDefaults alloc] initWithSuiteName:@"com.blue.liquidglassx"];
}

static void LGXPreferencesChanged(CFNotificationCenterRef center, void *observer, CFStringRef name, const void *object, CFDictionaryRef userInfo) {
    [(LGXManager *)observer applySettings];
}

@implementation LGXManager

+ (instancetype)sharedInstance {
    static LGXManager *shared = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        shared = [[LGXManager alloc] init];
        [shared registerDefaults];
        [shared applySettings];
    });
    return shared;
}

+ (BOOL)isEnabled {
    return [[LGXManager sharedInstance] isEnabled];
}

- (BOOL)isEnabled {
    return self.enabled;
}

+ (BOOL)isSafeModeEnabled {
    return [[LGXManager sharedInstance] isSafeModeEnabled];
}

- (BOOL)isSafeModeEnabled {
    return self.safeMode;
}

+ (CGFloat)blurIntensity {
    return [[LGXManager sharedInstance] blurIntensity];
}

+ (CGFloat)glassOpacity {
    return [[LGXManager sharedInstance] glassOpacity];
}

+ (UIColor *)tintColor {
    return [[LGXManager sharedInstance] tintColor];
}

+ (NSString *)appearanceMode {
    return [[LGXManager sharedInstance] appearanceMode];
}

+ (void)registerDefaults {
    [[LGXManager sharedInstance] registerDefaults];
}

- (void)registerDefaults {
    NSDictionary *defaults = @{
        @"LGXEnabled": @YES,
        @"LGXSafeMode": @NO,
        @"LGXBlurIntensity": @20.0,
        @"LGXGlassOpacity": @0.68,
        @"LGXAppearanceMode": @"Dark",
        @"LGXTintColor": @"#7AA2FF"
    };

    [LGXPreferencesDefaults() registerDefaults:defaults];
}

+ (void)applySettings {
    [[LGXManager sharedInstance] applySettings];
}

- (void)applySettings {
    NSUserDefaults *defaults = LGXPreferencesDefaults();

    self.enabled = [defaults objectForKey:@"LGXEnabled"] ? [[defaults objectForKey:@"LGXEnabled"] boolValue] : YES;
    self.safeMode = [defaults objectForKey:@"LGXSafeMode"] ? [[defaults objectForKey:@"LGXSafeMode"] boolValue] : NO;
    self.blurIntensity = [defaults objectForKey:@"LGXBlurIntensity"] ? [[defaults objectForKey:@"LGXBlurIntensity"] doubleValue] : 20.0;
    self.glassOpacity = [defaults objectForKey:@"LGXGlassOpacity"] ? [[defaults objectForKey:@"LGXGlassOpacity"] doubleValue] : 0.68;
    self.appearanceMode = [defaults objectForKey:@"LGXAppearanceMode"] ? [defaults objectForKey:@"LGXAppearanceMode"] : @"Dark";

    NSString *hexColor = [defaults objectForKey:@"LGXTintColor"] ?: @"#9CE8D0";
    if ([hexColor hasPrefix:@"#"] && (hexColor.length == 7 || hexColor.length == 9)) {
        unsigned int rgb = 0;
        NSScanner *scanner = [NSScanner scannerWithString:[hexColor substringFromIndex:1]];
        [scanner scanHexInt:&rgb];
        uint8_t r = (rgb >> 16) & 0xFF;
        uint8_t g = (rgb >> 8) & 0xFF;
        uint8_t b = rgb & 0xFF;
        self.tintColor = [UIColor colorWithRed:(r / 255.0) green:(g / 255.0) blue:(b / 255.0) alpha:1.0];
    } else {
        self.tintColor = [UIColor systemBlueColor];
    }
}

+ (void)toggleEnabled:(BOOL)enabled {
    LGXManager *manager = [LGXManager sharedInstance];
    manager.enabled = enabled;
    NSUserDefaults *defaults = LGXPreferencesDefaults();
    [defaults setObject:@(enabled) forKey:@"LGXEnabled"];
    [defaults synchronize];
}

- (instancetype)init {
    self = [super init];
    if (self) {
        self.enabled = YES;
        self.safeMode = NO;
        self.blurIntensity = 20.0;
        self.glassOpacity = 0.68;
        self.appearanceMode = @"Dark";
        self.tintColor = [UIColor systemBlueColor];
        CFNotificationCenterAddObserver(CFNotificationCenterGetDarwinNotifyCenter(), (__bridge const void *)self,
                        LGXPreferencesChanged, CFSTR("com.blue.liquidglassx/preferences.changed"),
                        NULL, CFNotificationSuspensionBehaviorCoalesce);
    }
    return self;
}

@end
