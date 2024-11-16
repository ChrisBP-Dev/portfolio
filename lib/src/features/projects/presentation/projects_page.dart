import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/core/common_widgets/wrapper_scroll.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/projects/domain/projects_repository.dart';
import 'package:portfolio/src/features/projects/presentation/components/filter_dropdown.dart';
import 'package:portfolio/src/features/projects/presentation/components/project_description.dart';
import 'package:portfolio/src/features/projects/presentation/components/projects_list.dart';
import 'package:portfolio/src/localization/l10n.dart';

class ProjectsPage extends ConsumerStatefulWidget {
  const ProjectsPage({super.key});

  @override
  ConsumerState<ProjectsPage> createState() => _ProjectsPageState();
}

class _ProjectsPageState extends ConsumerState<ProjectsPage> {
  FilterType _filterType = FilterType.all;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return AsyncValueWidget(
      value: ref.watch(getProjectsStreamProvider),
      data: (projects) {
        return WrapperScroll(
          key: const PageStorageKey('ProjectPage'),
          components: [
            const ProjectDescription(),
            FilterDropdown(
              filterType: _filterType,
              onSortChanged: (value) {
                if (value == null) return;
                setState(() => _filterType = value);
              },
            ),
            gapH20,
            if (_filterProjects(projects).isEmpty)
              SizedBox(
                height: 400,
                child: Center(
                  child: Text(l10n.noProjects),
                ),
              ),
            ProjectsList(projects: _filterProjects(projects)),
            gapH48,
          ],
        );
      },
    );
  }

  List<Project> _filterProjects(List<Project> projects) {
    return projects.where((project) {
      return switch (_filterType) {
        FilterType.websiteUrl => project.websiteUrl?.isNotEmpty ?? false,
        FilterType.sourceCodeUrl => project.sourceCodeUrl?.isNotEmpty ?? false,
        FilterType.all => true,
      };
    }).toList();
  }
}
