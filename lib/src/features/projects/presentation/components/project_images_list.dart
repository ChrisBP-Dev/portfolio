import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/core/common_widgets/wrap_network_image.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/routing/app_route.dart';

class ProjectImagesList extends StatelessWidget {
  const ProjectImagesList({required this.project, super.key});

  final Project project;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return SizedBox(
      height: 180,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: project.screenshots.length,
        itemBuilder: (context, index) {
          return InkWell(
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
              aspectRatio: 9 / 16,
              child: Padding(
                padding: const EdgeInsets.only(right: Sizes.p8),
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(Sizes.p8),
                    border: Border.all(color: theme.dividerColor),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(Sizes.p8),
                    child: WrapNetworkImage(
                      imageUrl: project.screenshots[index].url ?? '',
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
