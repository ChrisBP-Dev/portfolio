import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/alert_dialogs.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/common_widgets/title_form_field.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/create_technology/admin_create_technology_controller.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/create_technology/widgets/create_technology_button.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/widgets/image_technology_picker.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/widgets/technology_form_field.dart';
import 'package:portfolio/src/localization/l10n.dart';
import 'package:portfolio/src/localization/string_hardcoded.dart';

class AdminCreateTechnologyPage extends ConsumerStatefulWidget {
  const AdminCreateTechnologyPage({super.key});

  @override
  ConsumerState<AdminCreateTechnologyPage> createState() =>
      _AdminCreateTechnologyPageState();
}

class _AdminCreateTechnologyPageState
    extends ConsumerState<AdminCreateTechnologyPage> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _experienceTimeController;

  String get name => _nameController.text;
  String get experienceTime => _experienceTimeController.text;
  String? _image;

  @override
  void initState() {
    _nameController = TextEditingController();
    _experienceTimeController = TextEditingController();
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
    ref.listen<AdminCreateTechnologyController>(
      adminCreateTechnologyControllerProvider.notifier,
      (prev, next) {
        showExceptionAlertDialog(
          context: context,
          title: 'Error'.hardcoded,
          exception: 'Error al crear la tecnología'.hardcoded,
        );
      },
    );

    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: Text(l10n.create(l10n.technology)),
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
                newImage: (image) => _image = image,
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
        CreateTechnologyButton(
          onTap: () {
            if (!_formKey.currentState!.validate()) return;
            ref
                .read(adminCreateTechnologyControllerProvider.notifier)
                .createTechnology(
                  Technology(
                    imageUrl: _image == null ? '' : _image!,
                    name: name,
                    experienceTime: experienceTime,
                  ),
                );
          },
        ),
      ],
    );
  }
}
