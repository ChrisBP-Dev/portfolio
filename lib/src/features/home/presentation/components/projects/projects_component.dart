import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/core/common_widgets/custom_title_on_component.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/common_widgets/secondary_button.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/features/home/presentation/components/projects/home_projects_list.dart';
import 'package:portfolio/src/localization/l10n.dart';
import 'package:portfolio/src/routing/app_route.dart';

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
          const HomeProjectsList(),
          gapH20,
          SecondaryButton(
            title: context.l10n.seeAllButtonTitle,
            onTap: () => context.go(AppRoute.projects.path),
          ),
          gapH72,
        ],
      ),
    );
  }
}
