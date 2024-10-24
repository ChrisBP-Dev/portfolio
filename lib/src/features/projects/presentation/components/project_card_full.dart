import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/projects/presentation/components/project_content.dart';

class ProjectCardFull extends StatelessWidget {
  const ProjectCardFull({
    required this.project,
    super.key,
  });

  final Project project;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return ResponsiveCenter(
      padding: const EdgeInsets.all(Sizes.globalPadding),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(Sizes.p8),
          border: Border.all(color: theme.dividerColor),
        ),
        clipBehavior: Clip.antiAlias,
        padding: const EdgeInsets.all(Sizes.globalPadding),
        child: ProjectContent(project: project),
      ),
    );
  }
}
