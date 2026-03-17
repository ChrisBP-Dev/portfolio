import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/custom_title_on_component.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/features/home/presentation/components/experience/experiences_list.dart';
import 'package:portfolio/src/localization/l10n.dart';

class ExperienceComponent extends StatelessWidget {
  const ExperienceComponent({super.key});

  @override
  Widget build(BuildContext context) {
    return ResponsiveCenter(
      padding: const EdgeInsets.symmetric(horizontal: Sizes.globalPadding),
      child: Column(
        children: [
          CustomTitleOnComponent(
            title: context.l10n.experienceTitle.toUpperCase(),
            gradientLight: AppColor.textGreyGradientLight,
            gradientDark: AppColor.textGreyGradientDark,
          ),
          gapH48,
          const ExperiencesList(),
          gapH48,
        ],
      ),
    );
  }
}
