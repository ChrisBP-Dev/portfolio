import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/alert_dialogs.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/core/common_widgets/primary_button.dart';
import 'package:portfolio/src/features/projects/presentation/admin/create_project/admin_create_project_controller.dart';
import 'package:portfolio/src/features/projects/presentation/admin/create_project/admin_create_project_form_controller.dart';
import 'package:portfolio/src/localization/l10n.dart';

class CreateProjectButton extends ConsumerWidget {
  const CreateProjectButton({required this.formKey, super.key});
  final GlobalKey<FormState> formKey;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    final project = ref.watch(adminCreateProjectFormControllerProvider);
    return AsyncValueWidget(
      value: ref.watch(adminCreateProjectControllerProvider),
      data: (data) {
        return PrimaryButton(
          text: l10n.create(l10n.project),
          onTap: () {
            if (!formKey.currentState!.validate()) return;
            ref
                .read(adminCreateProjectControllerProvider.notifier)
                .createProject(
                  project.copyWith(
                    imagesUrls:
                        project.imagesUrls.where((e) => e.isNotEmpty).toList(),
                  ),
                )
                .whenComplete(() {
              if (!context.mounted) return;
              Navigator.of(context).pop();
            }).onError((error, stackTrace) {
              if (!context.mounted) return;
              showExceptionAlertDialog(
                context: context,
                title: l10n.error,
                exception: error,
              );
            });
          },
        );
      },
    );
  }
}
