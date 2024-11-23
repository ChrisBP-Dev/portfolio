import 'package:flutter/material.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/projects/presentation/components/project_content.dart';

class ProjectCard extends StatelessWidget {
  const ProjectCard({
    required this.project,
    this.width,
    super.key,
  });

  final Project project;
  final double? width;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      child: DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(Sizes.p8),
          border: Border.all(color: context.theme.dividerColor),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(Sizes.p8),
          child: Padding(
            padding: const EdgeInsets.all(Sizes.globalPadding),
            child: ProjectContent(project: project),
          ),
        ),
      ),
    );
  }
}
