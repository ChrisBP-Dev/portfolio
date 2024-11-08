import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/constants/breakpoints.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/projects/presentation/components/full_project_card.dart';

class AdminProjectList extends StatelessWidget {
  const AdminProjectList({required this.projects, super.key});
  final List<Project> projects;

  @override
  Widget build(BuildContext context) {
    return ResponsiveCenter(
      padding: const EdgeInsets.all(Sizes.globalPadding),
      child: LayoutBuilder(
        builder: (context, constraints) {
          final isMobile = constraints.maxWidth < Breakpoint.tablet;
          final width = isMobile
              ? constraints.maxWidth
              : (constraints.maxWidth / 2) - (Sizes.globalPadding / 2);

          return Wrap(
            runSpacing: Sizes.globalPadding,
            spacing: Sizes.globalPadding,
            children: projects
                .map(
                  (project) => InkWell(
                    onTap: () {
                      // TODO(me): Implement navigation to update projects page
                    },
                    child: IgnorePointer(
                      child: FullProjectCard(
                        project: project,
                        width: width,
                      ),
                    ),
                  ),
                )
                .toList(),
          );
        },
      ),
    );
  }
}
