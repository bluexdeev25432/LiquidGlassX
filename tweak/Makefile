export THEOS_PACKAGE_SCHEME := rootless
export ARCHS := arm64
TARGET := iphone

include $(THEOS)/makefiles/common.mk

TWEAK_NAME = LiquidGlassX

LiquidGlassX_FILES = Tweak.x LGXManager.m
LiquidGlassX_FRAMEWORKS = UIKit Foundation
LiquidGlassX_PRIVATE_FRAMEWORKS = AppSupport
LiquidGlassX_INSTALL_PATH = /Library/MobileSubstrate/DynamicLibraries
LiquidGlassX_EXTRA_FRAMEWORKS = Preferences

include $(THEOS_MAKE_PATH)/tweak.mk

SUBPROJECTS += Preferences
include $(THEOS_MAKE_PATH)/aggregate.mk

after-stage::
	@find "$(THEOS_STAGING_DIR)" -type d -exec chmod 755 {} +
	@find "$(THEOS_STAGING_DIR)" -type f -exec chmod 644 {} +
	@find "$(THEOS_STAGING_DIR)" -type f -name "*.dylib" -exec chmod 755 {} +

after-install::
	@echo "Installed LiquidGlassX to /Library/MobileSubstrate/DynamicLibraries"

before-package::
	@chmod 755 "$(THEOS_STAGING_DIR)" "$(THEOS_STAGING_DIR)/DEBIAN"
	@find "$(THEOS_STAGING_DIR)" -type d -exec chmod 755 {} +
	@chmod 644 "$(THEOS_STAGING_DIR)/DEBIAN/control"
	@find "$(THEOS_STAGING_DIR)/DEBIAN" -maxdepth 1 -type f ! -name "control" -exec chmod 644 {} +
	@find "$(THEOS_STAGING_DIR)/DEBIAN" -maxdepth 1 -type f \( -name "preinst" -o -name "postinst" -o -name "prerm" -o -name "postrm" \) -exec chmod 755 {} +
