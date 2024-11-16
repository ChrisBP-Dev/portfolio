import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/core/common_widgets/primary_button.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/common_widgets/title_form_field.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/string_extensions.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/projects/presentation/admin/create_project/admin_create_project_controller.dart';
import 'package:portfolio/src/features/projects/presentation/admin/create_project/widgets/create_project_button.dart';
import 'package:portfolio/src/features/projects/presentation/admin/create_project/widgets/features_project_list.dart';
import 'package:portfolio/src/features/projects/presentation/admin/create_project/widgets/images_list_project.dart';
import 'package:portfolio/src/features/projects/presentation/admin/delete_project/admin_delete_project_controller.dart';
import 'package:portfolio/src/features/projects/presentation/admin/update_project/admin_update_project_controller.dart';
import 'package:portfolio/src/features/projects/presentation/admin/update_project/widgets/update_project_button.dart';
import 'package:portfolio/src/features/projects/presentation/admin/widgets/main_image_project_picker.dart';
import 'package:portfolio/src/features/projects/presentation/admin/widgets/project_form_field.dart';
import 'package:portfolio/src/features/technologies/domain/admin_technology_repository.dart';
import 'package:portfolio/src/localization/l10n.dart';

class AdminUpdateProjectPage extends ConsumerStatefulWidget {
  const AdminUpdateProjectPage({this.project, super.key});
  final Project? project;

  @override
  ConsumerState<AdminUpdateProjectPage> createState() =>
      _AdminCreateProjectPageState();
}

