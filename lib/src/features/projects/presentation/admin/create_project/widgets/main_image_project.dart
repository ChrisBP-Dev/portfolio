import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/image_memory_picked.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/constants/breakpoints.dart';
import 'package:portfolio/src/features/projects/presentation/admin/create_project/admin_create_project_form_controller.dart';

class MainImageProject extends ConsumerWidget {
  const MainImageProject({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final project = ref.watch(adminCreateProjectFormControllerProvider);
    return ResponsiveCenter(
      maxContentWidth: Breakpoint.mobile,
      child: AspectRatio(
        aspectRatio: 16 / 9,
        child: ImageMemoryPicked(
          imageCharCode: project.mainImageCharCode,
          onImageAdded: (image) {
            ref
                .read(
                  adminCreateProjectFormControllerProvider.notifier,
                )
                .setMainImageUrl(image);
          },
          deleteTap: () {
            ref
                .read(
                  adminCreateProjectFormControllerProvider.notifier,
                )
                .removeMainImageUrl();
          },
        ),
      ),
    );
  }
}
