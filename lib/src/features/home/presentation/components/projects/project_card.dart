import 'package:flutter/material.dart';
import 'package:portfolio/src/constants/app_sizes.dart';
import 'package:portfolio/src/features/home/presentation/components/projects/project_image_card.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/localization/l10n.dart';

class ProjectCard extends StatelessWidget {
  const ProjectCard({
    required this.project,
    super.key,
    this.onTap,
  });
  final Project project;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final bodySmall = theme.textTheme.bodySmall;
    final headlineSmall =
        theme.textTheme.headlineSmall?.copyWith(color: Colors.white);

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
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              context.l10n.clickHereToVisit.toUpperCase(),
                              style: bodySmall,
                            ),
                            Text(
                              project.companyNameEs,
                              style: headlineSmall,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                      gapW20,
                      const Icon(Icons.keyboard_tab_sharp, color: Colors.white),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
