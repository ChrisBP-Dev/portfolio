import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/admin_dialog.dart';
import 'package:portfolio/src/core/common_widgets/title_form_field.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/string_extensions.dart';
import 'package:portfolio/src/features/projects/domain/image_and_path.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/projects/presentation/admin/controllers/admin_create_project_controller.dart';
import 'package:portfolio/src/features/projects/presentation/admin/controllers/admin_delete_project_controller.dart';
import 'package:portfolio/src/features/projects/presentation/admin/controllers/admin_update_project_controller.dart';
import 'package:portfolio/src/features/projects/presentation/admin/widgets/create_project_button.dart';
import 'package:portfolio/src/features/projects/presentation/admin/widgets/delete_project_button.dart';
import 'package:portfolio/src/features/projects/presentation/admin/widgets/features_project_list.dart';
import 'package:portfolio/src/features/projects/presentation/admin/widgets/images_list_project.dart';
import 'package:portfolio/src/features/projects/presentation/admin/widgets/main_image_project_picker.dart';
import 'package:portfolio/src/features/projects/presentation/admin/widgets/project_form_field.dart';
import 'package:portfolio/src/features/projects/presentation/admin/widgets/technologies_checklists.dart';
import 'package:portfolio/src/features/projects/presentation/admin/widgets/update_project_button.dart';
import 'package:portfolio/src/localization/l10n.dart';

class AdminProjectPage extends ConsumerStatefulWidget {
  const AdminProjectPage({this.project, super.key});
  final Project? project;

  @override
  ConsumerState<AdminProjectPage> createState() =>
      _AdminCreateProjectPageState();
}

