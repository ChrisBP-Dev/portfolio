import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/core/common_widgets/primary_button.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/controllers/admin_update_technology_controller.dart';
import 'package:portfolio/src/localization/l10n.dart';

class UpdateTechnologyButton extends ConsumerWidget {
  const UpdateTechnologyButton({
    this.onTap,
    super.key,
  });
  final void Function()? onTap;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;

    return AsyncValueWidget(
      value: ref.watch(adminUpdateTechnologyControllerProvider),
      data: (data) {
        return PrimaryButton(
          text: l10n.update(l10n.technology),
          onTap: onTap,
        );
      },
    );
  }
}
