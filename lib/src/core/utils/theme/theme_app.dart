import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/core/utils/theme/text_theme.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'theme_app.g.dart';

class ThemeApp {
  ThemeData lightTheme(TextTheme textTheme) {
    return ThemeData.light().copyWith(
      textTheme: textTheme,
      scaffoldBackgroundColor: AppColor.backgroundLightColor,
      cardColor: AppColor.secondaryDarkColor,
      colorScheme: const ColorScheme.light(
        primary: AppColor.primaryLightColor,
      ),
    );
  }

  ThemeData darkTheme(TextTheme textTheme) {
    return ThemeData.dark().copyWith(
      textTheme: textTheme,
      scaffoldBackgroundColor: AppColor.backgroundDarkColor,
      cardColor: AppColor.secondaryDarkColor,
      colorScheme: const ColorScheme.dark(
        primary: AppColor.primaryDarkColor,
      ),
    );
  }
}

@riverpod
ThemeApp themeApp(Ref ref) {
  return ThemeApp();
}

@riverpod
ThemeData darkTheme(Ref ref, double screenWidth) {
  final themeApp = ref.read(themeAppProvider);
  final textTheme = ref.watch(darkTextThemeProvider(screenWidth));
  return themeApp.darkTheme(textTheme);
}

@riverpod
ThemeData lightTheme(Ref ref, double screenWidth) {
  final themeApp = ref.read(themeAppProvider);
  final textTheme = ref.watch(lightTextThemeProvider(screenWidth));
  return themeApp.lightTheme(textTheme);
}
