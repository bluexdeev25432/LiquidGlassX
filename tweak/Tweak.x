#import <UIKit/UIKit.h>
#import "LGXManager.h"

@interface CCUIControlCenterViewController : UIViewController
@end

@interface UIStatusBar : UIView
@end

#define kLGXCompatibilityWarning "LiquidGlassX requires device validation before assuming runtime compatibility."

static BOOL LGXShouldApply() {
    if (![LGXManager isEnabled]) {
        return NO;
    }

    if ([LGXManager isSafeModeEnabled]) {
        return NO;
    }

    return YES;
}

static void LGXApplyGlassStyle(UIView *view) {
    if (!view || !LGXShouldApply()) {
        return;
    }

    view.layer.cornerRadius = 20.0;
    view.layer.masksToBounds = YES;
    view.layer.borderWidth = 1.0;
    view.layer.borderColor = [UIColor colorWithWhite:1.0 alpha:0.18].CGColor;
    view.backgroundColor = [[LGXManager tintColor] colorWithAlphaComponent:[LGXManager glassOpacity] * 0.18];

    NSString *systemVersion = [[UIDevice currentDevice] systemVersion];
    if ([systemVersion compare:@"13.0" options:NSNumericSearch] != NSOrderedAscending) {
        static const NSInteger darkThinMaterial = 17;
        static const NSInteger lightThinMaterial = 12;
        static const NSInteger systemThinMaterial = 7;
        NSString *appearance = [LGXManager appearanceMode];
        NSInteger style = [appearance isEqualToString:@"Light"] ? lightThinMaterial :
            ([appearance isEqualToString:@"System"] ? systemThinMaterial : darkThinMaterial);
        UIBlurEffect *effect = [UIBlurEffect effectWithStyle:style];
        NSInteger glassTag = 0x4c475847;
        UIVisualEffectView *glass = (UIVisualEffectView *)[view viewWithTag:glassTag];
        if (!glass) {
            glass = [[UIVisualEffectView alloc] initWithEffect:effect];
            glass.tag = glassTag;
            [view addSubview:glass];
            [view sendSubviewToBack:glass];
        } else {
            glass.effect = effect;
        }
        glass.frame = view.bounds;
        glass.alpha = MIN(1.0, MAX(0.0, [LGXManager blurIntensity] / 32.0));
    }
}

%hook SpringBoard
- (void)applicationDidFinishLaunching:(id)application {
    %orig;
    [LGXManager registerDefaults];
    [LGXManager applySettings];
}
%end

%hook CCUIControlCenterViewController
- (void)viewDidLoad {
    %orig;
    if (LGXShouldApply()) {
        UIView *rootView = self.view;
        if (rootView) {
            LGXApplyGlassStyle(rootView);
        }
    }
}

- (void)viewDidLayoutSubviews {
    %orig;
    if (LGXShouldApply()) {
        LGXApplyGlassStyle(self.view);
    }
}
%end

%hook UIStatusBar
- (void)layoutSubviews {
    %orig;
    if (LGXShouldApply()) {
        self.backgroundColor = [UIColor colorWithWhite:0.08 alpha:0.3];
        self.alpha = 1.0;
    }
}
%end

%ctor {
    [LGXManager registerDefaults];
    [LGXManager applySettings];
    NSLog(@"[LiquidGlassX] Loaded. %s", kLGXCompatibilityWarning);
}
