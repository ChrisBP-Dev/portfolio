import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/image_memory_picked.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/unit8list_extension.dart';
import 'package:portfolio/src/features/projects/domain/screenshot_image.dart';

class ImagesListProject extends StatelessWidget {
  const ImagesListProject({
    required this.screenshots,
    required this.onImageAdded,
    required this.deleteTap,
    super.key,
  });

  final List<ImageAndPath> screenshots;
  final void Function(ImageAndPath, int) onImageAdded;
  final void Function(int) deleteTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: SizedBox(
        height: 180,
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          itemCount: screenshots.length,
          itemBuilder: (context, index) {
            return AspectRatio(
              aspectRatio: 9 / 16,
              child: Padding(
                padding: const EdgeInsets.only(right: Sizes.p8),
                child: ImageMemoryPicked(
                  key: UniqueKey(),
                  image: screenshots[index],
                  onImageAdded: (newImage) => onImageAdded(
                    ImageAndPath(localImage: newImage.codeUnitsString),
                    index,
                  ),
                  deleteTap: () => deleteTap(index),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
