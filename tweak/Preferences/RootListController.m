#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>

@interface PSListController : UITableViewController
- (NSArray *)loadSpecifiersFromPlistName:(NSString *)name target:(id)target;
@end

@interface RootListController : PSListController
@property (nonatomic, copy) NSArray *lgxSpecifiers;
@end

@implementation RootListController

- (NSArray *)specifiers {
    if (!self.lgxSpecifiers) {
        self.lgxSpecifiers = [self loadSpecifiersFromPlistName:@"Root" target:self];
    }
    return self.lgxSpecifiers;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = @"LiquidGlassX";
}

- (void)resetSettings {
    NSUserDefaults *defaults = [[NSUserDefaults alloc] initWithSuiteName:@"com.blue.liquidglassx"];
    [defaults removePersistentDomainForName:@"com.blue.liquidglassx"];
    [defaults synchronize];
    CFNotificationCenterPostNotification(CFNotificationCenterGetDarwinNotifyCenter(),
                                         CFSTR("com.blue.liquidglassx/preferences.changed"),
                                         NULL, NULL, YES);
}

@end