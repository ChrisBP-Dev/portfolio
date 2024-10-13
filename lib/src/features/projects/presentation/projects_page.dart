import 'package:flutter/material.dart';
import 'package:portfolio/src/common_widgets/wrapper_scroll.dart';
import 'package:portfolio/src/constants/app_sizes.dart';
import 'package:portfolio/src/constants/projects.dart';
import 'package:portfolio/src/features/projects/presentation/components/project_card_full.dart';
import 'package:portfolio/src/features/projects/presentation/components/project_description.dart';

class ProjectsPage extends StatelessWidget {
  const ProjectsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return WrapperScroll(
      key: const PageStorageKey('ProjectPage'),
      components: [
        const ProjectDescription(),
        ...kProjects.map((project) => ProjectCardFull(project: project)),
        gapH48,
      ],
    );
  }
}
