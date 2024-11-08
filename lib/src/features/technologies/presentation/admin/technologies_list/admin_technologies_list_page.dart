import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_components/admin_wrap_list.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/features/technologies/domain/admin_technology_repository.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/create_technology/admin_create_technology_page.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/technologies_list/admin_technologies_list.dart';
import 'package:portfolio/src/localization/l10n.dart';

class AdminTechnologiesListPage extends ConsumerWidget {
  const AdminTechnologiesListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    return AsyncValueWidget(
      value: ref.watch(getAdminTechnologiesProvider),
      data: (technologies) {
        return AdminWrapList(
          title: l10n.create(l10n.technology),
          listWidget: AdminTechnologiesList(technologies: technologies),
          onCreateTap: () {
            showDialog<void>(
              context: context,
              builder: (context) => const AdminCreateTechnologyPage(),
            );
          },
        );
      },
    );
  }
}
