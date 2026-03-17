import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/core/common_widgets/primary_button.dart';
import 'package:portfolio/src/core/utils/async_value_ui.dart';
import 'package:portfolio/src/features/projects/presentation/admin/controllers/admin_delete_project_controller.dart';
import 'package:portfolio/src/localization/l10n.dart';

class DeleteProjectButton extends ConsumerWidget {
  const DeleteProjectButton({required this.onTap, super.key});
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.listen(
      adminDeleteProjectControllerProvider,
      (_, state) => state.showAlertDialogOnError(context),
    );
    final l10n = context.l10n;
    return AsyncValueWidget(
      value: ref.watch(adminDeleteProjectControllerProvider),
      data: (data) {
        return PrimaryButton(
          title: l10n.delete(l10n.project),
          onTap: onTap,
        );
      },
    );
  }
}
