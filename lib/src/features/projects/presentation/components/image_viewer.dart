import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/common_widgets/wrap_network_image.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/bool_extensions.dart';
import 'package:portfolio/src/features/projects/domain/projects_repository.dart';
import 'package:portfolio/src/localization/l10n.dart';
import 'package:portfolio/src/routing/app_route.dart';

class ImageViewer extends StatelessWidget {
  const ImageViewer({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;

    return Scaffold(
      body: ResponsiveCenter(
        padding: const EdgeInsets.all(Sizes.globalPadding),
        child: Stack(
          fit: StackFit.expand,
          children: [
            Positioned.fill(
              child: GestureDetector(
                onTap: () => context.goNamed(AppRoute.projects.name),
              ),
            ),
            const MainImageViewer(),
            Positioned(
              top: 0,
              right: 0,
              child: OutlinedButton.icon(
                label: Text(l10n.close),
                icon: const Icon(Icons.close),
                onPressed: () => context.goNamed(AppRoute.projects.name),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class MainImageViewer extends ConsumerWidget {
  const MainImageViewer({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = GoRouterState.of(context);
    final extra = state.pathParameters;
    final projectId = extra['id'];

    void moveToPage(int index) {
      context.goNamed(
        AppRoute.imageViewer.name,
        pathParameters: {
          'id': projectId ?? '',
          'index': '$index',
        },
      );
    }

    return AsyncValueWidget(
      value: ref.watch(getProjectsStreamProvider),
      data: (projects) {
        final project =
            projects.firstWhere((element) => element.id == projectId);
        final currentIndex = int.parse(extra['index'] ?? '0')
            .clamp(0, project.screenshotsUrls.length - 1);
        return Row(
          children: [
            IconButton(
              icon: const Icon(Icons.arrow_back_ios),
              onPressed: (currentIndex != 0).whenOrNull(
                isTrue: () => () => moveToPage(currentIndex - 1),
              ),
            ),
            Expanded(
              child: WrapNetworkImage(
                imageUrl: project.screenshotsUrls[currentIndex],
                fit: BoxFit.contain,
              ),
            ),
            IconButton(
              icon: const Icon(Icons.arrow_forward_ios),
              onPressed: (currentIndex != project.screenshotsUrls.length - 1)
                  .whenOrNull(
                isTrue: () => () => moveToPage(currentIndex + 1),
              ),
            ),
          ],
        );
      },
    );
  }
}
