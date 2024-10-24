import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:portfolio/src/core/utils/resize_extensions.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'text_theme.g.dart';

class AppTextTheme {
  AppTextTheme();

  // do Light Theme later
  TextTheme lightTextTheme(double screenWidth) => TextTheme(
        headlineLarge: _poppins(
          fontSize: 55.0.sizeScaled(screenWidth, minSize: 25),
          fontWeight: FontWeight.bold,
          color: AppColor.textPrimaryColorLight,
        ),
        headlineMedium: _poppins(
          fontSize: 35.0.sizeScaled(screenWidth, minSize: 18),
          fontWeight: FontWeight.bold,
          color: AppColor.textPrimaryColorLight,
        ),
        headlineSmall: _poppins(
          fontSize: 22.0.sizeScaled(screenWidth, minSize: 17),
          fontWeight: FontWeight.bold,
          color: AppColor.textPrimaryColorLight,
        ),
        bodyLarge: _poppins(
          fontSize: 18.0.sizeScaled(screenWidth, minSize: 14),
          color: AppColor.textSecondaryColorLight,
        ),
        bodyMedium: _poppins(
          fontSize: 14.0.sizeScaled(screenWidth, minSize: 12),
          color: AppColor.textSecondaryColorLight,
        ),
        bodySmall: _poppins(
          fontSize: 14.0.sizeScaled(screenWidth, minSize: 12),
          color: AppColor.textPrimaryColorDark,
        ),
        // buttons
        labelLarge: _poppins(
          fontSize: 22.0.sizeScaled(screenWidth, minSize: 18),
          color: AppColor.textPrimaryColorLight,
        ),
      );

  ///  Dark Text Theme
  TextTheme darkTextTheme(double screenWidth) => TextTheme(
        headlineLarge: _poppins(
          fontSize: 55.0.sizeScaled(screenWidth, minSize: 25),
          fontWeight: FontWeight.bold,
          color: AppColor.textPrimaryColorDark,
        ),
        headlineMedium: _poppins(
          fontSize: 35.0.sizeScaled(screenWidth, minSize: 18),
          fontWeight: FontWeight.bold,
          color: AppColor.textPrimaryColorDark,
        ),
        headlineSmall: _poppins(
          fontSize: 22.0.sizeScaled(screenWidth, minSize: 17),
          fontWeight: FontWeight.bold,
          color: AppColor.textPrimaryColorDark,
        ),
        bodyLarge: _poppins(
          fontSize: 18.0.sizeScaled(screenWidth, minSize: 14),
          color: AppColor.textSecondaryColorDark,
        ),
        bodyMedium: _poppins(
          fontSize: 14.0.sizeScaled(screenWidth, minSize: 12),
          color: AppColor.textSecondaryColorDark,
        ),
        bodySmall: _poppins(
          fontSize: 14.0.sizeScaled(screenWidth, minSize: 12),
          color: AppColor.textPrimaryColorDark,
        ),
        // buttons
        labelLarge: _poppins(
          fontSize: 22.0.sizeScaled(screenWidth, minSize: 18),
          color: AppColor.textPrimaryColorDark,
        ),
      );

  TextStyle _poppins({
    Color? color,
    double? fontSize,
    FontWeight? fontWeight,
  }) =>
      GoogleFonts.poppins(
        color: color,
        fontSize: fontSize,
        fontWeight: fontWeight,
      );
}

@riverpod
AppTextTheme appTextTheme(AppTextThemeRef ref) {
  return AppTextTheme();
}

@riverpod
TextTheme lightTextTheme(LightTextThemeRef ref, double screenWidth) {
  final appTextTheme = ref.watch(appTextThemeProvider);
  return appTextTheme.lightTextTheme(screenWidth);
}

@riverpod
TextTheme darkTextTheme(DarkTextThemeRef ref, double screenWidth) {
  final appTextTheme = ref.watch(appTextThemeProvider);
  return appTextTheme.darkTextTheme(screenWidth);
}