class _AdminCreateProjectPageState extends ConsumerState<AdminProjectPage> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController companyNameENController;
  late TextEditingController companyNameESController;
  late TextEditingController shortDescriptionENController;
  late TextEditingController shortDescriptionESController;
  late TextEditingController websiteUrlController;
  late TextEditingController sourceCodeUrlController;
  late ImageAndPath _mainImage;
  late final List<ImageAndPath> _screenshots;
  late List<String> _featuresEN;
  late List<String> _featuresES;
  late final List<String> _technologies;

  Project? get oldProject => widget.project;

  @override
  void initState() {
    _mainImage = oldProject?.mainImage ?? const ImageAndPath();
    companyNameENController =
        TextEditingController(text: oldProject?.companyNameEn);
    companyNameESController =
        TextEditingController(text: oldProject?.companyNameEs);
    shortDescriptionENController =
        TextEditingController(text: oldProject?.shortDescriptionEn);
    shortDescriptionESController =
        TextEditingController(text: oldProject?.shortDescriptionEs);
    websiteUrlController = TextEditingController(text: oldProject?.websiteUrl);
    sourceCodeUrlController =
        TextEditingController(text: oldProject?.sourceCodeUrl);
    _screenshots = [
      ...oldProject?.screenshots ?? [],
      const ImageAndPath(),
    ];
    _featuresEN = List.from(oldProject?.featuresEN ?? []);
    _featuresES = List.from(oldProject?.featuresES ?? []);
    _technologies = List.from(oldProject?.technologies ?? []);
    super.initState();
  }

  @override
  void dispose() {
    companyNameENController.dispose();
    companyNameESController.dispose();
    shortDescriptionENController.dispose();
    shortDescriptionESController.dispose();
    websiteUrlController.dispose();
    sourceCodeUrlController.dispose();
    super.dispose();
  }

  void _onFeaturesENChanged(List<String> features) {
    setState(() => _featuresEN = features);
  }

  void _onFeaturesESChanged(List<String> features) {
    setState(() => _featuresES = features);
  }

  bool get asCreating => oldProject == null;
  String? get websiteUrl => websiteUrlController.text.asNullIfEmpty;
  String? get sourceCodeUrl => sourceCodeUrlController.text.asNullIfEmpty;

  Project get currentProject => Project(
        id: oldProject?.id ?? '',
        mainImage: _mainImage,
        companyNameEn: companyNameENController.text,
        companyNameEs: companyNameESController.text,
        shortDescriptionEn: shortDescriptionENController.text,
        shortDescriptionEs: shortDescriptionESController.text,
        websiteUrl: websiteUrl,
        sourceCodeUrl: sourceCodeUrl,
        featuresEN: _featuresEN,
        featuresES: _featuresES,
        technologies: _technologies,
        screenshots: _screenshots
            .where(
              (screenshot) => asCreating
                  ? screenshot.hasLocalImage
                  : screenshot.hasRefImage || screenshot.hasLocalImage,
            )
            .toList(),
      );

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    _screenshots.sort((a, b) => a.hasLocalImage ? -1 : -1);
    return AdminDialog(
      asCreating: asCreating,
      title: l10n.project,
      formKey: _formKey,
      contentWidgets: [
        TitleFormField(title: l10n.mainImageTitle),
        gapH14,
        MainImageProjectPicker(
          image: _mainImage,
          newImage: (newImage) => _mainImage = _mainImage.copyWith(
            localImage: newImage,
          ),
        ),
        gapH14,
        TitleFormField(title: '${l10n.companyName} (EN)'),
        ProjectFormField(
          controller: companyNameENController,
          formType: ProjectFormType.companyName,
        ),
        gapH14,
        TitleFormField(title: '${l10n.companyName} (ES)'),
        ProjectFormField(
          controller: companyNameESController,
          formType: ProjectFormType.companyName,
        ),
        gapH14,
        TitleFormField(title: '${l10n.shortDescription} (EN)'),
        ProjectFormField(
          controller: shortDescriptionENController,
          formType: ProjectFormType.shortDescription,
          maxLines: 3,
        ),
        gapH14,
        TitleFormField(title: '${l10n.shortDescription} (ES)'),
        ProjectFormField(
          controller: shortDescriptionESController,
          formType: ProjectFormType.shortDescription,
          maxLines: 3,
        ),
        gapH14,
        TitleFormField(title: l10n.technologiesTitle),
        TechnologiesChecklists(
          isSelected: _technologies.contains,
          onChanged: (isSelected, id) {
            if (isSelected == true) {
              _technologies.add(id);
            } else {
              _technologies.remove(id);
            }
            setState(() {});
          },
        ),
        gapH14,
        FeaturesProjectList(
          initialFeatures: _featuresEN,
          localeCode: 'EN',
          onFeaturesChanged: _onFeaturesENChanged,
        ),
        const Divider(),
        gapH14,
        FeaturesProjectList(
          initialFeatures: _featuresES,
          localeCode: 'ES',
          onFeaturesChanged: _onFeaturesESChanged,
        ),
        gapH14,
        const Divider(),
        TitleFormField(title: l10n.websiteTitle),
        ProjectFormField(
          controller: websiteUrlController,
          formType: ProjectFormType.websiteUrl,
        ),
        gapH14,
        TitleFormField(title: l10n.sourceCodeTitle),
        ProjectFormField(
          controller: sourceCodeUrlController,
          formType: ProjectFormType.sourceCodeUrl,
        ),
        gapH14,
        TitleFormField(title: l10n.screenshotsTitle),
        ImagesListProject(
          screenshots: _screenshots,
          onImageAdded: (screenShotImage, index) {
            _screenshots[index] = ImageAndPath(
              localImage: screenShotImage.localImage,
              refPath: _screenshots[index].refPath,
            );

            final isLast = index == _screenshots.length - 1;
            if (isLast) {
              _screenshots.add(const ImageAndPath());
            }
            setState(() {});
          },
          deleteTap: (index) {
            _screenshots[index] = ImageAndPath(
              refPath: _screenshots[index].refPath,
            );
            setState(() {});
          },
        ),
        gapH20,
      ],
      createButton: CreateProjectButton(
        onTap: () {
          if (!_formKey.currentState!.validate()) return;
          ref
              .read(adminCreateProjectControllerProvider.notifier)
              .createProject(currentProject);
        },
      ),
      updateButton: UpdateProjectButton(
        onTap: () {
          if (_formKey.currentState!.validate()) {
            if (currentProject != oldProject) {
              ref
                  .read(adminUpdateProjectControllerProvider.notifier)
                  .updateProject(currentProject);
            }
          }
        },
      ),
      deleteButton: DeleteProjectButton(
        onTap: () {
          ref
              .read(adminDeleteProjectControllerProvider.notifier)
              .deleteProject(oldProject!);
        },
      ),
    );
  }
}
