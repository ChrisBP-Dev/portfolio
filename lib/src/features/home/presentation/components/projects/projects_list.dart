import 'package:flutter/material.dart';
import 'package:portfolio/src/constants/app_sizes.dart';

import 'package:portfolio/src/constants/projects.dart';
import 'package:portfolio/src/features/home/presentation/components/projects/project_card.dart';

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
              onTap: () {},
            ),
          )
          .toList(),
    );
  }
}
