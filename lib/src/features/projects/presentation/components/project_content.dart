import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/common_widgets/business_chip_text.dart';
import 'package:portfolio/src/constants/app_sizes.dart';
import 'package:portfolio/src/features/home/presentation/components/knowledge/knowledge_icon.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/projects/presentation/components/project_images_list.dart';
import 'package:portfolio/src/features/settings/presentation/locale_controller.dart';
import 'package:portfolio/src/features/social_launcher/presentation/social_launcher_controller.dart';
import 'package:portfolio/src/localization/l10n.dart';

class ProjectContent extends ConsumerWidget {
  const ProjectContent({
    required this.project,
    super.key,
  });

  final Project project;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final l10n = context.l10n;
    final bodyText = theme.textTheme.bodyMedium;
    final headlineSmall = theme.textTheme.headlineSmall;
    return AsyncValueWidget(
      value: ref.watch(localeControllerProvider),
      data: (locale) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            project.companyName(locale.languageCode),
            style: headlineSmall,
          ),
          gapH14,
          Text(
            project.shortDescription(locale.languageCode),
            style: bodyText,
          ),
          gapH14,
          if (project.hasWebsite) ...[
            Text(
              l10n.websiteTitle,
              style: bodyText?.copyWith(fontWeight: FontWeight.bold),
            ),
            gapH2,
            TextButton(
              onPressed: () => ref
                  .read(socialLauncherControllerProvider.notifier)
                  .launchAnyLink(project.websiteUrl!),
              child: Text(
                project.websiteUrl!,
                style: bodyText?.copyWith(color: Colors.blue),
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
                style: bodyText?.copyWith(color: Colors.blue),
              ),
            ),
            gapH14,
          ],
          Text(
            l10n.technologiesTitle,
            style: bodyText?.copyWith(fontWeight: FontWeight.bold),
          ),
          gapH14,
          Wrap(
            runSpacing: Sizes.p8,
            spacing: Sizes.p8,
            children: project.technologies.map((tech) {
              return OutlinedButton.icon(
                label: Text(tech.name, style: bodyText),
                onPressed: null,
                icon: KnowledgeIcon(urlSvg: tech.imageUrl, size: 15),
              );
            }).toList(),
          ),
          gapH14,
          Text(
            l10n.screenshotsTitle,
            style: bodyText?.copyWith(fontWeight: FontWeight.bold),
          ),
          gapH14,
          ProjectImagesList(project: project),
          const Divider(thickness: .5),
          gapH14,
          BusinessChipText(text: l10n.featuresTitle),
          gapH14,
          ...project.features(locale.languageCode).map(
                (contribution) => Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '- ',
                      style: bodyText?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    Expanded(child: Text(contribution, style: bodyText)),
                  ],
                ),
              ),
          gapH14,
          const Divider(thickness: .5),
          gapH14,
          BusinessChipText(text: l10n.myContributionsTitle),
          gapH14,
          ...project.myContributions(locale.languageCode).map(
                (contribution) => Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '- ',
                      style: bodyText?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    Expanded(child: Text(contribution, style: bodyText)),
                  ],
                ),
              ),
        ],
      ),
    );
  }
}
