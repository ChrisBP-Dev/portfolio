import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/common_widgets/title_form_field.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/features/projects/presentation/admin/create_project/admin_create_project_form_controller.dart';
import 'package:portfolio/src/features/projects/presentation/admin/create_project/widgets/create_project_button.dart';
import 'package:portfolio/src/features/projects/presentation/admin/create_project/widgets/features_project_list.dart';
import 'package:portfolio/src/features/projects/presentation/admin/create_project/widgets/images_list_project.dart';
import 'package:portfolio/src/features/projects/presentation/admin/create_project/widgets/main_image_project.dart';
import 'package:portfolio/src/features/projects/presentation/admin/widgets/project_form_field.dart';
import 'package:portfolio/src/localization/l10n.dart';

class AdminCreateProjectPage extends ConsumerWidget {
  const AdminCreateProjectPage({super.key});

  static final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final project = ref.watch(adminCreateProjectFormControllerProvider);
    final l10n = context.l10n;
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: Text(l10n.create(l10n.project)),
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
              const MainImageProject(),
              gapH14,
              TitleFormField(title: '${l10n.companyName} (EN)'),
              ProjectFormField(
                formType: ProjectFormType.companyName,
                onChanged: (newValue) {
                  ref
                      .read(adminCreateProjectFormControllerProvider.notifier)
                      .setCompanyNameEn(newValue);
                },
              ),
              gapH14,
              TitleFormField(title: '${l10n.companyName} (ES)'),
              ProjectFormField(
                formType: ProjectFormType.companyName,
                onChanged: (newValue) {
                  ref
                      .read(adminCreateProjectFormControllerProvider.notifier)
                      .setCompanyNameEs(newValue);
                },
              ),
              gapH14,
              TitleFormField(title: '${l10n.shortDescription} (EN)'),
              ProjectFormField(
                formType: ProjectFormType.shortDescription,
                maxLines: 3,
                onChanged: (newValue) {
                  ref
                      .read(adminCreateProjectFormControllerProvider.notifier)
                      .setShortDescriptionEn(newValue);
                },
              ),
              gapH14,
              TitleFormField(title: '${l10n.shortDescription} (ES)'),
              ProjectFormField(
                formType: ProjectFormType.shortDescription,
                maxLines: 3,
                onChanged: (newValue) {
                  ref
                      .read(adminCreateProjectFormControllerProvider.notifier)
                      .setShortDescriptionEs(newValue);
                },
              ),
              gapH14,
              TitleFormField(title: l10n.technologiesTitle),
              // TODO(me): Add Technologies implementation
              const Divider(),
              gapH14,
              FeaturesProjectList(
                localeCode: 'EN',
                featuresList: project.featuresEn,
                addTap: ref
                    .read(
                      adminCreateProjectFormControllerProvider.notifier,
                    )
                    .addFeatureEn,
                removeTap: ref
                    .read(
                      adminCreateProjectFormControllerProvider.notifier,
                    )
                    .removeFeatureEn,
              ),
              FeaturesProjectList(
                localeCode: 'ES',
                featuresList: project.featuresEs,
                addTap: ref
                    .read(
                      adminCreateProjectFormControllerProvider.notifier,
                    )
                    .addFeatureEs,
                removeTap: ref
                    .read(
                      adminCreateProjectFormControllerProvider.notifier,
                    )
                    .removeFeatureEs,
              ),
              gapH14,
              TitleFormField(title: l10n.websiteTitle),
              ProjectFormField(
                formType: ProjectFormType.websiteUrl,
                onChanged: (newValue) {
                  ref
                      .read(adminCreateProjectFormControllerProvider.notifier)
                      .setWebsiteUrl(newValue);
                },
              ),
              gapH14,
              TitleFormField(title: l10n.sourceCodeTitle),
              ProjectFormField(
                formType: ProjectFormType.sourceCodeUrl,
                onChanged: (newValue) {
                  ref
                      .read(adminCreateProjectFormControllerProvider.notifier)
                      .setSourceCodeUrl(newValue);
                },
              ),
              gapH14,
              TitleFormField(title: l10n.screenshotsTitle),
              const ImagesListProject(),
              gapH20,
            ],
          ),
        ),
      ),
      actions: [
        CreateProjectButton(formKey: _formKey),
      ],
    );
  }
}
