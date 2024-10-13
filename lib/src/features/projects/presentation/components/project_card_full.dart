import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/common_widgets/responsive_center.dart';
import 'package:portfolio/src/constants/app_sizes.dart';
import 'package:portfolio/src/features/home/presentation/components/knowledge/knowledge_icon.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/settings/presentation/locale_controller.dart';
import 'package:portfolio/src/features/social_launcher/presentation/social_launcher_controller.dart';
import 'package:portfolio/src/localization/l10n.dart';
import 'package:portfolio/src/routing/app_route.dart';
import 'package:portfolio/src/utils/theme/color_app.dart';

class ProjectCardFull extends ConsumerWidget {
  const ProjectCardFull({
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

    return ResponsiveCenter(
      padding: const EdgeInsets.all(Sizes.globalPadding),
      child: AsyncValueWidget(
        value: ref.watch(localeControllerProvider),
        data: (locale) {
          return Container(
            decoration: BoxDecoration(
              // color: theme.cardColor,
              borderRadius: BorderRadius.circular(Sizes.p8),
              border: Border.all(color: theme.dividerColor),
            ),
            clipBehavior: Clip.antiAlias,
            child: Padding(
              padding: const EdgeInsets.all(Sizes.globalPadding),
              child: Column(
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
                    Consumer(
                      builder: (context, ref, _) {
                        return TextButton(
                          onPressed: () => ref
                              .read(socialLauncherControllerProvider.notifier)
                              .launchAnyLink(project.websiteUrl!),
                          child: Text(
                            project.websiteUrl!,
                            style: bodyText?.copyWith(color: Colors.blue),
                          ),
                        );
                      },
                    ),
                    gapH14,
                  ],
                  if (project.hasSourceCode) ...[
                    const Icon(Icons.code),
                    gapH2,
                    Consumer(
                      builder: (context, ref, _) {
                        return TextButton(
                          onPressed: () => ref
                              .read(socialLauncherControllerProvider.notifier)
                              .launchAnyLink(project.sourceCodeUrl!),
                          child: Text(
                            project.sourceCodeUrl!,
                            style: bodyText?.copyWith(color: Colors.blue),
                          ),
                        );
                      },
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
                    children: project.tecnologies.map((tech) {
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
                  SizedBox(
                    height: 150,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: project.imagesUrls.length,
                      itemBuilder: (context, index) {
                        return GestureDetector(
                          onTap: () {
                            context.goNamed(
                              AppRoute.imageViewer.name,
                              pathParameters: {
                                'id': project.id,
                                'index': '$index',
                              },
                            );
                          },
                          child: AspectRatio(
                            aspectRatio: 1,
                            child: Container(
                              clipBehavior: Clip.antiAlias,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(Sizes.p8),
                                border: Border.all(color: theme.dividerColor),
                                gradient: AppColor.textBusinessGradient,
                              ),
                              margin: const EdgeInsets.only(right: Sizes.p8),
                              // TODO(me): Change to CachedNetworkImage
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(Sizes.p8),
                                child: Image.asset(
                                  project.imagesUrls[index],
                                  fit: BoxFit.fill,
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
