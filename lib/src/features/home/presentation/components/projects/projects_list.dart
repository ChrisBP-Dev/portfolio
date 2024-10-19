import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/constants/app_sizes.dart';

import 'package:portfolio/src/constants/projects.dart';
import 'package:portfolio/src/features/home/presentation/components/projects/project_card.dart';
import 'package:portfolio/src/routing/app_route.dart';

class ProjectsList extends StatelessWidget {
  const ProjectsList({super.key});

  @override
  Widget build(BuildContext context) {
    return Wrap(
      alignment: WrapAlignment.center,
      runSpacing: Sizes.globalPadding,
      spacing: Sizes.globalPadding,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: kProjects
          .map(
            (project) => ProjectCard(
              project: project,
              onTap: () => context.goNamed(AppRoute.projects.name),
            ),
          )
          .toList(),
    );
  }
}
