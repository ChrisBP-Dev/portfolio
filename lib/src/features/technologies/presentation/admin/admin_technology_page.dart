import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/admin_dialog.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/core/common_widgets/primary_button.dart';
import 'package:portfolio/src/core/common_widgets/title_form_field.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/features/projects/domain/screenshot_image.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/controllers/admin_create_technology_controller.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/controllers/admin_delete_technology_controller.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/controllers/admin_update_technology_controller.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/widgets/create_technology_button.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/widgets/image_technology_picker.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/widgets/technology_form_field.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/widgets/update_technology_button.dart';
import 'package:portfolio/src/localization/l10n.dart';

class AdminTechnologyPage extends ConsumerStatefulWidget {
  const AdminTechnologyPage({this.technology, super.key});
  final Technology? technology;

  @override
  ConsumerState<AdminTechnologyPage> createState() =>
      _AdminUpdateTechnologyPageState();
}

class _AdminUpdateTechnologyPageState
    extends ConsumerState<AdminTechnologyPage> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _experienceTimeController;
  late ImageAndPath _image;

  Technology? get oldTechnology => widget.technology;
  String get name => _nameController.text;
  String get experienceTime => _experienceTimeController.text;
  bool get asCreating => oldTechnology == null;

  @override
  void initState() {
    _image = oldTechnology?.image ?? const ImageAndPath();
    _nameController = TextEditingController(text: oldTechnology?.name);
    _experienceTimeController =
        TextEditingController(text: oldTechnology?.experienceTime);
    super.initState();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _experienceTimeController.dispose();
    super.dispose();
  }

  Technology get currentTechnology => Technology(
        id: oldTechnology?.id ?? '',
        image: _image,
        name: name,
        experienceTime: experienceTime,
      );

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;

    return AdminDialog(
      asCreating: asCreating,
      title: l10n.technology,
      formKey: _formKey,
      contentWidgets: [
        TitleFormField(title: l10n.mainImageTitle),
        gapH14,
        ImageTechnologyPicker(
          image: _image,
          newImage: (image) => _image = _image.copyWith(localImage: image),
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
      createButton: CreateTechnologyButton(
        onTap: () {
          if (!_formKey.currentState!.validate()) return;
          ref
              .read(adminCreateTechnologyControllerProvider.notifier)
              .createTechnology(currentTechnology)
              .whenComplete(() {
            if (!context.mounted) return;
            Navigator.of(context).pop();
          });
        },
      ),
      updateButton: UpdateTechnologyButton(
        onTap: () {
          if (!_formKey.currentState!.validate()) return;
          ref
              .read(adminUpdateTechnologyControllerProvider.notifier)
              .updateTechnology(currentTechnology)
              .whenComplete(() {
            if (!context.mounted) return;
            Navigator.of(context).pop();
          });
        },
      ),
      deleteButton: AsyncValueWidget(
        value: ref.watch(adminDeleteTechnologyControllerProvider),
        data: (data) {
          return PrimaryButton(
            title: l10n.delete(l10n.technology),
            onTap: () {
              ref
                  .read(adminDeleteTechnologyControllerProvider.notifier)
                  .deleteTechnology(oldTechnology!)
                  .whenComplete(() {
                if (!context.mounted) return;
                Navigator.of(context).pop();
              });
            },
          );
        },
      ),
    );
  }
}
