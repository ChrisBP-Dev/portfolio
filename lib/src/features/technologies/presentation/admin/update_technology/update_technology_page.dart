import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/alert_dialogs.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/core/common_widgets/primary_button.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/common_widgets/title_form_field.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/delete_technology/admin_delete_technology_controller.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/update_technology/admin_update_technology_controller.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/update_technology/widgets/update_technology_button.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/widgets/image_technology_picker.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/widgets/technology_form_field.dart';
import 'package:portfolio/src/localization/l10n.dart';

class AdminUpdateTechnologyPage extends ConsumerStatefulWidget {
  const AdminUpdateTechnologyPage(this.technology, {super.key});
  final Technology technology;

  @override
  ConsumerState<AdminUpdateTechnologyPage> createState() =>
      _AdminUpdateTechnologyPageState();
}

class _AdminUpdateTechnologyPageState
    extends ConsumerState<AdminUpdateTechnologyPage> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _experienceTimeController;

  Technology get technology => widget.technology;
  String get name => _nameController.text;
  String get experienceTime => _experienceTimeController.text;
  String? _image;

  @override
  void initState() {
    _nameController = TextEditingController(text: technology.name);
    _experienceTimeController =
        TextEditingController(text: technology.experienceTime);
    super.initState();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _experienceTimeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;

    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: Text(l10n.update(l10n.technology)),
      scrollable: true,
      actionsAlignment: MainAxisAlignment.center,
      actionsOverflowButtonSpacing: 15,
      content: ResponsiveCenter(
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TitleFormField(title: l10n.mainImageTitle),
              gapH14,
              ImageTechnologyPicker(
                imageCharCode: technology.imageCharCode,
                newImage: (image) {
                  _image = image;
                },
              ),
              gapH14,
              TitleFormField(title: l10n.nameLabel),
              TechnologyFormField(
                controller: _nameController,
                formType: TechnologyFormType.name,
              ),
              gapH14,
              TitleFormField(title: l10n.experienceTime),
              TechnologyFormField(
                controller: _experienceTimeController,
                formType: TechnologyFormType.experienceTime,
              ),
              gapH20,
            ],
          ),
        ),
      ),
      actions: [
        UpdateTechnologyButton(
          onTap: () {
            if (!_formKey.currentState!.validate()) return;
            ref
                .read(adminUpdateTechnologyControllerProvider.notifier)
                .updateTechnology(
                  technology.copyWith(
                    imageUrl: _image == null ? technology.imageUrl : _image!,
                    name: name,
                    experienceTime: experienceTime,
                  ),
                )
                .whenComplete(() {
              if (!context.mounted) return;
              Navigator.of(context).pop();
            }).onError((error, stackTrace) {
              if (!context.mounted) return;
              showExceptionAlertDialog(
                context: context,
                title: '$error',
                exception: error,
              );
            });
          },
        ),
        AsyncValueWidget(
          value: ref.watch(adminDeleteTechnologyControllerProvider),
          data: (data) {
            return PrimaryButton(
              text: l10n.delete(l10n.technology),
              onTap: () {
                ref
                    .read(adminDeleteTechnologyControllerProvider.notifier)
                    .deleteTechnology(technology)
                    .whenComplete(() {
                  if (!context.mounted) return;
                  Navigator.of(context).pop();
                }).onError((error, stackTrace) {
                  if (!context.mounted) return;
                  showExceptionAlertDialog(
                    context: context,
                    title: '$error',
                    exception: error,
                  );
                });
              },
            );
          },
        ),
      ],
    );
  }
}
