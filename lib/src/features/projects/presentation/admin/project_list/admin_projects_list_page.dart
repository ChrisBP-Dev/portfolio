import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_components/admin/admin_wrap_list.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/features/projects/domain/admin_projects_repository.dart';
import 'package:portfolio/src/features/projects/presentation/admin/project_list/admin_project_list.dart';
import 'package:portfolio/src/features/projects/presentation/admin/update_project/admin_update_project_page.dart';
import 'package:portfolio/src/localization/string_hardcoded.dart';

class AdminProjectsListPage extends ConsumerWidget {
  const AdminProjectsListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AsyncValueWidget(
      value: ref.watch(getAdminProjectsStreamProvider),
      data: (projects) {
        return AdminWrapList(
          title: 'Create Project'.hardcoded,
          listWidget: AdminProjectList(projects: projects),
          onCreateTap: () {
            showDialog<void>(
              context: context,
              builder: (context) => const AdminUpdateProjectPage(),
            );
          },
        );
      },
    );
  }
}
