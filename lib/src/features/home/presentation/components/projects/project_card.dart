import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/features/home/presentation/components/projects/project_image_card.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/settings/presentation/locale_controller.dart';

class ProjectCard extends ConsumerWidget {
  const ProjectCard({
    required this.project,
    super.key,
    this.onTap,
  });
  final Project project;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final bodySmall = theme.textTheme.bodySmall;
    final headlineSmall =
        theme.textTheme.headlineSmall?.copyWith(color: Colors.white);

    return AsyncValueWidget(
      value: ref.watch(localeControllerProvider),
      data: (locale) {
        return ConstrainedBox(
          constraints: const BoxConstraints(
            maxWidth: 390,
            maxHeight: 301,
          ),
          child: AspectRatio(
            aspectRatio: 390 / 301,
            child: Card(
              color: theme.cardColor,
              clipBehavior: Clip.antiAlias,
              child: InkWell(
                onTap: onTap,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      flex: 3,
                      child: ProjectImageCard(imageUrl: project.mainImageUrl),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        vertical: Sizes.p14,
                        horizontal: Sizes.globalPadding,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            project.companyName(locale.languageCode),
                            style: headlineSmall,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            project.shortDescription(locale.languageCode),
                            style: bodySmall,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
