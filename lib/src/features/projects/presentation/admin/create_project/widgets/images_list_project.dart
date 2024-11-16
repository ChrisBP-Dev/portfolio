import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/image_memory_picked.dart';
import 'package:portfolio/src/core/utils/string_extensions.dart';
import 'package:portfolio/src/core/utils/unit8list_extension.dart';

class ImagesListProject extends StatelessWidget {
  const ImagesListProject({
    required this.screenshots,
    required this.onImageAdded,
    required this.deleteTap,
    super.key,
  });

  final List<String> screenshots;
  final void Function(String, int) onImageAdded;
  final void Function(String) deleteTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: Wrap(
        alignment: WrapAlignment.spaceEvenly,
        runSpacing: 15,
        spacing: 20,
        children: List.generate(
          screenshots.length,
          (index) => SizedBox(
            height: 180,
            child: AspectRatio(
              aspectRatio: 9 / 16,
              child: ImageMemoryPicked(
                key: UniqueKey(),
                imageCharCode: screenshots[index].charCode,
                onImageAdded: (newImage) =>
                    onImageAdded(newImage.codeUnitsString, index),
                deleteTap: () => deleteTap(screenshots[index]),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
