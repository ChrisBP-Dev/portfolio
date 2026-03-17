import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_components/admin/admin_wrap_list.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/features/projects/domain/admin_projects_repository.dart';
import 'package:portfolio/src/features/projects/presentation/admin/admin_project_list.dart';
import 'package:portfolio/src/features/projects/presentation/admin/admin_project_page.dart';
import 'package:portfolio/src/localization/l10n.dart';

class AdminProjectsListPage extends ConsumerWidget {
  const AdminProjectsListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    return AdminWrapList(
      title: l10n.create(l10n.project),
      listWidget: AsyncValueWidget(
        value: ref.watch(getAdminProjectsStreamProvider),
        data: (projects) => AdminProjectList(projects: projects),
      ),
      onCreateTap: () {
        showDialog<void>(
          context: context,
          builder: (context) => const AdminProjectPage(),
        );
      },
    );
  }
}
