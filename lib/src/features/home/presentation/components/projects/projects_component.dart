import 'package:flutter/material.dart';
import 'package:portfolio/src/common_widgets/custom_title_on_component.dart';
import 'package:portfolio/src/common_widgets/responsive_center.dart';
import 'package:portfolio/src/common_widgets/secondary_button.dart';
import 'package:portfolio/src/constants/app_sizes.dart';
import 'package:portfolio/src/features/home/presentation/components/projects/projects_list.dart';
import 'package:portfolio/src/localization/l10n.dart';
import 'package:portfolio/src/utils/theme/color_app.dart';

class ProjectsComponent extends StatelessWidget {
  const ProjectsComponent({super.key});

  @override
  Widget build(BuildContext context) {
    return ResponsiveCenter(
      padding: const EdgeInsets.symmetric(horizontal: Sizes.globalPadding),
      child: Column(
        children: [
          CustomTitleOnComponent(
            title: context.l10n.projectsTitle,
            gradientLight: AppColor.textBusinessGradient,
            gradientDark: AppColor.textBusinessGradient,
          ),
          gapH48,
          const ProjectsList(),
          gapH20,
          SecondaryButton(
            title: 'See All',
            onTap: () {},
          ),
          gapH72,
        ],
      ),
    );
  }
}
