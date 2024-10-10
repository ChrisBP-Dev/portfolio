import 'package:flutter/material.dart';
import 'package:portfolio/src/constants/business_information.dart';

class AppColor {
  //? do Light later
  static const Color primaryLightColor = Colors.black;
  static const Color secondaryLightColor = Color.fromARGB(255, 208, 213, 228);
  static const Color backgroundLightColor = Color.fromARGB(255, 234, 237, 237);
  // Text colors
  static const Color textPrimaryColorLight = Colors.black;
  static const Color textSecondaryColorLight =
      Color.fromARGB(255, 110, 107, 107);

  //? Dark
  static const Color primaryDarkColor = Color(0xFFFFFFFF);
  static const Color secondaryDarkColor = Color(0xff191919);
  static const Color backgroundDarkColor = Color(0xff161513);
  // Text colors
  static const Color textPrimaryColorDark = Color(0xFFFFFFFF);
  static const Color textSecondaryColorDark = Color(0xFFC5C5C5);

  static const LinearGradient textBusinessGradient = LinearGradient(
    colors: [
      BusinessInformation.primaryDarkColor,
      BusinessInformation.secondaryDarkColor,
    ],
  );
  static const LinearGradient textGreyGradientDark = LinearGradient(
    colors: [
      Colors.white,
      Color(0xffC5C5C5),
    ],
  );
  static const LinearGradient textGreyGradientLight = LinearGradient(
    colors: [
      Color.fromARGB(255, 150, 149, 149),
      Colors.black,
    ],
  );
}
