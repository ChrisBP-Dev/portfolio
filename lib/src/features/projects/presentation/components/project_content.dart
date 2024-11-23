import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/core/common_widgets/technology_icon.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/projects/presentation/components/project_images_list.dart';
import 'package:portfolio/src/features/settings/presentation/locale_controller.dart';
import 'package:portfolio/src/features/social_launcher/presentation/social_launcher_controller.dart';
import 'package:portfolio/src/features/technologies/domain/technology_repository.dart';
import 'package:portfolio/src/localization/l10n.dart';

class ProjectContent extends ConsumerWidget {
  const ProjectContent({required this.project, super.key});

  final Project project;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;

    return AsyncValueWidget(
      value: ref.watch(localeControllerProvider),
      data: (locale) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            project.companyName(locale.languageCode),
            style: context.headlineSmall,
          ),
          gapH14,
          Text(
            project.shortDescription(locale.languageCode),
            style: context.bodyMedium,
          ),
          gapH14,
          if (project.hasWebsite) ...[
            Text(
              l10n.websiteTitle,
              style: context.bodyMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
            gapH2,
            TextButton(
              onPressed: () => ref
                  .read(socialLauncherControllerProvider.notifier)
                  .launchAnyLink(project.websiteUrl!),
              child: Text(
                project.websiteUrl!,
                style: context.bodyMedium?.copyWith(color: Colors.blue),
              ),
            ),
            gapH14,
          ],
          if (project.hasSourceCode) ...[
            const Icon(Icons.code),
            gapH2,
            TextButton(
              onPressed: () => ref
                  .read(socialLauncherControllerProvider.notifier)
                  .launchAnyLink(project.sourceCodeUrl!),
              child: Text(
                project.sourceCodeUrl!,
                style: context.bodyMedium?.copyWith(color: Colors.blue),
              ),
            ),
            gapH14,
          ],
          Text(
            l10n.technologiesTitle,
            style: context.bodyMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          gapH14,
          AsyncValueWidget(
            value: ref.watch(
              getTechnologiesByIdProvider(project.technologies),
            ),
            data: (data) {
              return Wrap(
                runSpacing: Sizes.p8,
                spacing: Sizes.p8,
                children: data.map((tech) {
                  return OutlinedButton.icon(
                    label: Text(tech.name, style: context.bodyMedium),
                    onPressed: null,
                    icon: TechnologyIcon(technology: tech, size: 15),
                  );
                }).toList(),
              );
            },
          ),
          gapH14,
          Text(
            l10n.screenshotsTitle,
            style: context.bodyMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          gapH14,
          ProjectImagesList(project: project),
          gapH14,
        ],
      ),
    );
  }
}
