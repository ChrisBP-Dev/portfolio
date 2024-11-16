import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_components/admin/admin_wrap_list.dart';
import 'package:portfolio/src/localization/l10n.dart';

class AdminExperiencesListPage extends ConsumerWidget {
  const AdminExperiencesListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    return AdminWrapList(
      title: l10n.create(l10n.experienceTitle),
      listWidget: const SizedBox(),
      onCreateTap: () {},
    );
  }
}
