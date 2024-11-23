import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/features/home/presentation/components/about_me/about_buttons.dart';
import 'package:portfolio/src/features/home/presentation/components/about_me/about_details.dart';
import 'package:portfolio/src/features/home/presentation/components/about_me/about_text.dart';
import 'package:portfolio/src/features/home/presentation/components/about_me/avatar.dart';

class AboutMeComponent extends StatelessWidget {
  const AboutMeComponent({super.key});

  @override
  Widget build(BuildContext context) {
    return const ResponsiveCenter(
      padding: EdgeInsets.symmetric(horizontal: Sizes.globalPadding),
      child: Column(
        children: [
          gapH72,
          Avatar(),
          gapH48,
          AboutText(),
          gapH39,
          AboutDetails(),
          gapH48,
          AboutButtons(),
          gapH72,
        ],
      ),
    );
  }
}
