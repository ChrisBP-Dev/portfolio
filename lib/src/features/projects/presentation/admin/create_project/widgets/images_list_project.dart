import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/image_memory_picked.dart';
import 'package:portfolio/src/features/projects/presentation/admin/create_project/admin_create_project_form_controller.dart';

class ImagesListProject extends ConsumerWidget {
  const ImagesListProject({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final project = ref.watch(adminCreateProjectFormControllerProvider);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: Wrap(
        alignment: WrapAlignment.spaceEvenly,
        runSpacing: 15,
        spacing: 20,
        children: List.generate(
          project.imagesUrls.length,
          (index) => SizedBox(
            height: 180,
            child: AspectRatio(
              aspectRatio: 9 / 16,
              child: ImageMemoryPicked(
                key: UniqueKey(),
                imageCharCode: project.imagesCharCodes[index],
                onImageAdded: (image) {
                  ref
                      .read(
                        adminCreateProjectFormControllerProvider.notifier,
                      )
                      .addImageUrl(image, index);
                },
                deleteTap: () {
                  ref
                      .read(
                        adminCreateProjectFormControllerProvider.notifier,
                      )
                      .removeImageUrl(index);
                },
              ),
            ),
          ),
        ),
      ),
    );
  }
}
