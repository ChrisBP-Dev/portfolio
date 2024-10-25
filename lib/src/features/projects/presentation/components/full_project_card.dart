import 'package:flutter/material.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/projects/presentation/components/project_content.dart';

class FullProjectCard extends StatelessWidget {
  const FullProjectCard({
    required this.project,
    this.width,
    super.key,
  });

  final Project project;
  final double? width;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(Sizes.p8),
        border: Border.all(color: theme.dividerColor),
      ),
      width: width,
      clipBehavior: Clip.antiAlias,
      padding: const EdgeInsets.all(Sizes.globalPadding),
      child: ProjectContent(project: project),
    );
  }
}