class _AdminCreateProjectPageState
    extends ConsumerState<AdminUpdateProjectPage> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController companyNameEN;
  late TextEditingController companyNameES;
  late TextEditingController shortDescriptionEN;
  late TextEditingController shortDescriptionES;
  late TextEditingController websiteUrl;
  late TextEditingController sourceUrl;
  late String? _mainImage;
  late List<String> _featuresEN;
  late List<String> _featuresES;
  late final List<String> _technologies;
  late final List<String> _screenshots;

  Project? get oldProject => widget.project;

  @override
  void initState() {
    super.initState();
    companyNameEN = TextEditingController(text: oldProject?.companyNameEn);
    companyNameES = TextEditingController(text: oldProject?.companyNameEs);
    shortDescriptionEN =
        TextEditingController(text: oldProject?.shortDescriptionEn);
    shortDescriptionES =
        TextEditingController(text: oldProject?.shortDescriptionEs);
    websiteUrl = TextEditingController(text: oldProject?.websiteUrl);
    sourceUrl = TextEditingController(text: oldProject?.sourceCodeUrl);
    _mainImage = oldProject?.mainImageUrl;
    _screenshots = [...oldProject?.screenshotsUrls ?? [], ''];
    _featuresEN = oldProject?.featuresEN ?? [];
    _featuresES = oldProject?.featuresES ?? [];
    _technologies = oldProject?.technologies ?? [];
  }

  @override
  void dispose() {
    companyNameEN.dispose();
    companyNameES.dispose();
    shortDescriptionEN.dispose();
    shortDescriptionES.dispose();
    websiteUrl.dispose();
    sourceUrl.dispose();
    super.dispose();
  }

  void _onFeaturesENChanged(List<String> features) {
    setState(() => _featuresEN = features);
  }

  void _onFeaturesESChanged(List<String> features) {
    setState(() => _featuresES = features);
  }

  bool get asCreating => oldProject == null;

  Project get currentProject => Project(
        id: oldProject?.id ?? '',
        mainImageUrl: _mainImage ?? '',
        companyNameEn: companyNameEN.text,
        companyNameEs: companyNameES.text,
        shortDescriptionEn: shortDescriptionEN.text,
        shortDescriptionEs: shortDescriptionES.text,
        websiteUrl: websiteUrl.text,
        sourceCodeUrl: sourceUrl.text,
        featuresEN: _featuresEN,
        featuresES: _featuresES,
        technologies: _technologies,
        screenshotsUrls:
            _screenshots.where((screenshot) => screenshot.isNotEmpty).toList(),
      );

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: Text(
        asCreating ? l10n.create(l10n.project) : l10n.update(l10n.project),
      ),
      scrollable: true,
      actionsAlignment: MainAxisAlignment.center,
      actionsOverflowButtonSpacing: 15,
      content: ResponsiveCenter(
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TitleFormField(title: l10n.mainImageTitle),
              gapH14,
              MainImageProjectPicker(
                imageCharCode: _mainImage?.charCode,
                newImage: (newImage) => _mainImage = newImage,
              ),
              gapH14,
              TitleFormField(title: '${l10n.companyName} (EN)'),
              ProjectFormField(
                controller: companyNameEN,
                formType: ProjectFormType.companyName,
              ),
              gapH14,
              TitleFormField(title: '${l10n.companyName} (ES)'),
              ProjectFormField(
                controller: companyNameES,
                formType: ProjectFormType.companyName,
              ),
              gapH14,
              TitleFormField(title: '${l10n.shortDescription} (EN)'),
              ProjectFormField(
                controller: shortDescriptionEN,
                formType: ProjectFormType.shortDescription,
                maxLines: 3,
              ),
              gapH14,
              TitleFormField(title: '${l10n.shortDescription} (ES)'),
              ProjectFormField(
                controller: shortDescriptionES,
                formType: ProjectFormType.shortDescription,
                maxLines: 3,
              ),
              gapH14,
              TitleFormField(title: l10n.technologiesTitle),
              DecoratedBox(
                decoration: BoxDecoration(
                  border: Border.all(
                    color: context.getPrimaryColor(),
                    width: 2,
                  ),
                  borderRadius: BorderRadius.circular(Sizes.p4),
                ),
                child: SizedBox(
                  width: double.infinity,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      vertical: Sizes.globalPadding,
                    ),
                    child: AsyncValueWidget(
                      value: ref.watch(getAdminTechnologiesProvider),
                      data: (technologies) {
                        return Wrap(
                          children: technologies.map(
                            (technology) {
                              return Container(
                                width: 240,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(Sizes.p4),
                                  border: Border.all(
                                    color: context.getPrimaryColor(),
                                  ),
                                ),
                                margin: const EdgeInsets.all(Sizes.p8),
                                child: CheckboxListTile.adaptive(
                                  contentPadding: const EdgeInsets.only(
                                    left: Sizes.p8,
                                  ),
                                  value: _technologies.contains(technology.id),
                                  onChanged: (isSelected) {
                                    if (isSelected ?? true) {
                                      _technologies.add(technology.id);
                                    } else {
                                      _technologies.remove(technology.id);
                                    }
                                    setState(() {});
                                  },
                                  selected:
                                      _technologies.contains(technology.name),
                                  title: Text(technology.name),
                                ),
                              );
                            },
                          ).toList(),
                        );
                      },
                    ),
                  ),
                ),
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
                controller: websiteUrl,
                formType: ProjectFormType.websiteUrl,
              ),
              gapH14,
              TitleFormField(title: l10n.sourceCodeTitle),
              ProjectFormField(
                controller: sourceUrl,
                formType: ProjectFormType.sourceCodeUrl,
              ),
              gapH14,
              TitleFormField(title: l10n.screenshotsTitle),
              ImagesListProject(
                screenshots: _screenshots,
                onImageAdded: (image, index) {
                  _screenshots
                    ..removeAt(index)
                    ..add(image);
                  final isLast = index == _screenshots.length - 1;
                  if (isLast) {
                    _screenshots.add('');
                  }
                  setState(() {});
                },
                deleteTap: (image) {
                  _screenshots.remove(image);
                  setState(() {});
                },
              ),
              gapH20,
            ],
          ),
        ),
      ),
      actions: [
        if (widget.project != null) ...[
          UpdateProjectButton(
            onTap: () {
              if (_formKey.currentState!.validate()) {
                if (currentProject != oldProject) {
                  ref
                      .read(adminUpdateProjectControllerProvider.notifier)
                      .updateProject(oldProject!, currentProject)
                      .whenComplete(() {
                    if (!context.mounted) return;
                    // Navigator.of(context).pop();
                  });
                }
              }
            },
          ),
          AsyncValueWidget(
            value: ref.watch(adminDeleteProjectControllerProvider),
            data: (data) {
              return PrimaryButton(
                text: l10n.delete(l10n.project),
                onTap: () {
                  ref
                      .read(adminDeleteProjectControllerProvider.notifier)
                      .deleteProject(widget.project!)
                      .whenComplete(() {
                    if (!context.mounted) return;
                    // Navigator.of(context).pop();
                  }).onError((error, stackTrace) {
                    if (!context.mounted) return;
                  });
                },
              );
            },
          ),
        ],
        if (widget.project == null)
          CreateProjectButton(
            onTap: () {
              if (!_formKey.currentState!.validate()) return;
              ref
                  .read(adminCreateProjectControllerProvider.notifier)
                  .createProject(
                    currentProject,
                  )
                  .whenComplete(() {
                if (!context.mounted) return;
                Navigator.of(context).pop();
              });
            },
          ),
      ],
    );
  }
}
