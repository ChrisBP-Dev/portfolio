import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';
import 'package:portfolio/src/localization/l10n.dart';

class ProjectDescription extends StatelessWidget {
  const ProjectDescription({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;

    return ResponsiveCenter(
      padding: const EdgeInsets.all(Sizes.globalPadding),
      child: Text(
        l10n.projectDescription,
        style: context.bodyLarge,
      ),
    );
  }
}
