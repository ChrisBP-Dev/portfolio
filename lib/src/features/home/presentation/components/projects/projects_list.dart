import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/constants/app_sizes.dart';
import 'package:portfolio/src/features/home/presentation/components/projects/project_card.dart';
import 'package:portfolio/src/features/projects/data/firebase_projects_repository.dart';
import 'package:portfolio/src/routing/app_route.dart';

class ProjectsList extends ConsumerWidget {
  const ProjectsList({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AsyncValueWidget(
      value: ref.watch(getProjectsStreamProvider),
      data: (projects) {
        final homeProjects = projects.take(3).toList();
        return Wrap(
          alignment: WrapAlignment.center,
          runSpacing: Sizes.globalPadding,
          spacing: Sizes.globalPadding,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: homeProjects
              .map(
                (project) => ProjectCard(
                  project: project,
                  onTap: () => context.goNamed(AppRoute.projects.name),
                ),
              )
              .toList(),
        );
      },
    );
  }
}
