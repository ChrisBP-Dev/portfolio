import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/core/common_widgets/wrapper_scroll.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/features/projects/data/firebase_projects_repository.dart';
import 'package:portfolio/src/features/projects/presentation/components/project_card_full.dart';
import 'package:portfolio/src/features/projects/presentation/components/project_description.dart';

class ProjectsPage extends ConsumerWidget {
  const ProjectsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AsyncValueWidget(
      value: ref.watch(getProjectsStreamProvider),
      data: (projects) {
        return WrapperScroll(
          key: const PageStorageKey('ProjectPage'),
          components: [
            const ProjectDescription(),
            ...projects.map((project) => ProjectCardFull(project: project)),

            // CreateProjectsButton(),
            gapH48,
          ],
        );
      },
    );
  }
}
